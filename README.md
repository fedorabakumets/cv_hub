<file name=0 path=/Users/xandergusarov/Documents/GitHub/cv_hub/README.md># CV Hub

**Resume as Code.** A static, data-driven personal CV site built with Astro and powered by a single YAML source of truth.

Instead of maintaining separate PDF, DOC, web, and LinkedIn versions — one YAML file generates everything.

---

## Summary

- [Who is this for](#who-is-this-for)
- [What you get](#what-you-get)
- [Quick start](#quick-start)
- [How to edit your data](#how-to-edit-your-data)
- [How to customize the look](#how-to-customize-the-look)
- [How to deploy to GitHub Pages](#how-to-deploy-to-github-pages)
- [Generate YAML from an existing resume](#generate-yaml-from-an-existing-resume)
- [Documentation](#documentation)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Roadmap](#roadmap)
- [License](#license)

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
- Two language support (RU / EN)
- Ability to generate PDF / DOCX / TXT from the same data
- Clean static HTML deployed on GitHub Pages
- Full control over the visual style through a single CSS file

---

## Quick start

### 1. Fork the repository

Click **Fork** in the top right corner of the repository page on GitHub.

After forking you'll have your own copy: `github.com/YOUR_ACCOUNT/cv-hub`

### 2. Clone to your local machine

```bash
git clone https://github.com/YOUR_ACCOUNT/cv-hub.git
cd cv-hub
```

### 3. Install dependencies

```bash
npm install
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

---

## How to edit your data

All data is stored in YAML files inside `src/content/`.

```
src/content/
  cv/
    en.yaml       ← CV in English
    ru.yaml       ← CV in Russian
  showcase/
    projects.yaml ← projects list
```

### `cv/en.yaml` structure

```yaml
name: "Your Name"
title: "Your Title"
summary: "Brief professional summary."

contacts:
  - type: email
    value: you@example.com
  - type: github
    value: github.com/yourhandle

skills:
  - category: "Tools"
    items: ["Figma", "Notion", "Git"]

experience:
  - company: "Company Name"
    role: "Your Role"
    period: "2022 — present"
    description: "What you did there."
    stack: ["Tool A", "Tool B"]
```

### `showcase/projects.yaml` structure

```yaml
projects:
  - name: "Project Name"
    role: "Author"
    year: 2024
    description: "What this project does."
    stack: ["Figma", "GitHub"]
    links:
      - label: "GitHub"
        url: "https://github.com/yourhandle/project"
```

After editing, save the files — the page will reload automatically in `npm run dev` mode.

---

## How to customize the look

All styles live in one file:

```
src/styles/global.css
```

The file is token-based — to change the color scheme of the entire site, just edit the `:root` block at the top:

```css
:root {
  --bg: #0b0f14;          /* background color */
  --surface: #0f1620;     /* card background */
  --text: #e9eef7;        /* primary text */
  --muted: #a6b1c2;       /* secondary text */
  --accent: #3b82f6;      /* accent color (blue by default) */
  --accent-2: #60a5fa;    /* secondary accent / hover */
}
```

Change one variable — the whole site updates. Dark theme is used by default.

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
https://YOUR_ACCOUNT.github.io/cv-hub/
```

---

## Generate YAML from an existing resume

If you already have a resume in PDF or DOCX — no need to fill in the YAML manually.

Use an LLM (ChatGPT, Claude, etc.) with the ready-made prompt:

👉 **[See `docs/llm-resume-guide.md`](docs/llm-resume-guide.md)**

Step-by-step instructions and a prompt that takes your resume and returns a ready YAML to drop into the project.

---

## Documentation

```
docs/
  llm-resume-guide.md    ← How to generate YAML from a resume using an LLM
  INFO.md                ← Project overview: goals, architecture, data flow
  ENGINEERING.md         ← Engineering decisions and project philosophy
  release-guide.md       ← How to version and publish releases
  github-labels.md       ← Repository labels setup
```

### Direct links

- 📘 [INFO.md](docs/INFO.md) — Project overview and data flow
- 🏗 [ENGINEERING.md](docs/ENGINEERING.md) — Architectural decisions and trade-offs
- 🤖 [llm-resume-guide.md](docs/llm-resume-guide.md) — How to generate YAML from an existing resume
- 🚀 [release-guide.md](docs/release-guide.md) — Release and versioning guide
- 🏷 [github-labels.md](docs/github-labels.md) — Suggested repository labels

**`INFO.md`** — the starting point for understanding the project. Explains what CV Hub is, what problem it solves, and how the data flow works (`YAML → Astro → HTML`). Useful to read before forking — and before feeding the project to an LLM for help with customization.

**`ENGINEERING.md`** — an architectural journal. Explains why Astro over React or Angular, why YAML, what trade-offs were made deliberately, and where the project is heading.

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
  pages/
    index.astro        # Main CV page
    showcase.astro     # Showcase page
  components/
    Layout.astro
    Header.astro
  styles/
    global.css         # All site styles
docs/
  llm-resume-guide.md
  INFO.md
  ENGINEERING.md
  release-guide.md
  github-labels.md
```

---

## Tech stack

- [Astro](https://astro.build) — static site generator
- YAML — single source of truth
- GitHub Pages — deployment
- GitHub Actions — CI/CD (in progress)

---

## Roadmap

- [ ] PDF generation via Playwright
- [ ] DOCX generation via Pandoc
- [ ] Zod schema validation for YAML
- [ ] Dark / light theme toggle
- [ ] Project filtering by tags
- [ ] SEO + OpenGraph
- [ ] CLI build tool

---

## License

Source code: MIT  
Content (resume data): © Author</file>