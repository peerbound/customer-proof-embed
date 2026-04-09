# Security

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**. Instead, report it by emailing [security@peerbound.com](mailto:security@peerbound.com).

We will acknowledge your report within 2 business days and aim to release a fix within 14 days for critical issues. We'll keep you informed as we work through the issue.

## Supported Versions

Only the latest release receives security fixes. We recommend pinning to a specific version and following the [releases page](https://github.com/peerbound/customer-proof-embed/releases) for updates.

## Security Considerations for Implementors

### Content Security Policy

If your site uses a CSP, follow the guidance in the [README](README.md#content-security-policy) to add only the necessary directives. Avoid overly permissive rules like `script-src *`.

### Subresource Integrity

For production deployments, use the SRI hash provided on each [release](https://github.com/peerbound/customer-proof-embed/releases) to verify the widget script has not been tampered with. See the [README](README.md#versioning-and-self-hosting) for usage.

### Dependency Updates

We use [Dependabot](https://docs.github.com/en/code-security/dependabot) to monitor and update dependencies. Security patches are prioritized.
