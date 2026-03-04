/**
 * resume-export-pdf.mjs
 *
 * Reads src/content/cv/en.yaml and ru.yaml,
 * builds a clean print HTML and exports PDF via Playwright.
 *
 * Usage:
 *   npm run resume:pdf
 *
 * Output:
 *   public/downloads/resume_en.pdf
 *   public/downloads/resume_ru.pdf
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { chromium } from 'playwright';

const ROOT       = path.resolve('.');
const CONTENT    = path.join(ROOT, 'src/content/cv');
const OUTPUT_DIR = path.join(ROOT, 'public/downloads');

const FILES = [
  { yaml: 'en.yaml', suffix: 'en' },
  { yaml: 'ru.yaml', suffix: 'ru' },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadYaml(filename) {
  const raw = fs.readFileSync(path.join(CONTENT, filename), 'utf8');
  return parse(raw);
}

function stripUrl(url = '') {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '');
}

function cleanPeriod(period = '') {
  return period
    .replace(/—\s*undefined/g, '')
    .replace(/—\s*$/,          '')
    .trim();
}

function html(cv, lang = 'en') {
  const T = {
    en: {
      achievements: 'Key Achievements',
      skills: 'Skills',
      experience: 'Experience',
      education: 'Education',
      languages: 'Languages',
      stack: 'Stack',
    },
    ru: {
      achievements: 'Ключевые достижения',
      skills: 'Навыки',
      experience: 'Опыт',
      education: 'Образование',
      languages: 'Языки',
      stack: 'Стек',
    },
  };

  const tr = T[lang] ?? T.en;

  const contact = (cv.contacts ?? [])
    .map(c => `<span><span class="contact-label">${c.label}:</span> <a href="${c.url}">${stripUrl(c.url)}</a></span>`)
    .join('<span class="sep">·</span>');

  const achievements = (cv.achievements ?? []).length ? `
    <section>
      <h2>${tr.achievements}</h2>
      <ul>
        ${cv.achievements.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </section>` : '';

  const skills = (cv.skills ?? []).length ? `
    <section>
      <h2>${tr.skills}</h2>
      <div class="skills">
        ${cv.skills.map(s => `
          <div class="skill-row">
            <span class="skill-group">${s.group}:</span>
            <span class="skill-items">${(s.items ?? []).join(', ')}</span>
          </div>`).join('')}
      </div>
    </section>` : '';

  const experience = (cv.experience ?? []).length ? `
    <section>
      <h2>${tr.experience}</h2>
      ${cv.experience.map(exp => {
        const desc = Array.isArray(exp.description) ? exp.description.filter(Boolean) : [];
        const first = desc[0];
        const rest = desc.slice(1);

        return `
        <div class="entry">
          <div class="entry-lead">
            <div class="entry-header">
              <span class="entry-title"><strong>${exp.company}</strong>${exp.role ? ` — ${exp.role}` : ''}</span>
              <span class="entry-period">${cleanPeriod(exp.period)}</span>
            </div>
            ${first ? `<ul class="bullets"><li>${first}</li></ul>` : ''}
          </div>

          ${rest.length ? `<ul class="bullets">${rest.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}

          ${exp.stack?.length
            ? `<p class="stack"><strong>${tr.stack}:</strong> ${exp.stack.join(', ')}</p>`
            : ''}
        </div>`;
      }).join('')}
    </section>` : '';

  const education = (cv.education ?? []).length ? `
    <section>
      <h2>${tr.education}</h2>
      ${cv.education.map(e => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${e.institution}</strong> — ${e.degree}</span>
            <span class="entry-period">${cleanPeriod(e.period)}</span>
          </div>
        </div>`).join('')}
    </section>` : '';

  const languages = (cv.languages ?? []).length ? `
    <section>
      <h2>${tr.languages}</h2>
      <p>${cv.languages.map(l => `${l.language}: ${l.level}`).join(' · ')}</p>
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #fff;
      padding: 14mm 18mm;
      line-height: 1.5;
    }

    a { color: #2563eb; text-decoration: none; }

    /* ── Header ── */
    .cv-name {
      font-size: 22pt;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .cv-title {
      font-size: 13pt;
      color: #2563eb;
      margin-bottom: 8px;
    }
    .cv-contacts {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 0;
      font-size: 9.5pt;
      color: #444;
      margin-bottom: 12px;
    }
    .cv-contacts .sep { margin: 0 7px; color: #ccc; }
    .contact-label { color: #666; font-weight: 600; }

    /* ── Summary ── */
    .cv-summary {
      font-size: 10.5pt;
      color: #333;
      margin-bottom: 14px;
      border-left: 3px solid #2563eb;
      padding-left: 10px;
      line-height: 1.6;
    }

    /* ── Sections ── */
    section { margin-bottom: 14px; }

    h2 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #1a1a1a;
      border-bottom: 1.5px solid #2563eb;
      padding-bottom: 3px;
      margin-bottom: 7px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ── Skills ── */
    .skills { display: flex; flex-direction: column; gap: 2px; }
    .skill-row { display: flex; gap: 6px; font-size: 10pt; }
    .skill-group {
      font-weight: 600;
      min-width: 160px;
      flex-shrink: 0;
      color: #222;
    }
    .skill-items { color: #444; }

    /* ── Experience / Education ── */
    .entry { margin-bottom: 10px; }

    /* Keep only (header + first bullet) together; allow the rest to flow to avoid large gaps */
    .entry-lead { break-inside: avoid-page; }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 3px;
    }

    .entry-title { font-size: 10.5pt; flex: 1; }
    .entry-period {
      font-size: 9.5pt;
      color: #666;
      white-space: nowrap;
      font-style: italic;
    }

    .bullets {
      padding-left: 16px;
      margin: 3px 0 4px;
      break-inside: auto;
    }
    .bullets li {
      font-size: 9.5pt;
      color: #333;
      margin-bottom: 2px;
      line-height: 1.45;
    }
    .bullets li::marker { color: #2563eb; }

    .stack {
      font-size: 9pt;
      color: #444;
      margin-top: 3px;
    }
  </style>
</head>
<body>
  <div class="cv-name">${cv.name}</div>
  <div class="cv-title">${cv.title}</div>
  <div class="cv-contacts">${contact}</div>
  ${cv.summary ? `<div class="cv-summary">${cv.summary}</div>` : ''}
  ${achievements}
  ${skills}
  ${experience}
  ${education}
  ${languages}
</body>
</html>`;
}

async function run() {
  ensureDir(OUTPUT_DIR);

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  for (const { yaml, suffix } of FILES) {
    const cv      = loadYaml(yaml);
    const content = html(cv, suffix);

    await page.setContent(content, { waitUntil: 'networkidle' });

    const outPath = path.join(OUTPUT_DIR, `resume_${suffix}.pdf`);

    await page.pdf({
      path:            outPath,
      format:          'A4',
      printBackground: true,
      margin:          { top: '0', right: '0', bottom: '0', left: '0' },
    });

    console.log(`✔ ${outPath}`);
  }

  await browser.close();
  console.log('\nDone.');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});