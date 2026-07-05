# Screenshots

- `hide-tab.png` — the "Hide Message" tab with a cover image loaded and a message entered ✅
- `extract-tab.png` — the "Extract Message" tab showing a successfully decoded message ✅

Both are already referenced in the main [README.md](../README.md). Since the app defaults to dark mode based on system preference, these already show the dark theme — no separate `dark-mode.png` needed unless you want to also show the light theme for comparison.

To add more screenshots later (e.g. light mode, encryption enabled, capacity meter near limit):
1. Run the app locally (`python3 -m http.server 8000` from the repo root).
2. Use your browser's screenshot tool, or a full-page capture extension, at a standard width (e.g. 1440px) for consistency.
3. Save as PNG into this folder, then reference from `README.md`:

```markdown
![Alt text](screenshots/your-file.png)
```
