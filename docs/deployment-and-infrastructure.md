# Deployment & Infrastructure — learnteluguonline.com

*Consolidated from your "Building a Website from Scratch" Copilot history (762 messages, May–Jun 2026). This is the reference doc — CLAUDE.md has the condensed version that loads every Claude Code session.*

## Current setup (what's actually live)

| Component | Value |
|---|---|
| Domain registrar | GoDaddy |
| Domain | learnteluguonline.com |
| Code repository | https://github.com/svspavan/learnteluguonline |
| Branches | `main` (production, auto-deploys), `develop` (working changes) |
| Hosting | Cloudflare Pages |
| Framework preset | None |
| Build command | *(empty — no build step, plain static HTML/CSS/JS)* |
| Output/publish directory | `/` (root) |
| SSL | Cloudflare Universal SSL, automatic |

## The story: why Cloudflare and not Netlify

You didn't start on Cloudflare — it's worth keeping this reasoning on record since it's a real lesson for future projects, not just trivia:

1. **Initial setup was on Netlify.** GoDaddy nameservers were pointed to Netlify's, Netlify auto-managed DNS, SSL, and the www redirect. This is a genuinely good default for a small static site.
2. **The classical poetry section's audio files pushed past Netlify's free-tier bandwidth.** Audio is heavy, and once traffic + audio playback combined, Netlify's free bandwidth allowance became a real constraint.
3. **You migrated to Cloudflare Pages** (decision made ~24 May 2026) specifically because it offers unlimited bandwidth on the free tier — a better long-term fit for a content-heavy educational site that was always going to keep growing (more stories, more audio, more lessons).
4. You asked good questions before migrating rather than just following the recommendation — worth continuing that instinct for future infrastructure decisions too.

**Takeaway for next time:** if a static site will carry meaningful audio, video, or image weight from day one, Cloudflare Pages is worth choosing upfront rather than starting on Netlify and migrating later.

## How the GitHub repo was set up

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/svspavan/learnteluguonline.git
git push -u origin main
```

A `develop` branch was also used for work-in-progress changes before merging to `main`.

## How Cloudflare Pages was connected

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Choose **Connect to Git**, authorize GitHub, select the `learnteluguonline` repository
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | None |
   | Build command | *(leave empty)* |
   | Build output directory | `/` (root) |

4. Save and deploy — Cloudflare detects the static files automatically.

## How the domain was pointed at Cloudflare

1. Add the custom domain (`learnteluguonline.com`) inside the Cloudflare Pages project settings.
2. Cloudflare issues you a pair of assigned nameservers (yours will look like `xxxx.ns.cloudflare.com` / `yyyy.ns.cloudflare.com` — a randomly-assigned pair, unique to your account. Worth double-checking the exact current pair in your Cloudflare dashboard under **DNS**, since these aren't something to guess from memory.)
3. At GoDaddy: **Domains → DNS → Nameservers → Change → Enter my own nameservers (advanced)** → paste the two Cloudflare nameservers → save.
4. Wait for propagation (typically minutes, can take up to 24 hours). Check with [whatsmydns.net](https://www.whatsmydns.net/#NS/learnteluguonline.com).
5. Confirm SSL under **SSL/TLS → Overview** in Cloudflare — should read "Universal SSL Active."

## Ongoing workflow

Push to `main` → Cloudflare Pages auto-deploys. No manual deploy step, no build pipeline to maintain — this is the main advantage of the static-site-on-Cloudflare-Pages setup for a project like this.
