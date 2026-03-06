# CV Hub

![Deploy](https://github.com/KeeGooRoomiE/cv_hub/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01)
[![Last Commit](https://img.shields.io/github/last-commit/KeeGooRoomiE/cv_hub?color=blue)](https://github.com/KeeGooRoomiE/cv_hub/commits/main)
[![Stars](https://img.shields.io/github/stars/KeeGooRoomiE/cv_hub?style=social)](https://github.com/KeeGooRoomiE/cv_hub/stargazers)
[![Visitors](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FKeeGooRoomiE%2Fcv_hub&count_bg=%2379C83D&title_bg=%23555555&title=visitors&edge_flat=false)](https://hits.seeyoufarm.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/KeeGooRoomiE/cv_hub/blob/main/CONTRIBUTING.md)

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-Performance%20100-00C853?logo=lighthouse&logoColor=white)](https://keegooroomie.github.io/cv_hub/)
[![Lighthouse Accessibility](https://img.shields.io/badge/Lighthouse-Accessibility%20100-00C853?logo=lighthouse&logoColor=white)](https://keegooroomie.github.io/cv_hub/)
[![Lighthouse Best Practices](https://img.shields.io/badge/Lighthouse-Best%20Practices%2096-00C853?logo=lighthouse&logoColor=white)](https://keegooroomie.github.io/cv_hub/)
[![Lighthouse SEO](https://img.shields.io/badge/Lighthouse-SEO%20100-00C853?logo=lighthouse&logoColor=white)](https://keegooroomie.github.io/cv_hub/)

**Resume as Code. Reproducible. Versioned. Deployable.**

CV Hub turns your resume into infrastructure.

One YAML file becomes:

- A live personal website
- Downloadable PDF, DOCX and TXT files
- A structured, version-controlled professional profile
- A reproducible build artifact

No duplicated resumes. No platform lock-in. No visual builders.

Just data → build → deploy.

Treat your career like a system.

## Preview

![CV Hub Preview](docs/repo-assets/preview_main.jpeg)

🌐 **Live demo:** https://keegooroomii.github.io/cv_hub/

---

## Who is this for

CV Hub works for anyone who wants a professional website with full personal control:

- Developers, DevOps engineers, designers, managers, analysts — any specialist
- Anyone tired of Tilda, Notion, Canva, and other platforms
- Anyone who wants to version their resume with Git and automate format generation

> Minimum requirement — basic familiarity with the command line and Git. If you can clone a repo and edit text files, that's enough.

---

## What you get

- Main page — CV
- Showcase page — projects and case studies
- Changelog page — version history of your CV Hub
- Two language support (RU / EN)
- Downloadable resume files (PDF / DOCX / TXT) generated automatically from YAML
- Clean static HTML deployed on GitHub Pages
- Full control over the visual style through a single CSS file with theme support
- URL-based theme switching for live previews

---

## Why this exists

Most people maintain:
- A PDF resume
- A LinkedIn profile
- A portfolio site
- A Notion page
- A DOCX file somewhere on their desktop

They all drift out of sync.

CV Hub eliminates duplication and centralizes everything into one structured source of truth.

Edit once. Regenerate everything. Commit changes. Deploy.

This is especially powerful for engineers, DevOps, and technical specialists who prefer automation over manual editing.

---

## Quick start

From zero to live site in under 5 minutes.

### 1. Fork the repository

Click **Fork** in the top right corner of the repository page on GitHub.

After forking you'll have your own copy: `github.com/YOUR_ACCOUNT/cv_hub`

### 2. Clone to your local machine

```bash
git clone https://github.com/YOUR_ACCOUNT/cv_hub.git
cd cv_hub
```

### 3. Install dependencies

```bash
npm install
npx playwright install chromium --with-deps
```

### 4. Run locally

```bash
npm run dev
```

The site will be available at:

```
http://localhost:4321
```

Pages:
- `http://localhost:4321/` — main CV page
- `http://localhost:4321/showcase` — projects showcase
- `http://localhost:4321/changelog` — version history

---

## How to edit your data

All data is stored in YAML files inside `src/content/`.

```
src/content/
  cv/
    en.yaml          ← CV in English
    ru.yaml          ← CV in Russian
  showcase/
    projects.yaml    ← projects list
  changelog/
    changelog.yaml   ← version history
```

For full YAML structure reference and field descriptions — see **[`docs/INFO.md`](docs/INFO.md)**.

Example files with all supported fields are available in:

```
docs/examples/
  example_cv.yaml   ← full YAML example with comments
  example_cv.json   ← JSON Resume format example
```

---

## How to fill in your data

There are three ways to get your resume into YAML:

### Option A — Edit YAML directly

Open `src/content/cv/en.yaml` and `ru.yaml` and fill in your data manually.
See [`docs/INFO.md`](docs/INFO.md) for the full field reference.

### Option B — Import from JSON Resume

If your resume exists in [JSON Resume](https://jsonresume.org) format:

```bash
# Single language
npm run resume:import -- docs/cv_en.json en
npm run resume:import -- docs/cv_ru.json ru

# Both at once
npm run resume:import:all
```

### Option C — Generate from any resume via LLM

If you have a PDF, DOCX, or plain text resume — use Claude or ChatGPT with the ready-made prompt to generate YAML automatically.

👉 **[See `docs/llm-resume-guide.md`](docs/llm-resume-guide.md)**

---

## How to customize the look

All styles live in:

```
src/styles/global.css
```

The file is token-based — to restyle the entire site, edit only the `:root` block at the top. Every visual property flows from these tokens:

```css
:root {
  --bg: #070a10;          /* page background */
  --text: #e9eef7;        /* primary text */
  --text-strong: #edf2fc; /* headings and bold text */
  --muted: #a6b1c2;       /* secondary text */
  --accent: #3b82f6;      /* accent color */
  --accent-2: #60a5fa;    /* secondary accent */
  --card-bg: ...;         /* card surface gradient */
  --border: ...;          /* border color */
  --r-lg: 18px;           /* card border radius */
  --header-bg: ...;       /* header background with opacity */
}
```

Change one variable — the whole site updates.

### Themes

Ready-made themes are in:

```
src/styles/themes/
```

| File | Description |
|---|---|
| `frosted.css` | Dark glass, muted tones |
| `light.css` | Light background, dark text |
| `nordic.css` | Nord-inspired, cold blue-grey |
| `peachy.css` | Warm peach, light background |

To switch the default theme, change the import in `src/components/Layout.astro`:

```js
import '../styles/themes/nordic.css';
```

Previews for all themes are available in **[`docs/repo-assets`](docs/repo-assets)**.

#### Live theme preview via URL

Any theme can be previewed live without changing code:

```
https://YOUR_ACCOUNT.github.io/cv_hub/?theme=peachy
```

Available values: `frosted`, `light`, `nordic`, `peachy`

---

## How to deploy to GitHub Pages

### 1. Enable GitHub Pages in repository settings

`Settings → Pages → Source: GitHub Actions`

### 2. Push your changes

```bash
git add .
git commit -m "update cv data"
git push
```

Your site will be live at:

```
https://YOUR_ACCOUNT.github.io/cv_hub/
```

The deploy workflow runs automatically on every push to `main`. The `base` URL is resolved dynamically — forks work out of the box without any config changes.

---

## Resume file generation

All resume files are generated automatically during build:

```bash
npm run build
```

This runs in order:
1. `resume:generate` — DOCX + TXT from YAML
2. `resume:pdf` — PDF via Playwright from YAML
3. `astro build` — static site

Output after build:

```
public/downloads/
  resume_en.pdf
  resume_ru.pdf
  resume_en.docx
  resume_ru.docx
  resume_en.txt
  resume_ru.txt
  json/
    cv_en.json
    cv_ru.json
```

To generate resume files without building the site:

```bash
npm run resume:generate   # DOCX + TXT
npm run resume:pdf        # PDF
```

---

## CLI reference

```bash
npm run dev                  # start local dev server
npm run build                # generate all resume files + build site
npm run resume:generate      # generate DOCX + TXT from YAML
npm run resume:pdf           # generate PDF from YAML via Playwright
npm run resume:import        # convert JSON Resume → YAML (single file)
npm run resume:import:all    # convert both cv_en.json and cv_ru.json
npm run resume:linkedin      # parse LinkedIn PDF export → YAML (best-effort)
```

---

## Documentation

```
docs/
  INFO.md              ← YAML reference, data flow, component structure
  ENGINEERING.md       ← Engineering decisions and project philosophy
  llm-resume-guide.md  ← How to generate YAML from a resume using an LLM
  BKG_INFO.md          ← AnimatedBackground component docs
  examples/
    example_cv.yaml    ← Full YAML example with all supported fields
    example_cv.json    ← JSON Resume format example
  repo-assets/         ← Theme previews, GitHub label config, release guide
```

Links: [INFO.md](docs/INFO.md) · [ENGINEERING.md](docs/ENGINEERING.md) · [llm-resume-guide.md](docs/llm-resume-guide.md) · [BKG_INFO.md](docs/BKG_INFO.md) · [example_cv.yaml](docs/examples/example_cv.yaml) · [example_cv.json](docs/examples/example_cv.json)

---

## Project structure

```
src/
  content/
    cv/
      en.yaml
      ru.yaml
    showcase/
      projects.yaml
    changelog/
      changelog.yaml
  pages/
    index.astro              # Main CV page (EN)
    ru.astro                 # Main CV page (RU)
    changelog.astro          # Changelog page
    showcase/
      index.astro            # Showcase page (EN)
      ru.astro               # Showcase page (RU)
  components/
    Layout.astro             # Shared layout with header + animated background
    HomePage.astro           # Main page blocks (reorderable)
    ProjectCard.astro        # Project card: normal + archived collapse modes
    AnimatedBackground.astro # CSS-only animated orb background
  scripts/
    resume-export-pdf.mjs      # PDF generator (Playwright)
    resume-import-json.mjs     # JSON Resume → YAML converter
    resume-import-linkedin.mjs # LinkedIn PDF → YAML parser (best-effort)
  styles/
    global.css               # All site styles + design tokens
    themes/                  # Ready-made color themes
public/
  themes/                    # Built theme files (auto-copied from src/styles/themes)
  media/
    projects/                # Showcase media files, one folder per project
  downloads/                 # Generated resume files (after build)
    json/                    # JSON Resume exports
.github/
  scripts/
    generate-resume.js       # DOCX + TXT generator
  workflows/
    deploy.yml               # GitHub Actions CI/CD
docs/
  INFO.md
  ENGINEERING.md
  BKG_INFO.md
  llm-resume-guide.md
  examples/
    example_cv.yaml
    example_cv.json
  repo-assets/
```

---

## Tech stack

- [Astro](https://astro.build) — static site generator
- YAML — single source of truth
- [docx](https://docx.js.org) — DOCX generation
- [Playwright](https://playwright.dev) — PDF generation
- GitHub Pages — deployment
- GitHub Actions — CI/CD

---

## License

Source code: MIT  
Content (resume data): © Author