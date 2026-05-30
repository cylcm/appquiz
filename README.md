# 🚀 Quest PSLE — Smart PSLE Study Buddy

A free, single‑file, offline‑capable study companion that helps **Singapore Primary 6 students prepare for the PSLE** across **English, Math, Science and Chinese (华文)** — built for families who can't always be there, or can't afford tuition.

> **Live build:** open `index.html` in any modern browser. A private access code is required on first launch (kept by the parent — not published here).

![version](https://img.shields.io/badge/version-cylho.v1.0--2026-5b6ef5)
![status](https://img.shields.io/badge/build-passing-1bc47d)
![license](https://img.shields.io/badge/license-MIT-2bb5c4)
![single file](https://img.shields.io/badge/single--file-HTML-ff8a3d)

----

## Why this exists

PSLE preparation is stressful and expensive. Tuition is out of reach for many families, and working parents often can't sit with their child every evening. Quest PSLE lets a child **practise independently** while a parent **monitors progress in their own time** through a PIN‑protected dashboard — no subscription, no servers, no data leaving the device.

It is a **revision aid**, not a replacement for school. The goal is to make consistent, self‑directed PSLE practice possible at zero cost.

---

## Features

### Four subjects
- **📖 English** — read‑aloud oral practice (with speech scoring), idiom trainer (1,145 idioms), spelling practice with text‑to‑speech (plus your own uploaded word lists), a composition toolkit, a story‑telling reader, and quizzes.
- **🔢 Math** — 12 problem‑sum heuristics, a keyword decoder (9 topics), an AI step‑by‑step problem explainer, and concept quizzes.
- **🔬 Science** — Five Pillars concept notes (94 Q&A) each with a listen button, MCQ quizzes, and an AI concept explainer.
- **🀄 华文 Chinese** — 朗读 read‑aloud oral practice with scoring, and vocabulary MCQ quizzes.

### Learning engine
- **Per‑subject Quiz Maker** — choose difficulty (Beginner / Intermediate / Advanced), topic, and length; generate from the **built‑in question bank (205 curated MCQs)** or with **AI**.
- **Per‑subject saved quizzes** — up to 30 stored per subject (120 total), never auto‑deleted; replay or delete any time. Collapsible to keep things tidy.
- **📚 Story Telling** — a read‑along reader that highlights and reads each paragraph aloud. Ships with a 10‑chapter story (`stories.json`); upload more as `.json` or `.txt`.
- **🔤 Custom spelling lists** — upload your own words via `.csv` or `.json`.

### Resources (shared reference hub)
- **📎 Documents** — upload up to **3 reference files per subject** (PDF, Word, CSV, Excel), stored on‑device and opened in a new tab.
- **🔗 Links** — save useful websites or videos (YouTube, learning sites) with a label and description; they render as clickable cards.

### Goals & Study Plan
- **🎯 PSLE goal setting** — exam‑date countdown with 10‑/5‑/3‑month plans, weekly session targets, and a per‑subject milestone checklist.
- **📅 Study Planner** — add study sessions and view them in **Daily, Weekly and Monthly** calendars. Tasks **auto‑complete** when the matching activity is finished.
- **🎯 Effort Planner** — enter target grades (PSLE **AL1–AL6**), pick the exam (PSLE / SA1 / SA2 / WA) or custom dates, and describe the daily routine (school, sleep, leisure, CCA, meals). It builds a **personalised, term‑aware study plan** — counting school vs. holiday days and skipping public holidays — with a 24‑hour day breakdown and per‑subject hours, then adds all sessions to the planner in one tap.

### Motivation & monitoring
- **Gamification** — XP, 8 levels (🌱 Seedling → 👑 PSLE Ace), 12 badges, daily streaks, and an XP reward shop parents can customise.
- **👨‍👩‍👧 Parent Dashboard** (PIN‑protected) — progress overview, per‑subject mastery, recent sessions, a downloadable progress report, reward editor, an in‑app **Reset All Activity** control, and **Backup & Restore**.

### Data safety — Backup & Restore
All progress, resources and links persist across page refreshes and ordinary cache clears. Because a full "clear all browsing data" wipes every in‑browser store, the Parent Dashboard includes **💾 Download Full Backup** (a single `.json` capturing all progress *and* uploaded documents) and **📥 Restore From Backup** — so nothing is ever permanently lost, even when changing devices.

### Built for the real world
- **Works offline** using the embedded bank; the optional AI features only activate when a key is provided.
- **Fully responsive** — phones, tablets, iPad and desktop; iOS safe‑area aware; installable to the home screen.
- **Gender‑neutral, kid‑friendly** teal/indigo design.

---

## Quick start

```bash
git clone https://github.com/cylcm/appquiz.git
cd appquiz
# Serve it (recommended, so stories.json and uploaded files load reliably):
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double‑click `index.html`. (When opened directly from disk via `file://`, some browsers block auto‑loading `stories.json` and opening uploaded files in new tabs; serving as above avoids this.)

**First run:** enter the private access code (set by the parent), then set up a profile. AI features are optional — add an Anthropic API key via the 🔑 button (top‑right). The key is stored **only on that device** in `localStorage` and is sent directly to Anthropic.

> 🔐 The access code is intentionally **not** published in this repository. It is XOR‑encoded in the source (no plaintext appears in the file). To set your own, see the comment beside the `_AC` constant in `index.html`.

---

## Repository layout

| File | Purpose |
|------|---------|
| `index.html` | The entire application — HTML, CSS, embedded content data, and JavaScript in one self‑contained file. |
| `stories.json` | Story‑telling library, loaded at runtime. Add stories here or upload them in‑app. |
| `README.md` | This file. |
| `Quest_PSLE_Technical_Documentation.docx` | Full technical reference for rebuilding the app. |

---

## Configuration

Open `index.html` and look near the top of the application `<script>`:

```js
const CONFIG = Object.freeze({
  APP_NAME:'Quest PSLE', APP_VERSION:'1.0',
  AI_MODEL:'claude-haiku-4-5-20251001',
  MAX_SAVED_QUIZZES:30,
  SESSION_TOKEN_LIMIT:40000,
  // ...
});
```

- **Access code** — XOR‑encoded as the `_AC` byte array (no plaintext in source). The comment beside it explains how to generate the bytes for a new code.
- **AI model / token caps** — adjust in `CONFIG`.
- **Branding / colours** — edit the CSS variables in `:root` (`--accent`, `--accent2`, subject colours, etc.).

---

## Content included

| Area | Count |
|------|-------|
| Idioms | 1,145 |
| "Very" → stronger‑word alternatives | 214 |
| Spelling words (2 lists) | 175 |
| Math problem‑sum heuristics | 12 |
| Math keyword topics | 9 |
| Science Five‑Pillar Q&A | 94 |
| Curated offline MCQs | 205 |
| Story chapters | 10 |

---

## Privacy & security

- **No accounts, no servers, no analytics.** All progress lives in the browser's `localStorage`; uploaded documents live in the browser's IndexedDB.
- The optional **API key never reaches any third party** other than Anthropic, and only when the child uses an AI feature.
- A **Content‑Security‑Policy**, input escaping, an encoded activation gate, and a parent PIN are built in.
- A garbage‑input guard prevents accidental/wasteful AI calls on blank or nonsense input.

---

## Tech stack

Vanilla **HTML + CSS + JavaScript**. No build step, no framework, no dependencies. Web Speech API for text‑to‑speech and speech recognition; IndexedDB for document storage. Optional Anthropic Messages API for AI features.

---

## Roadmap

Highlights from the technical documentation: timed mock papers, a spaced‑repetition daily challenge, composition photo‑upload + AI marking, weak‑topic detection, multi‑child profiles, weekly parent digests, and a PWA service worker for true offline install.

---

## Contributing

Issues and pull requests are welcome. Because everything is one file, keep changes focused and run the in‑repo sanity checks (syntax, balanced CSS, no orphan handlers) before submitting.

## License

MIT — free to use, adapt and share. Educational content is provided for revision purposes.

## Acknowledgements

Created by **cylho** to help Singapore families prepare for the PSLE without the cost of tuition. Built with assistance from Claude (Anthropic).
