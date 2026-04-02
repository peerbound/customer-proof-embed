# Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Releases are deployed via GitHub Actions.

## Documenting Changes

When you make a change that should be noted in the changelog, run:

```sh
pnpm changeset
```

This will prompt you to:

1. Select the type of change (patch, minor, major)
2. Write a summary of the change

Changesets are committed with your code and accumulated until a release.

## Deploying to Staging

1. Push your changes to the `staging` branch
2. Go to **Actions** > **Deploy & Release** in GitHub
3. Click **Run workflow**
4. Select **staging** as the environment and the `staging` branch
5. Click **Run workflow**

This builds the widget and deploys it to `widget@latest.js` in the staging environment. No version bump or GitHub release is created.

Deployment branches are enforced by GitHub—you cannot deploy `staging` to production or `main` to staging.

## Creating a Production Release

Production releases create a versioned file, a GitHub release, and update `widget@latest.js`.

1. Ensure all changesets are merged to `main`
2. Go to **Actions** > **Deploy & Release** in GitHub
3. Click **Run workflow**
4. Select **production** as the environment and the `main` branch
5. Click **Run workflow**

The workflow will:

1. Run linting and tests
2. Determine the new version from accumulated changesets
3. Create a release branch (`bump-v{version}`)
4. Build the production assets
5. Upload the versioned widget to S3 (`widget@{version}.js`)
6. Create a GitHub release with the widget files attached
7. Open a PR to merge the version bump back to `main`
8. Deploy to `widget@latest.js`
9. Invalidate the CloudFront cache

After the workflow completes, **merge the PR** to finalize the version bump in the repository.

## Widget URLs

After a production release, customers can use either:

- **Latest (auto-updates):** `https://embed.peerbound.com/scripts/widget@latest.js`
- **Pinned version:** `https://embed.peerbound.com/scripts/widget@{version}.js`

The legacy path `/v1/widget.js` is also updated but deprecated.
