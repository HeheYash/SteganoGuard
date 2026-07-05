# Contributing to SteganoGuard

Thanks for considering a contribution! This is a small, dependency-free static-site project, so the workflow is intentionally simple.

## Getting Set Up

```bash
git clone https://github.com/<your-username>/SteganoGuard.git
cd SteganoGuard
python3 -m http.server 8000
# visit http://localhost:8000
```

No build step, no `npm install` required to run the app itself (linting dependencies are only needed if you want to run the linters locally).

## Before Opening a Pull Request

1. **Open an issue first** for anything beyond a small fix/typo, so we can agree on the approach before you put in the work.
2. **Keep changes focused.** One logical change per PR is much easier to review than a bundle of unrelated fixes.
3. **Test manually** — since there's no automated test suite yet, walk through the embed → extract round trip yourself, including:
   - Plain message, no encryption
   - Encrypted message
   - Encrypted + HMAC integrity enabled
   - Extraction with a wrong passphrase (should fail cleanly, not crash)
   - A cover image at/near capacity limits
4. **Run the linters** if you touched `app.js`, `index.html`, or `style.css`:
   ```bash
   npx eslint app.js --no-eslintrc --env browser,es2021 --parser-options=ecmaVersion:2021
   npx htmlhint index.html
   npx stylelint style.css
   ```
5. **Don't introduce a build step or framework** without discussing it in an issue first — the zero-dependency nature of this project is intentional.

## Reporting Bugs

Please use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Browser and OS
- Steps to reproduce
- What you expected vs. what happened
- Console errors, if any (open DevTools → Console)

## Reporting Security Issues

Please see [SECURITY.md](SECURITY.md) — don't open a public issue for anything that could be a security vulnerability.

## Code Style

- Vanilla JS, ES6+, no new dependencies/frameworks without prior discussion.
- Match the existing naming conventions (camelCase for IDs/variables, since JS and HTML IDs are tightly coupled here).
- Keep the "no server, everything client-side" property intact — this is a core design goal, not an implementation detail.
