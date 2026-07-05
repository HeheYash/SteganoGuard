# Changelog

All notable changes to this project are documented here.
This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

## [1.1.0] — 2026-07-05

### Fixed
- AES Encryption toggle switch didn't visually animate — the Integrity HMAC block had been nested between the checkbox and its `.toggle-slider` in the markup, breaking the `input:checked + .toggle-slider` CSS sibling selector the switch relies on. The checkbox's state still worked correctly (JS-driven behavior was unaffected), only the visual slider was stuck.

### Changed
- Clarified the UI and README around the two independent optional passphrases: renamed the plain "Passphrase" field to "Encryption Passphrase" and added a matching "Integrity Passphrase" label, added "Confidentiality" / "Authenticity" section headers and explanatory hint text so it's clear these protect against different things (message secrecy vs. tamper/authenticity verification) rather than being duplicate fields.
- Integrity HMAC toggle now uses the same animated switch style as the encryption toggle, instead of a plain checkbox.

## [1.0.0] — 2026-07-05

### Added
- Initial public release: LSB steganography for PNG/BMP images
- Optional AES-256-GCM encryption with PBKDF2 key derivation
- Optional HMAC-SHA256 integrity/authenticity verification, independent of the encryption passphrase
- SHA-256 corruption check on every extraction
- Live capacity meter and passphrase strength meter
- Drag-and-drop image upload, `.txt` message import, dark mode
- Backward-compatible extraction for the legacy `STEG1` header format

### Fixed
- Cover image dropzone was completely non-functional — `app.js` referenced `#imageInput`, but the actual element was `#coverInput`, so no click/drag handlers were ever attached
- A stray `s` token after the success toast in `extractMessage()` threw a `ReferenceError` on every successful extraction
- File picker `accept` attributes included JPEG/WebP, which the validator rejected anyway — narrowed to PNG/BMP to match actual behavior
