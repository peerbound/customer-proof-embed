#!/bin/bash

# Exit on first error
set -e

if [ "$DEBUG" = true ]; then
    set -x
fi

# # Runs at the end regardless of success or failure
cleanup() {
    git checkout -q main || {
        echo "Failed to checkout main branch"
    }

    # Delete local branch regardless of success or failure
    if [ "$local_branch_creation_success" = true ]; then
        git branch -D "$branch_name" >/dev/null || {
            echo "Failed to delete local branch $branch_name"
        }
    fi

    if [ "$release_completed" = false ]; then
        # Delete remote branch (this will auto-close the PR too)
        if [ "$remote_branch_creation_success" = true ]; then
            git push -q origin --delete "$branch_name" || {
                echo "Failed to delete remote branch $branch_name"
            }
        fi

        # Delete release and tag
        if [ "$release_creation_success" = true ]; then
            gh release delete "$tag_name" --yes --cleanup-tag >/dev/null || {
                echo "Failed to delete release $tag_name"
            }
        fi
    fi
}

# Get environment from first argument
ENV=$1

if [ -z "$ENV" ]; then
    echo "No environment argument provided. Call with 'staging' or 'production'."
    exit 1
fi

# Only accept "staging" or "production"
if [ "$ENV" != "staging" ] && [ "$ENV" != "production" ]; then
    echo "Invalid environment argument. Must be either 'staging' or 'production'."
    exit 1
fi

# Load environment variables (later overrides earlier)
[ -f ".env" ] && source ".env"
[ -f ".env.local" ] && source ".env.local"
[ -f ".env.$ENV" ] && source ".env.$ENV"
[ -f ".env.$ENV.local" ] && source ".env.$ENV.local"

if [ -z "$S3_BUCKET" ]; then
    echo "S3_BUCKET is not set. Check your .env files."
    exit 1
fi

if [ -z "$AWS_PROFILE" ]; then
    echo "AWS_PROFILE is not set. Check your .env files."
    exit 1
fi

# Ensure we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "You must be on the main branch to create a new release."
    exit 1
fi

# Ensure we have a clean working directory
if [ -n "$(git status --porcelain)" ]; then
    echo "You must have a clean working directory to create a new release."
    exit 1
fi

# Ensure we're in sync with remote
git fetch -q origin
local_commit=$(git rev-parse HEAD)
remote_commit=$(git rev-parse origin/main)

if [ "$local_commit" != "$remote_commit" ]; then
    echo "Your local branch is not in sync with origin/main. Please pull or push changes first."
    exit 1
fi

status_json=$(pnpm changeset status --output=/dev/stdout) || {
    echo "No changesets found."
    exit 1
}

num_versions=$(echo "$status_json" | jq -r '.releases | length')
if [ "$num_versions" -gt 1 ]; then
    # Do not proceed if status contains multiple version releases
    # This should never happen (this would only happen in the case of a monorepo)
    echo "Multiple version releases not supported."
    exit 1
fi

version=$(echo "$status_json" | jq -e -r '.releases[0].newVersion') || {
    echo "No changesets found."
    exit 1
}

# Create bulleted list of release notes
notes=$(echo "$status_json" | jq -r '.changesets | map("- " + .summary) | join("\n")')

# Run cleanup function post-run regardless of success or failure
trap cleanup EXIT

# Track success/failure of each step for cleanup
local_branch_creation_success=false
remote_branch_creation_success=false
release_creation_success=false

release_completed=false

# Checkout a new branch for version bump
tag_name="v$version"
branch_name="bump-$tag_name"

# Create local branch
echo "Creating release branch..."
if git show-ref --verify --quiet "refs/heads/$branch_name"; then
    echo "Local branch $branch_name already exists"
    exit 1
else
    git checkout -q -b "$branch_name"
    local_branch_creation_success=true
fi

echo "Bumping version to $tag_name..."
pnpm changeset version >/dev/null

git add .
git commit --no-verify -q -m "Bump version to $tag_name"

# Create remote branch
echo "Pushing to remote..."
if git ls-remote --exit-code --heads origin "$branch_name" >/dev/null 2>&1; then
    echo "Remote branch $branch_name already exists"
    exit 1
else
    git push -q origin "$branch_name" 2>/dev/null
    remote_branch_creation_success=true
fi

echo "Building release assets..."
pnpm tsc -b && pnpm vite build --mode release --logLevel silent

# Create release
echo "Creating GitHub release..."
if gh release view "$tag_name" >/dev/null 2>&1; then
    echo "Release $tag_name already exists."
    exit 1
else
    release_url=$(gh release create "$tag_name" ./dist-release/widget.js ./dist-release/widget.min.js --notes "$notes" --target "$branch_name")
    release_creation_success=true
fi

echo "Opening pull request..."
pr_url=$(gh pr create --base main --head "$branch_name" --title "Bump version to $tag_name" --body "$notes")

release_completed=true

echo ""
echo "🎉 Release $tag_name successfully created."
echo "$release_url"
echo ""
echo "Merge this PR to bump the version:"
echo "$pr_url"
