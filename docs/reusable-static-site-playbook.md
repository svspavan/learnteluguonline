# Reusable Playbook — Static Site on GitHub + Cloudflare Pages

*Generalized from how learnteluguonline.com was actually built and deployed, stripped of Telugu-specifics, so the next site starts from proven steps instead of scratch.*

## When this playbook fits

A static HTML/CSS/JS site (no backend, no database) that you want live on a custom domain quickly, with room to grow — especially if it'll carry meaningful image/audio/video weight. If a project will need a backend, user accounts, or a database from day one, this isn't the right foundation; say so up front rather than discovering it mid-build.

## The process

**1. Set up the repo**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```
Create a `develop` branch for ongoing work; merge to `main` when ready to ship — `main` will auto-deploy.

**2. Connect Cloudflare Pages directly to the repo**
[dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project** → **Connect to Git** → select the repo. Build settings for a plain static site:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `/` (root) |

*(If the new site uses a static site generator or bundler, the framework preset and build command will differ — Cloudflare Pages usually auto-detects common ones. Confirm before deploying.)*

**3. Point the domain at Cloudflare**
Add the custom domain in the Pages project settings. Cloudflare assigns a unique nameserver pair. At the domain registrar: change nameservers to the ones Cloudflare gives you (advanced/custom nameserver option, not a simple record edit). Wait for propagation, verify at [whatsmydns.net](https://www.whatsmydns.net/).

**4. Confirm SSL**
Cloudflare → **SSL/TLS → Overview** → confirm "Universal SSL Active." This is automatic — no certificate purchase or renewal needed.

**5. Ongoing deploys**
Push to `main`, Cloudflare Pages deploys automatically. No manual step.

## The lesson worth carrying forward

Netlify's free tier is a fine starting point for a light static site, but bandwidth-heavy assets (audio, video, large images) can hit its free-tier limits fast. If the new project will carry that kind of weight from the start, go straight to Cloudflare Pages rather than starting on Netlify and migrating later — one less step, and no mid-project scramble.

## Starter CLAUDE.md skeleton for a new project

Copy this into the new project's root as `CLAUDE.md` and fill in the brackets — this is the same pattern used for learnteluguonline.com's file, generalized:

```markdown
# [Site name]

[One-line description]. [Static site / other], live at [domain].
Continue and improve the existing site — do not restart or
re-architect unless explicitly asked.

## Role
Act as a senior full-stack engineer, front-end architect, and
UI/UX designer. [Any domain-specific expertise needed, e.g.
content generation subject matter]. Keep it simple and
lightweight — no heavy frameworks unless explicitly requested.

## Folder structure
[paste actual structure]

## Code conventions
- HTML: semantic tags, one h1 per page, alt text on images
- CSS: class-based, no inline styles, responsive units
- JS: minimal, no dependencies unless asked

## Deployment
- Repo: [URL] — branches [main/develop pattern]
- Hosting: Cloudflare Pages, Framework preset None, Build command
  empty, Output directory /
- Domain: [registrar], nameservers pointed to Cloudflare, SSL automatic
- Push to main = auto-deploy, no manual step

## When making changes
- Show before/after summary of what changed and why
- [Any other standing rules specific to this project]
```
