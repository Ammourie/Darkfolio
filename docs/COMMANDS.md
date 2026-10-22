# Darkfolio — commands reference

Run npm commands from the repo root. On Windows, Python is invoked as `py`; use `python3` on macOS/Linux if needed.

## Prerequisites

| Tool | Used for |
|------|----------|
| Node.js | App and `scripts/*.mjs` |
| `npm install` | Next.js dependencies |
| Python 3 + `pip install requests` | `download_play_screenshots.py` |
| FFmpeg | `convert-play-galleries-to-jpeg.mjs` (default path below) |

Default FFmpeg (override with `FFMPEG` env var):

`C:\Users\moham\OneDrive\Documents\ffmpeg-master-latest-win64-gpl-shared_2\bin\ffmpeg.exe`

---

## Next.js / app

```bash
npm run dev          # Dev server (Turbopack), port 9003
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

Genkit (AI dev, optional):

```bash
npm run genkit:dev
npm run genkit:watch
```

After adding or changing projects under `public/projects/`, restart `npm run dev` if new slugs do not appear (project list is cached in memory).

---

## Projects on disk

Each app lives in `public/projects/{slug}/`:

- `project.json` — metadata, locales, image paths, flags
- `main.*`, `cover.*` — hero / card assets
- `gallery/` — screenshot files

The site loads every folder that contains `project.json`, sorted by `order` (lower first).

### `project.json` flags (Google Play gallery pipeline)

| Field | Meaning |
|-------|---------|
| `google_play` | Play Store listing URL (required for automated gallery download) |
| `google_play_gallery_synced` | Gallery was downloaded via the Play script; batch sync **skips** unless `--force` |
| `google_play_gallery_jpeg` | Gallery was converted to JPEG with FFmpeg; optional skip with `--skip-jpeg` on convert script |

---

## Google Play — single app (Python)

Script: `scripts/download_play_screenshots.py`  
Downloads **gallery screenshots only** at full resolution (`--size s0` by default). Does not update `project.json`.

```bash
py scripts/download_play_screenshots.py "https://play.google.com/store/apps/details?id=com.osoustech.crenny&hl=en"

py scripts/download_play_screenshots.py com.osoustech.crenny

py scripts/download_play_screenshots.py com.osoustech.crenny -o public/projects/crenny-customer-app/gallery

py scripts/download_play_screenshots.py com.osoustech.crenny --list

py scripts/download_play_screenshots.py com.osoustech.crenny --skip 1

py scripts/download_play_screenshots.py com.osoustech.crenny --include-all

py scripts/download_play_screenshots.py com.osoustech.crenny --lang ar

py scripts/download_play_screenshots.py com.osoustech.crenny --size w2160-h3840
```

| Argument | Description |
|----------|-------------|
| `app` | Play URL or package id |
| `-o`, `--out` | Output directory (default: `{package}_screenshots`) |
| `-l`, `--lang` | Listing language (default: `en`) |
| `--size` | CDN size param (default: `s0` = original) |
| `--skip N` | Skip first N detected images |
| `--list` | Print detected images only; no download |
| `--include-all` | No filtering (includes icon, feature graphic, etc.) |

---

## Google Play — all portfolio projects (Node)

Script: `scripts/sync-all-play-galleries.mjs`  
Runs `download_play_screenshots.py` for each project with a non-empty `google_play` URL, writes into `gallery/`, updates `gallery_images`, sets `google_play_gallery_synced: true`, and clears `google_play_gallery_jpeg`.

```bash
node scripts/sync-all-play-galleries.mjs

node scripts/sync-all-play-galleries.mjs --force
```

| Flag | Behavior |
|------|----------|
| (none) | Skip projects where `google_play_gallery_synced` is already `true` |
| `--force` | Re-download all Play-linked projects (wipes existing `gallery/` files first) |

---

## Gallery — compress to JPEG (Node + FFmpeg)

Script: `scripts/convert-play-galleries-to-jpeg.mjs`  
Converts PNG/WebP (and re-encodes existing JPG) in `gallery/` using FFmpeg `-q:v 2` (high quality). Updates `gallery_images` paths to `.jpg` and sets `google_play_gallery_jpeg: true`.

Only processes projects with `google_play_gallery_synced: true`.

```bash
node scripts/convert-play-galleries-to-jpeg.mjs

node scripts/convert-play-galleries-to-jpeg.mjs --skip-jpeg
```

| Flag | Behavior |
|------|----------|
| (none) | Convert all Play-synced galleries (ignores `google_play_gallery_jpeg`) |
| `--skip-jpeg` | Skip projects that already have `google_play_gallery_jpeg: true` |

Custom FFmpeg binary:

```bash
set FFMPEG=C:\path\to\ffmpeg.exe
node scripts/convert-play-galleries-to-jpeg.mjs
```

---

## Recommended workflow — new Play Store project

1. Create `public/projects/my-app/` with `project.json` (`google_play`, locales, `main_image` / `cover_image` as needed).
2. Download gallery and update manifest:

   ```bash
   node scripts/sync-all-play-galleries.mjs
   ```

3. Shrink gallery files for the site:

   ```bash
   node scripts/convert-play-galleries-to-jpeg.mjs
   ```

4. Restart dev server if the project does not show on the home page.

To refresh screenshots for one app later:

```bash
node scripts/sync-all-play-galleries.mjs --force
node scripts/convert-play-galleries-to-jpeg.mjs
```

(Or use `--force` only after removing `google_play_gallery_synced` from that project’s JSON if you prefer a single-project re-run via the Python script and manual JSON edits.)

---

## Quick reference

| Task | Command |
|------|---------|
| Local dev | `npm run dev` |
| Production build | `npm run build` |
| Download all new Play galleries | `node scripts/sync-all-play-galleries.mjs` |
| Re-download all Play galleries | `node scripts/sync-all-play-galleries.mjs --force` |
| One app gallery (manual) | `py scripts/download_play_screenshots.py "<play-url>" -o path/to/gallery` |
| JPEG optimize all synced galleries | `node scripts/convert-play-galleries-to-jpeg.mjs` |
| JPEG optimize only not yet converted | `node scripts/convert-play-galleries-to-jpeg.mjs --skip-jpeg` |

---

## Vercel deploy → Telegram (GitHub Actions)

Vercel Hobby has no project webhooks. With **GitHub + Vercel** linked, use `.github/workflows/telegram-deploy-notify.yml` (runs on `deployment_status`).

1. Create a bot via [@BotFather](https://t.me/BotFather). If a token was ever leaked, `/revoke` and issue a new one.
2. Add GitHub Actions secrets (CLI from repo root, after `gh auth login`):

   ```powershell
   gh secret set TELEGRAM_BOT_TOKEN --body "YOUR_TOKEN"
   gh secret set TELEGRAM_CHAT_ID --body "YOUR_CHAT_ID"
   ```

   Or: repo **Settings** → **Secrets and variables** → **Actions**.

3. Push the workflow to your default branch and trigger a Vercel deploy.

Deploys must show under the repo **Deployments** tab (official Vercel ↔ GitHub integration).
