# Security Policy

SteganoGuard is a client-side educational/portfolio project demonstrating applied steganography and cryptography. It has **not** undergone a formal third-party security audit — please read the "Security Notes & Limitations" section in the [README](README.md) before relying on it for anything sensitive.

## Reporting a Vulnerability

If you find a security issue (e.g. a flaw in the encryption/HMAC scheme, a way to leak the passphrase, an XSS vector in the message display, etc.):

1. **Please do not open a public GitHub issue.**
2. Instead, use GitHub's [private vulnerability reporting](../../security/advisories/new) (Security tab → "Report a vulnerability"), or open an issue titled only "Security issue — details sent privately" and I'll follow up for details via email.
3. Include steps to reproduce and, if possible, the potential impact.

I'll acknowledge reports within a few days and credit reporters in the changelog (unless you'd prefer to stay anonymous) once a fix ships.

## Scope

In scope:
- The embed/extract logic in `app.js`
- The key derivation, encryption, and HMAC implementation
- Any DOM-based XSS in how extracted messages are rendered

Out of scope:
- Statistical steganalysis detectability (this is a known, documented limitation of LSB steganography in general, not a bug specific to this implementation)
- Issues that require the attacker to already control the user's machine/browser
