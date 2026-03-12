# CV Hub — INFO

Полный справочник по структуре данных, конфигурации и архитектуре проекта.

---

## Содержание

1. [Структура файлов данных](#1-структура-файлов-данных)
2. [CV YAML — полный справочник полей](#2-cv-yaml--полный-справочник-полей)
3. [Multi-profile система](#3-multi-profile-система)
4. [Языки и i18n](#4-языки-и-i18n)
5. [Showcase — projects.yaml](#5-showcase--projectsyaml)
6. [Changelog — changelog.yaml](#6-changelog--changelogyaml)
7. [Поток данных](#7-поток-данных)
8. [Компоненты](#8-компоненты)
9. [Роутинг](#9-роутинг)
10. [Генерация документов](#10-генерация-документов)

---

## 1. Структура файлов данных

```
src/content/
  cv/
    en.yaml              ← base CV in English
    ru.yaml              ← base CV in Russian
    en_devops.yaml       ← DevOps delta (optional)
    ru_devops.yaml       ← DevOps delta in Russian (optional)
    en_gamedev.yaml      ← GameDev delta (optional)
    ru_gamedev.yaml
  profiles/
    profiles.yml         ← profile registry (optional)
  languages/
    languages.yml        ← language config
  i18n/
    translations.yaml    ← UI strings for all languages
  showcase/
    projects.yaml        ← showcase projects
  changelog/
    changelog.yaml       ← version history
```

После выполнения `npm run cv:build` в `public/cv/` появляются смёрженные артефакты:

```
public/cv/
  en.yaml
  ru.yaml
  en_devops.yaml
  ru_devops.yaml
  en_gamedev.yaml
  ru_gamedev.yaml
```

---

## 2. CV YAML — полный справочник полей

### Верхний уровень

```yaml
name: "Alexander Gusarov"
title: "DevOps Engineer | Kubernetes · Terraform · AWS"
summary: >
  Multi-line summary text.
  Supports YAML block scalar.

contacts: [...]
achievements: [...]
skills: [...]
experience: [...]
education: [...]
languages: [...]
```

### contacts

```yaml
contacts:
  - label: Email
    url: mailto:your@email.com
  - label: GitHub
    url: https://github.com/username
  - label: Telegram
    url: https://t.me/username
  - label: LinkedIn
    url: https://linkedin.com/in/username
  - label: Upwork
    url: https://upwork.com/freelancers/~...
```

Поддерживается любое количество контактов. `url` может быть любой ссылкой или `mailto:`.

### achievements

```yaml
achievements:
  - "Managed infrastructure for 750+ Linux servers with 99.9% uptime"
  - "Reduced deploy time from 8 to 2 minutes (−75%)"
  - "Cut AWS costs from $550 to $300/month (−45%)"
```

Массив строк. Отображается как список ключевых достижений.

### skills

Поддерживаются два формата — плоский и групповой:

```yaml
# Плоский (все теги в одном блоке)
skills:
  - Kubernetes
  - Docker
  - Terraform

# Групповой (рекомендуется)
skills:
  - group: Orchestration
    items: [Kubernetes, Helm, Docker]
  - group: IaC & Automation
    items: [Terraform, Ansible]
  - group: Cloud
    items: [AWS — EC2, S3, RDS, VPC, IAM, ALB]
  - group: Languages
    items: [Go, Python, Bash]
```

Оба формата можно смешивать в одном массиве.

### experience

```yaml
experience:
  - company: "InfoScale"
    role: "DevOps Engineer"
    period: "Dec 2024 — Jan 2026"
    description:
      - "Administered Kubernetes production clusters"
      - "Built IaC solution with Terraform + Ansible on AWS"
      - "Reduced MTTR by 60% with custom Grafana dashboards"
    stack: [Kubernetes, Helm, Docker, Terraform, AWS, Go]
```

Поля:
- `company` — название компании (используется как ключ при merge)
- `role` — должность
- `period` — период работы (свободная строка)
- `description` — массив строк с описанием задач
- `stack` — массив технологий (отображается курсивом под описанием)

### education

```yaml
education:
  - institution: "Udemy"
    degree: "Certified Kubernetes Administrator"
    period: "2025"
  - institution: "Siberian Polytechnic University"
    degree: "Faculty of Information Technology"
    period: "2017–2018"
```

### languages (spoken)

```yaml
languages:
  - language: Russian
    level: Native
  - language: English
    level: IELTS 7.0 (B2)
```

---

## 3. Multi-profile система

### Концепция

Один базовый YAML + delta-файлы для каждого профиля. Merge-пайплайн собирает итоговые артефакты перед сборкой сайта.

### profiles.yml

```yaml
# src/content/profiles/profiles.yml
profiles:
  - id: default
    label: "Generalist"
    slug: ""          # URL-сегмент. Пустая строка = корень /
    spec: null        # null = копировать base как есть

  - id: devops
    label: "DevOps"
    slug: "devops"    # URL: /devops, /devops/ru
    spec: devops      # читает en_devops.yaml, ru_devops.yaml

  - id: gamedev
    label: "Game Developer"
    slug: "gamedev"
    spec: gamedev
```

`slug` и `spec` — разные вещи:
- `slug` — то, что в URL
- `spec` — префикс имени delta-файла (`{lang}_{spec}.yaml`)

Это позволяет иметь `/backend` в URL, но читать из `en_devops.yaml`.

Если `profiles.yml` отсутствует — система работает с одним дефолтным профилем.

### Delta-файл

Delta-файл содержит только то, что меняется. Все остальные поля берутся из base.

```yaml
# src/content/cv/en_devops.yaml
title: "DevOps / Platform Engineer | Kubernetes · Terraform · AWS"

summary: >
  DevOps-focused summary...

skills:
  - group: Orchestration
    items: [Kubernetes, Helm, Docker]

experience:
  - company: InfoScale        # поля целиком из base, переопределений нет

  - company: AZNResearch
    role: "Backend Engineer"  # переопределяем role
    description:
      - "Developed backend microservices with .NET Core"
      - "Introduced Git workflow and CI pipelines"
    # stack не указан → берётся из base
```

### Правила merge

| Поле | Поведение |
|---|---|
| Скалярные поля (`title`, `summary`, `name`) | spec wins; отсутствующие — из base |
| `skills` | Целиком заменяется если указан в spec |
| `experience` | Whitelist по `company`. Только перечисленные компании. Поля мёрджатся: base + spec override |
| `achievements` | Целиком заменяется если указан в spec |
| `contacts`, `education`, `languages` | Целиком заменяется если указан в spec |

**Важно про `experience` whitelist:** если компания указана в spec только как `- company: InfoScale` без других полей — она попадает в результат с полным содержимым из base. Это способ включить запись без изменений.

---

## 4. Языки и i18n

### languages.yml

```yaml
# src/content/languages/languages.yml
default: "en"
languages:
  - id: "en"
    label: "EN"
  - id: "ru"
    label: "RU"
```

`default` определяет язык для URL `/` (без языкового сегмента).

### Добавление языка

1. Добавить запись в `languages.yml`
2. Создать `src/content/cv/{lang}.yaml` (или оставить без файла — будет фоллбек на default)
3. Добавить переводы в `translations.yaml`
4. Опционально: создать `src/content/cv/{lang}_{spec}.yaml` для каждого профиля

### translations.yaml

```yaml
# src/content/i18n/translations.yaml
nav:
  home:
    en: "Home"
    ru: "Главная"
  showcase:
    en: "Showcase"
    ru: "Проекты"

cv:
  skills:
    en: "Skills"
    ru: "Навыки"
  experience:
    en: "Experience"
    ru: "Опыт"
  download:
    en: "Download"
    ru: "Скачать"

meta:
  description:
    en: "CV Hub - one place for your actual resume."
    ru: "CV Hub - единое место для твоего резюме."
  locale:
    en: "en_US"
    ru: "ru_RU"
```

Фоллбек-цепочка: запрошенный язык → `en` → ключ пути (как fallback строка).

### i18n хелпер

```ts
import { makeT } from '../scripts/t';

const translations = await getEntry('i18n', 'translations');
const t = makeT(translations.data, lang);

t('nav.home')       // → "Home" / "Главная"
t('cv.skills')      // → "Skills" / "Навыки"
```

---

## 5. Showcase — projects.yaml

```yaml
# src/content/showcase/projects.yaml
projects:
  - id: bhop-jump
    title: "Bhop Jump"
    description: "Multiplayer mobile game with P2P + dedicated server architecture."
    tags: [Unity, C#, Multiplayer, iOS, Android]
    platforms: [iOS, Android]
    color: cyan           # blue | cyan | emerald | magenta
    featured: true
    archived: false
    links:
      - label: App Store
        url: https://apps.apple.com/...
      - label: GitHub
        url: https://github.com/...
    media:
      - type: image
        src: /media/projects/bhop-jump/01.jpg
    metrics:
      - label: Revenue Q1
        value: "$160K+"
      - label: Players
        value: "up to 16"
```

Поля `color`: `blue` (default), `cyan`, `emerald`, `magenta` — определяют акцентный цвет карточки.

`archived: true` — карточка сворачивается, раскрывается по клику.

`featured: true` — показывает pin-иконку на карточке.

`metrics` — отображается как сетка метрик внутри карточки.

---

## 6. Changelog — changelog.yaml

```yaml
# src/content/changelog/changelog.yaml
entries:
  - version: "1.3.0"
    date: "2026-03-11"
    title: "Multi-profile system"
    changes:
      - "Added profiles × languages routing"
      - "merge.mjs — YAML merge pipeline"
      - "Per-profile PDF/DOCX/TXT generation"
  - version: "1.2.0"
    date: "2026-03-03"
    title: "Initial release"
    changes:
      - "CV page with EN/RU support"
      - "Showcase page"
      - "GitHub Actions CI/CD"
```

---

## 7. Поток данных

```
src/content/cv/en.yaml          (base)
src/content/cv/en_devops.yaml   (spec delta)
         ↓
     merge.mjs
         ↓
  public/cv/en_devops.yaml      (merged artifact)
         ↓
    ┌────┴──────────────────────────────┐
    ↓                                   ↓
generate-resume.js               astro build
resume-export-pdf.mjs                   ↓
    ↓                         src/pages/[...slug].astro
DOCX / TXT / PDF                reads public/cv/en_devops.yaml
                                        ↓
                               HomePage.astro renders CV
```

Страницы читают данные из `public/cv/` (merged artifacts), не из `src/content/cv/` напрямую. Это позволяет избежать дублирования логики merge в Astro.

---

## 8. Компоненты

### Layout.astro

Shared layout — header, footer, мета-теги, OG.

Props:
- `title` — заголовок страницы
- `lang` — текущий язык (`en`, `ru`)
- `section` — секция (`main`, `showcase`) для контекстной навигации
- `profile` — slug текущего профиля (для lang switcher и dropdown)
- `description` — мета-описание (опционально)
- `ogImage` — OG-изображение (опционально)

Читает `profiles.yml` и `languages.yml` для генерации навигации. Если `profiles.yml` отсутствует — dropdown не отображается.

### HomePage.astro

Основной CV-рендерер. Принимает данные через props.

Props:
- `lang` — язык
- `data` — объект CV из merged YAML
- `pdfUrl`, `docxUrl`, `txtUrl` — ссылки на скачивание
- `profile` — передаётся в Layout
- `t` — объект с переведёнными строками

### ProjectCard.astro

Карточка проекта. Поддерживает два режима:
- Обычная карточка (`archived: false`)
- Сворачиваемая архивная карточка (`archived: true`) с toggle

---

## 9. Роутинг

| URL | Файл | Данные |
|---|---|---|
| `/` | `index.astro` | `public/cv/{defaultLang}.yaml` |
| `/ru` | `[...slug].astro` | `public/cv/ru.yaml` |
| `/devops` | `[...slug].astro` | `public/cv/en_devops.yaml` |
| `/devops/ru` | `[...slug].astro` | `public/cv/ru_devops.yaml` |
| `/gamedev` | `[...slug].astro` | `public/cv/en_gamedev.yaml` |
| `/showcase` | `showcase/index.astro` | `projects.yaml` |
| `/changelog` | `changelog.astro` | `changelog.yaml` |

`getStaticPaths` в `[...slug].astro` генерирует все комбинации профиль × язык, пропуская default profile + default lang (это обрабатывает `index.astro`).

### buildHref helper

```ts
function buildHref(profileSlug: string, langId: string): string {
  const segments = [];
  if (profileSlug) segments.push(profileSlug);
  if (langId !== defaultLang) segments.push(langId);
  return `${base}/${segments.join('/')}`;
}
```

Используется в Layout для построения ссылок переключателя языков и dropdown профилей. Lang switcher сохраняет текущий профиль, profile dropdown сохраняет текущий язык.

---

## 10. Генерация документов

### Build order

```bash
npm run cv:build          # 1. merge YAMLs → public/cv/
npm run resume:generate   # 2. DOCX + TXT for all files in public/cv/
npm run resume:pdf        # 3. PDF for all files in public/cv/
astro build               # 4. static site
```

### Именование файлов

| Профиль | Язык | Файл |
|---|---|---|
| default | en | `resume_en.pdf` |
| default | ru | `resume_ru.pdf` |
| devops | en | `resume_en_devops.pdf` |
| devops | ru | `resume_ru_devops.pdf` |
| gamedev | en | `resume_en_gamedev.pdf` |

Формат: `resume_{lang}[_{spec}].{ext}`

### Ссылки на скачивание

Формируются в `index.astro` и `[...slug].astro`:

```js
const specSuffix = profileData.spec ? `_${profileData.spec}` : '';
const pdfUrl = `${base}/downloads/resume_${langId}${specSuffix}.pdf`;
```

Страница `/devops` предлагает `resume_en_devops.pdf`. Страница `/` предлагает `resume_en.pdf`.

### Поддерживаемые форматы

- **PDF** — через Playwright + HTML-шаблон. Двухколоночный A4-макет.
- **DOCX** — через docx.js. Структурированный документ со стилями.
- **TXT** — plain text с разделителями секций.