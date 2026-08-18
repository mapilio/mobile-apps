# Security Policy

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability privately, email **info@mapilio.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof of concept
- Any relevant logs, screenshots, or code references

We will acknowledge your report within 5 business days and aim to provide a fix or mitigation plan within 30 days, depending on severity.

Please do not disclose the issue publicly until we have had the opportunity to investigate and release a fix.

## Scope

This policy covers the Mapilio mobile app (this repository) and the Mapilio API it communicates with (`end.mapilio.com`).

## Imagery Privacy

Mapilio captures and publishes street-level imagery. If you discover imagery that:

- Shows faces, licence plates, or other personally identifiable information that was not automatically blurred
- Was captured or published without the subject's knowledge in a jurisdiction where this is unlawful

please report it to the same address above, or use the in-app image reporting tool. We treat imagery privacy reports with the same urgency as security vulnerabilities.

## Supported Versions

We support only the latest release of the app. If you are running an older version, please update before reporting.

## Automated Secret Scanning

Pull requests and pushes to `main` are checked with a checksum-verified Gitleaks
8.30.1 binary. The gate scans both the new commit range and the complete tracked
tree at the candidate revision. Full-history scanning remains a separate public
release requirement until the historical credential remediation is complete.

## Preferred Languages

We accept reports in English and Turkish.
