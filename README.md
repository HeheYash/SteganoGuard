# SteganoGuard

[![Lint](https://github.com/HeheYash/SteganoGuard/actions/workflows/lint.yml/badge.svg)](https://github.com/HeheYash/SteganoGuard/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](#tech-stack)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blueviolet.svg)](CONTRIBUTING.md)

A client-side, browser-based steganography tool that hides secret messages inside PNG/BMP images using LSB (Least Significant Bit) encoding, with optional AES-256-GCM encryption and HMAC-SHA256 integrity verification.

Everything runs **entirely in the browser** — no server, no upload, no backend. Images and messages never leave the user's machine.

**[Live Demo](https://HeheYash.github.io/SteganoGuard/)** · **[Report a Bug](.github/ISSUE_TEMPLATE/bug_report.md)** · **[Request a Feature](.github/ISSUE_TEMPLATE/feature_request.md)**

> If the Live Demo link 404s, GitHub Pages hasn't been enabled yet — see [Deployment](#deployment) for the one-time setup.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)
- [Security Notes & Limitations](#security-notes--limitations)
- [Known Limitations / Roadmap](#known-limitations--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **LSB Steganography** — hides data in the least significant bit of the R, G, and B channels of each pixel (3 bits/pixel), leaving the image visually unchanged.
- **Two independent, optional passphrases** — one for confidentiality, one for authenticity. They're separate on purpose:
  - **AES-256-GCM Encryption** (confidentiality) — encrypts the message with an *encryption passphrase* before embedding, using PBKDF2 (100,000 iterations, SHA-256) for key derivation. Without this passphrase, no one can read the message even if they know it's hidden in the image.
  - **HMAC-SHA256 Integrity Check** (authenticity) — signs the payload with a separate *integrity passphrase* so a recipient can verify the message genuinely came from you and wasn't tampered with, independent of whether encryption is enabled. You can reuse the same passphrase for both if you don't need that separation, or use different ones for a stronger boundary between "who can read it" and "who can prove it's genuine."
- **SHA-256 Corruption Check** — every payload embeds a SHA-256 digest, so corrupted or truncated extractions are caught immediately with a clear error instead of returning garbage.
- **Capacity Meter** — live feedback on how much of the image's embedding capacity your message will use before you hit "Generate."
- **Password Strength Meter** — quick feedback while choosing an encryption passphrase.
- **Drag-and-drop uploads**, text file import for messages, dark mode, and toast notifications.
- **Backward-compatible extraction** — can still read the legacy `STEG1` header format from earlier versions of the tool.

## Screenshots

> Add your own screenshots to the `screenshots/` folder — see [screenshots/README.md](screenshots/README.md) for guidance — then swap these placeholders for real `![alt](screenshots/your-file.png)` images.

| Hide Message | Extract Message |
|---|---|
| *(screenshot placeholder)* | *(screenshot placeholder)* |

## How It Works

### Capacity

Each pixel contributes 3 usable bits (R, G, B LSBs — alpha is skipped), so:

```
capacity (bytes) = (width × height × 3) / 8
```

### Payload Format (`STEG2`)

```
[ magic "STEG2" (5B) ][ flags (1B) ][ payload length (4B, LE) ]
  [ salt (16B) — if encrypted or HMAC enabled ]
  [ iv (12B) — if encrypted ]
  [ SHA-256 of payload (32B) ]
  [ HMAC-SHA256 of payload (32B) — if integrity check enabled ]
  [ payload bytes ]
```

- `flags` bit 0 → payload is AES-GCM encrypted
- `flags` bit 1 → an HMAC is present for integrity/authenticity verification

On extraction, the SHA-256 is always checked first (catches corruption/truncation). If an HMAC is present, it's verified next using the integrity passphrase the recipient enters (catches tampering by anyone who doesn't know that passphrase). Only after both checks pass is the payload decrypted (if encrypted) and shown to the user.

### Two Passphrases, Two Different Jobs

The UI has two separate passphrase fields because they answer two different questions:

| | Encryption Passphrase | Integrity Passphrase |
|---|---|---|
| **Question it answers** | "Can you read this?" | "Is this really from who it claims to be, unaltered?" |
| **Property** | Confidentiality | Authenticity / tamper-evidence |
| **Primitive** | AES-256-GCM | HMAC-SHA256 |
| **Required together?** | No — either can be enabled independently | No — either can be enabled independently |

They can be set to the same value if you don't need the distinction, or kept different so that, for example, someone could verify a message is authentic without necessarily being able to decrypt it (or vice versa).

### Crypto Details

| Purpose | Primitive |
|---|---|
| Message encryption | AES-256-GCM |
| Encryption key derivation | PBKDF2-SHA256, 100,000 iterations, random 16-byte salt |
| Integrity key derivation | PBKDF2-SHA256, 150,000 iterations, random 16-byte salt |
| Integrity tag | HMAC-SHA256 |
| Corruption check | SHA-256 |

All cryptographic operations use the browser's native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (`crypto.subtle`) — no third-party crypto libraries.

## Getting Started

No build step, no dependencies. It's a static site.

```bash
git clone https://github.com/HeheYash/SteganoGuard.git
cd SteganoGuard
```

Then either open `index.html` directly in a browser, or serve it locally (recommended, since some browsers restrict certain APIs on `file://`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Usage

**To hide a message:**
1. Upload a PNG or BMP cover image (max 16MB, max 8 megapixels).
2. Type or upload (`.txt`) your secret message.
3. Optionally enable AES encryption with a passphrase, and/or an integrity HMAC with a separate passphrase.
4. Click **Generate Stego Image** to download the resulting PNG.

**To extract a message:**
1. Upload the stego PNG/BMP.
2. Enter the decryption passphrase (if it was encrypted) and/or the integrity passphrase (if one was set).
3. Click **Extract Hidden Message**.

## Deployment

Since this is a fully static site with no build step, [GitHub Pages](https://pages.github.com/) is the simplest way to host a live demo:

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — your live demo will be at `https://HeheYash.github.io/SteganoGuard/`.
5. Update the "Live Demo" link at the top of this README with that URL.

## Tech Stack

- Vanilla JavaScript (ES6+, no frameworks)
- HTML5 Canvas API for pixel-level image manipulation
- Web Crypto API for AES-GCM, PBKDF2, HMAC, and SHA-256
- Plain CSS (custom properties for theming, light/dark mode)

## Security Notes & Limitations

This is a learning/portfolio project demonstrating applied cryptography and steganography concepts — please read this section before relying on it for anything sensitive.

- **Steganography ≠ encryption.** LSB steganography hides *that* a message exists; it does not by itself protect the message's *contents*. Always enable AES encryption for anything sensitive.
- **Only PNG/BMP are safe cover images.** Lossy formats like JPEG destroy LSB data on re-compression, so uploads are intentionally restricted to PNG/BMP.
- **LSB steganography is detectable.** Statistical steganalysis tools (chi-square attacks, RS analysis, etc.) can flag images that likely contain LSB-embedded data, even without extracting it. This tool does not attempt to defeat statistical steganalysis.
- **Passphrase strength matters.** PBKDF2 slows down brute-forcing but doesn't replace a weak passphrase. Use a strong, unique passphrase.
- **Re-saving/re-compressing a stego image will destroy the hidden data**, since it depends on exact pixel values.
- **No metadata scrubbing.** This tool doesn't strip EXIF or other metadata from the output image — do that separately if it matters for your use case.

## Known Limitations / Roadmap

- [ ] Add automated tests for the embed/extract round-trip and the legacy `STEG1` compatibility path
- [ ] Support additional lossless formats (e.g. WebP lossless)
- [ ] Add a CLI/Node version for scripted embedding
- [ ] Optional bit-distribution randomization to reduce statistical detectability

## Contributing

Issues and pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, testing expectations, and code style.

Found a security issue? Please follow [SECURITY.md](SECURITY.md) instead of opening a public issue.

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

MIT — see [LICENSE](LICENSE).
