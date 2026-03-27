# Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Documenting Changes

When you make a change that should be noted in the changelog, run:

```sh
pnpm changeset
```

This will prompt you to:

1. Select the type of change (patch, minor, major)
2. Write a summary of the change

Changesets are committed with your code and accumulated until a release.

## Creating a Release

When ready to release, ensure you are on `main` with a clean working directory and run:

```sh
pnpm release
```

This will:

1. Determine the new version from accumulated changesets
2. Update the changelog and version
3. Build the production assets
4. Create a GitHub release with the widget files attached
5. Open a PR to merge the version bump back to main

After the script completes, merge the PR to finalize the release.
