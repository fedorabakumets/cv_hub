//
//  merge.mjs
//  CV Hub
//
//  Created by Alexander Gusarov on 11.03.2026.
//  @spartan121
//
//  Usage: node src/scripts/merge.mjs
//  Reads profiles.yml + languages.yml, merges base + spec YAMLs,
//  writes artifacts to public/cv/
//

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse, stringify } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');

const contentDir = join(root, 'src/content');
const outputDir  = join(root, 'public/cv');

// --- Helpers ---

function readYaml(path) {
  if (!existsSync(path)) return null;
  return parse(readFileSync(path, 'utf8'));
}

function mergeExperience(base, spec) {
  if (!spec || spec.length === 0) return base;

  return spec.map(specEntry => {
    const baseEntry = base.find(b => b.company === specEntry.company);
    if (!baseEntry) return specEntry;
    return { ...baseEntry, ...specEntry };
  });
}

function mergeCV(base, spec) {
  if (!spec) return base;

  const result = { ...base };

  for (const key of Object.keys(spec)) {
    if (key === 'experience') {
      result.experience = mergeExperience(base.experience ?? [], spec.experience);
    } else if (key === 'skills') {
      result.skills = spec.skills;
    } else {
      result[key] = spec[key];
    }
  }

  return result;
}

// --- Main ---

const profilesRaw  = readYaml(join(contentDir, 'profiles/profiles.yml'));
const languagesRaw = readYaml(join(contentDir, 'languages/languages.yml'));

if (!languagesRaw) {
  console.error('❌ languages.yml not found');
  process.exit(1);
}

const profiles = profilesRaw?.profiles ?? [{ id: 'default', slug: '', spec: null }];
const langIds     = languagesRaw.languages.map(l => l.id);
const defaultLang = languagesRaw.default;

mkdirSync(outputDir, { recursive: true });

let generated = 0;

for (const profile of profiles) {
  for (const lang of langIds) {

    // --- resolve base ---
    let base = readYaml(join(contentDir, `cv/${lang}.yaml`));

    if (!base) {
      const defaultBase = readYaml(join(contentDir, `cv/${defaultLang}.yaml`));
      if (!defaultBase) {
        console.warn(`⚠️  Default base not found, skipping ${lang}`);
        continue;
      }
      console.warn(`⚠️  No base for ${lang}, falling back to ${defaultLang}`);
      base = defaultBase;
    }

    // --- resolve spec ---
    let spec = null;
    if (profile.spec) {
      const specPath = join(contentDir, `cv/${lang}_${profile.spec}.yaml`);
      spec = readYaml(specPath);
      if (!spec) {
        console.warn(`⚠️  Spec not found: ${lang}_${profile.spec}.yaml, falling back to base`);
      }
    }

    // --- merge & write ---
    const merged  = mergeCV(base, spec);
    const outName = profile.spec ? `${lang}_${profile.spec}.yaml` : `${lang}.yaml`;
    const outPath = join(outputDir, outName);

    writeFileSync(outPath, stringify(merged), 'utf8');
    console.log(`✓ ${outName}`);
    generated++;
  }
}

console.log(`\n✓ Generated ${generated} artifact(s) → public/cv/`);