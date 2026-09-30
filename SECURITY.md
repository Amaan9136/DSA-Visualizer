# Security Policy

## Supported Versions

This is a static, client-side project deployed from the `main` branch. Only the latest commit on `main` is supported with security fixes.

## Reporting a Vulnerability

Please do not open a public issue for security problems.

1. Go to the repository's **Security** tab and choose **Report a vulnerability** to open a private advisory.
2. Include a description, the affected file or feature, steps to reproduce, and the potential impact.

You can expect an acknowledgement within 7 days. Confirmed issues will be fixed as soon as practical and credited in the release notes unless you prefer to stay anonymous.

## Scope

In scope: cross-site scripting through user-provided input (custom arrays, text inputs, graph data), unsafe handling of clipboard or download features, and vulnerable third-party scripts loaded from CDNs.

Out of scope: issues that require a compromised browser or device, denial of service through extremely large inputs entered by the user themselves, and vulnerabilities in third-party CDNs that are not caused by how this project loads them.

## Good Practices for Contributors

- Never use `eval`, `new Function`, or `innerHTML` with unescaped user input.
- Do not add external scripts without pinning a version.
- Do not commit secrets, tokens, or personal data.
