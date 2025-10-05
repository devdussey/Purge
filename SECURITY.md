# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**We take security seriously.** If you discover a security vulnerability in Purge, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email: **devdussey@gmail.com**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **Initial response:** Within 48 hours
- **Status update:** Within 7 days
- **Fix timeline:** Depends on severity
  - Critical: 24-72 hours
  - High: 7 days
  - Medium: 30 days
  - Low: Next release cycle

### Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will credit you in the release notes (unless you prefer to remain anonymous)
- We ask that you do not publicly disclose the vulnerability until we've had a chance to fix it

### Security Best Practices

**For Users:**
- Always download Purge from official sources only
- Keep the app updated to the latest version
- Enable auto-updates in Settings
- Review permissions before granting access

**What We Do:**
- No telemetry sent without user consent
- All network requests use HTTPS
- Firebase authentication with industry-standard encryption
- No third-party tracking or analytics (except Firebase for crash reports)
- Local settings stored in `%APPDATA%/Purge/` (user-access only)

### Security Features

Purge is designed with security in mind:
- **No admin rights required** - Runs as standard user
- **Open source** - Code is publicly auditable
- **Minimal permissions** - Only requests necessary system access
- **Privacy-first** - No data collection beyond crash reports (opt-in)
- **Encrypted storage** - Sensitive settings encrypted at rest

### Known Limitations

As a beta product, please be aware:
- Clipboard monitoring requires clipboard access permission
- File system watching requires read access to monitored folders
- Network access needed for phishing URL checks and updates

### Bug Bounty

We currently do not have a formal bug bounty program, but we deeply appreciate responsible disclosure and will:
- Publicly credit security researchers (with permission)
- Provide early access to new features
- Consider rewards on a case-by-case basis for critical findings

---

**Thank you for helping keep Purge and our users safe!**

© 2025 DevDussey. All rights reserved.