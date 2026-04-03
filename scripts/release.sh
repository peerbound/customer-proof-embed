#!/bin/bash

set -e

if [ "$DEBUG" = true ]; then
    set -x
fi

# ------------------------------------------------------------------------------
# Validation
# ------------------------------------------------------------------------------

validate_branch() {
    if [ -z "$GITHUB_REF_NAME" ]; then
        echo "GITHUB_REF_NAME is not set. This script must be run in GitHub Actions." >&2
        exit 1
    fi

    if [ "$ENV" = "production" ] && [ "$GITHUB_REF_NAME" != "main" ]; then
        echo "Production releases must be run from the 'main' branch (current: '$GITHUB_REF_NAME')." >&2
        exit 1
    elif [ "$ENV" = "staging" ] && [ "$GITHUB_REF_NAME" != "staging" ]; then
        echo "Staging releases must be run from the 'staging' branch (current: '$GITHUB_REF_NAME')." >&2
        exit 1
    fi
}

validate_env() {
    if [ -z "$S3_BUCKET" ]; then
        echo "S3_BUCKET is not set. Check your environment variables." >&2
        exit 1
    fi

    if [ -z "$DISTRIBUTION_ID" ]; then
        echo "DISTRIBUTION_ID is not set. Check your environment variables." >&2
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# Shared functions
# ------------------------------------------------------------------------------

build_release_assets() {
    echo "Building release assets..."
    pnpm tsc -b && pnpm vite build --mode release --logLevel silent
}

deploy_latest_to_s3() {
    echo "Uploading latest widget file to S3..."

    s3_latest_paths=(
        "s3://${S3_BUCKET}/scripts/widget@latest.js"
        "s3://${S3_BUCKET}/v1/widget.js"  # Deprecated but still in use by some customers
    )

    for s3_path in "${s3_latest_paths[@]}"; do
        aws s3 cp dist-release/widget.min.js "${s3_path}" \
            --content-type "application/javascript" \
            --cache-control "public, max-age=3600" \
            --only-show-errors
    done
}

# ------------------------------------------------------------------------------
# Staging release
# ------------------------------------------------------------------------------

release_staging() {
    build_release_assets
    deploy_latest_to_s3

    echo ""
    echo "🎉 Latest widget file successfully deployed to S3."
    echo ""
}

# ------------------------------------------------------------------------------
# Production release
# ------------------------------------------------------------------------------

# Runs at the end regardless of success or failure
cleanup() {
    git checkout -q main || {
        echo "Failed to checkout main branch" >&2
    }

    # Delete local branch regardless of success or failure
    if [ "$local_branch_creation_success" = true ]; then
        git branch -D "$branch_name" >/dev/null || {
            echo "Failed to delete local branch $branch_name" >&2
        }
    fi

    if [ "$release_completed" = false ]; then
        # Delete remote branch (this will auto-close the PR too)
        if [ "$remote_branch_creation_success" = true ]; then
            git push -q origin --delete "$branch_name" || {
                echo "Failed to delete remote branch $branch_name" >&2
            }
        fi

        if [ "$versioned_file_creation_success" = true ]; then
            aws s3 rm "${s3_versioned_path}" || {
                echo "Failed to delete S3 file: ${s3_versioned_path}" >&2
            }
        fi

        # Delete release and tag
        if [ "$release_creation_success" = true ]; then
            gh release delete "$tag_name" --yes --cleanup-tag >/dev/null || {
                echo "Failed to delete release $tag_name" >&2
            }
        fi
    fi
}

release_production() {
    # Get changeset status
    status_json=$(pnpm changeset status --output=/dev/stdout) || {
        echo "No changesets found." >&2
        exit 1
    }

    num_versions=$(echo "$status_json" | jq -r '.releases | length')
    if [ "$num_versions" -gt 1 ]; then
        # This should never happen (would only happen in a monorepo)
        echo "Multiple version releases not supported." >&2
        exit 1
    fi

    version=$(echo "$status_json" | jq -e -r '.releases[0].newVersion') || {
        echo "No changesets found." >&2
        exit 1
    }

    # Create bulleted list of release notes
    release_notes=$(echo "$status_json" | jq -r '.changesets | map("- " + .summary) | join("\n")')

    # Track success/failure of each step for cleanup
    local_branch_creation_success=false
    remote_branch_creation_success=false
    versioned_file_creation_success=false
    release_creation_success=false
    release_completed=false

    tag_name="v$version"
    branch_name="bump-$tag_name"

    # Create local branch
    echo "Creating release branch..."
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        echo "Local branch $branch_name already exists" >&2
        exit 1
    else
        git checkout -q -b "$branch_name"
        local_branch_creation_success=true
    fi

    echo "Bumping version to $tag_name..."
    pnpm changeset version >/dev/null

    echo "Updating README version references..."
    sed -i'' -e "s|widget@[0-9]*\.[0-9]*\.[0-9]*\.js|widget@${version}.js|g" README.md

    git add .
    git commit --no-verify -q -m "Bump version to $tag_name"

    # Create remote branch
    echo "Pushing to remote..."
    if git ls-remote --exit-code --heads origin "$branch_name" >/dev/null 2>&1; then
        echo "Remote branch $branch_name already exists" >&2
        exit 1
    else
        git push -q origin "$branch_name" 2>/dev/null
        remote_branch_creation_success=true
    fi

    build_release_assets

    echo "Uploading versioned widget file to S3..."
    s3_versioned_path="s3://${S3_BUCKET}/scripts/widget@${version}.js"

    # Ensure we do not overwrite an existing versioned file
    if aws s3 ls "${s3_versioned_path}" 2>/dev/null; then
        echo "File already exists in S3: ${s3_versioned_path}" >&2
        exit 1
    fi

    # Upload versioned file (immutable - cache forever)
    aws s3 cp dist-release/widget.min.js "${s3_versioned_path}" \
        --content-type "application/javascript" \
        --cache-control "public, max-age=31536000, immutable" \
        --only-show-errors

    versioned_file_creation_success=true

    # Generate integrity hash and release notes
    widget_js_url="https://embed.peerbound.com/scripts/widget@${version}.js"
    integrity_hash="sha384-$(openssl dgst -sha384 -binary dist-release/widget.min.js | openssl base64 -A)"

    notes="$(cat <<EOF
### Release Notes
$release_notes

### Embed Script URL
\`\`\`
${widget_js_url}
\`\`\`

### Script Tag
\`\`\`html
<script
  src="${widget_js_url}"
  crossorigin="anonymous"
  integrity="${integrity_hash}"
></script>
\`\`\`
EOF
)"

    # Create release
    echo "Creating GitHub release..."
    if gh release view "$tag_name" >/dev/null 2>&1; then
        echo "Release $tag_name already exists." >&2
        exit 1
    else
        release_url=$(gh release create "$tag_name" ./dist-release/widget.js ./dist-release/widget.min.js --notes "$notes" --target "$branch_name")
        release_creation_success=true
    fi

    echo "Opening pull request..."
    pr_url=$(gh pr create --base main --head "$branch_name" --title "Bump version to $tag_name" --body "$notes")

    # Must be last, we don't revert this
    deploy_latest_to_s3

    release_completed=true

    echo ""
    echo "🎉 Release $tag_name successfully created."
    echo "$release_url"
    echo ""
    echo "Merge this PR to bump the version:"
    echo "$pr_url"
}

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

validate_branch
validate_env

if [ "$ENV" = "production" ]; then
    trap cleanup EXIT
    release_production
elif [ "$ENV" = "staging" ]; then
    release_staging
else
    echo "Invalid ENV: '$ENV'. Must be 'staging' or 'production'." >&2
    exit 1
fi
