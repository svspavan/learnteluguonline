# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project overview

LearnTeluguOnline.com — a static site (no build system, no package manager, no framework) that teaches Telugu vocabulary, alphabet, grammar, numbers, categories, sentences, stories, and padyalu (poems) to English speakers. Every page is a hand-written `.html` file loading a shared stylesheet and script, plus a small inline `<script>` for page-specific logic. Continue and improve the existing site — do not restart or re-architect unless explicitly asked.

## Running locally

No build step. Serve the folder with a static file server — pages `fetch()` local JSON and audio, which fails under `file://`:
```
npx serve .
# or
python -m http.server 8000
```
No test suite, linter, or CI config in this repo.

## Architecture

### Content pattern: index + detail pages, driven by JSON

Each content section (`words/`, `numbers/`, `alphabet/`, `categories/`, `grammar/`, `sentences/`, `stories/`, `padyalu/`) follows the same three-piece pattern:

1. **`data/*.json`** — the actual content, keyed by id (e.g. `words/data/words.json` keyed by `"amma"`, `"nanna"`). Fields are consistent within a section (`telugu`, `english`, `audio`, plus section-specific extras like `example`/`example_english`).
2. **`index.html`** — fetches the JSON, builds a card grid (`#...Grid.module-grid`) linking to the detail page via query param, e.g. `word.html?name=amma`.
3. **`word.html` / `number.html` / `item.html`** — reads the id from `URLSearchParams`, fetches the same JSON, looks up the entry, renders it.

`categories/` is one level deeper: `categories/index.html` lists categories → `category.html?name=colors` loads `categories/data/colors.json` → `item.html` shows one item. Category audio lives under `categories/audio/<category>/`.

**When adding new content: edit the relevant `data/*.json` file first. Only touch HTML if a new field needs new markup.** Follow the existing pattern for that section — don't introduce a new structure.

### Shared assets (`assets/`)

- `assets/css/style.css` — single global stylesheet (theme variables, `.module-grid`/`.module-card`, audio player, breadcrumb, header/nav).
- `assets/js/script.js` — loaded on every page:
  - `window.initAudioPlayers()` — wires up `.audio-player` elements (`data-src`, `.play-btn`, `.progress-bar`, `.time-label`). Re-invoke after dynamically inserting new `.audio-player` markup.
  - `handleGlobalSearch` — preloads `words/data/words.json`, resolves a typed query across letters/words/numbers/categories/padyalu, redirects to the matching detail page.
  - `buildBreadcrumb(parts)` — fills `#breadcrumb` given `[{label, link?}]`.
  - `initTheme()` — light/dark toggle, persisted to `localStorage["theme"]`, applied via `.dark-mode` on `<body>`.
  - `toggleMenu()` — mobile nav toggle.

### Page conventions

- Every page: same header/nav/theme-toggle markup, breadcrumb, `<main class="page-container">`, footer — copy verbatim from a sibling page, update the active nav link and breadcrumb.
- Paths are relative and section-local — match the depth of sibling files in that section.
- Telugu text uses "Noto Sans Telugu" (Google Font), loaded per-page.
- Verify referenced audio files exist under `assets/audio/` (words) or `<section>/audio/<subfolder>/` (categories) when adding new entries.

### SEO

- `sitemap.xml` and `robots.txt` at root — update `sitemap.xml` when adding a new top-level or section `index.html`/standalone page.
- Standalone long-form article pages at root (`telugu-grammar-basics.html`, `100-basic-telugu-sentences.html`, `learn-telugu-for-beginners.html`, etc.) are separate from the JSON-driven sections — static HTML with their own SEO meta tags, not query-param-driven.

## Content generation

New lessons/articles: Introduction → Key Vocabulary → Example Sentences → Practice Exercises → Summary. Bilingual: English explanations with Telugu examples throughout. Quizzes: multiple-choice, correct answers + brief explanations. Flashcards: Telugu word, transliteration, English meaning. Must be pedagogically accurate, beginner-to-intermediate, self-paced-friendly.

## Deployment (see docs/deployment-and-infrastructure.md for full detail)

- Repo: https://github.com/svspavan/learnteluguonline — branches `main` (production, auto-deploys) and `develop` (working changes)
- Hosting: **Cloudflare Pages**, connected to the GitHub repo. Framework preset: None. Build command: empty. Output directory: `/` (root, no build step — matches "no build system" above).
- Domain: GoDaddy registrar, nameservers pointed to Cloudflare. SSL automatic (Universal SSL).
- Push to `main` → automatic deploy.
- **Do not suggest migrating hosting providers.** This site already moved from Netlify to Cloudflare Pages specifically for unlimited bandwidth (audio assets exceeded Netlify's free tier). That decision stands.

## When making changes

- Show a brief before/after summary of what changed and why.
- Keep existing navigation and page structure intact unless the change specifically calls for restructuring.
- Flag if a change adds large uncompressed audio/image assets — bandwidth is a known sensitivity on this project.
