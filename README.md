# BD Pro CV Studio (Open Source • v3.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

An advanced, open-source, customizable Bangladeshi CV & Career Studio built with **React 19, TypeScript, Tailwind CSS, Vite, PWA, Express, and Vercel Serverless Functions**.

Tailored for Bangladeshi corporate, banking, BCS/government, academic, MNC, and remote software engineering recruitments—supporting both 1-page modern resumes and standard 2-page Bangladeshi official CVs (including Father/Mother names, NID, tabular Education history, Referees, Declaration, and Digital Signature Pad).

---

## Key Features

- **5 Modular A4 Templates**:
  - `Classic BD Official` (Bangladeshi tabular education & passport photo layout)
  - `Modern Minimalist` (Dark tech header & skill badges)
  - `Corporate Executive` (Two-column executive sidebar)
  - `Academic & Research` (Serif typography & publications focus)
  - `ATS Minimalist Pro` (Clean single-column machine-readable format for MNCs/ATS portals)
- **Multi-CV Profile Workspace**: Manage, duplicate, rename, and switch between multiple job-specific CVs stored privately in your browser.
- **Smart ATS Score & Job Circular Matcher**: Paste any Bdjobs or LinkedIn job circular to audit keyword fit, spot missing skills (1-click add), and run deep AI/heuristic review (`/api/ai/ats-review`).
- **Interactive Signature Pad & QR Code Verification**: Draw your handwritten signature on canvas or upload an image; optionally embed a scannable LinkedIn/Portfolio QR code.
- **Bilingual Support (`বাংলা` & `English`)**: Switch both the studio UI and CV document section headings between English and Bangla (`cvHeadingLang`).
- **Multi-Format Export**: Direct A4 **PDF Download**, native **Print / Save as PDF**, editable **MS Word (`.doc`)**, **ATS Plaintext copy**, and **JSON backup export/import**.
- **Languages & Custom Sections**: Dedicated editors for Language Proficiency (Bengali, English, IELTS) and unlimited custom sections (Awards, Extracurricular Activities, Publications).
- **Installable PWA**: Install directly on Android/iOS home screens and use offline.

---

## Customization Guide (`src/config/appConfig.ts`)

Developers and organizations can customize branding, colors, and enabled modules in a single file:

```ts
// src/config/appConfig.ts
export const APP_CONFIG = {
  appName: 'BD Pro CV Studio',
  version: '3.0.0 Open Source',
  defaultLanguage: 'bn',
  features: {
    enableAIAssistant: true,
    enableATSAnalyzer: true,
    enableMultiProfiles: true,
    enableCoverLetter: true,
    enableQRCode: true,
    enableSignaturePad: true,
    enableWordExport: true,
    enableSurveyGuide: true,
  },
  // ...
};
```

- **Add Role Presets**: Edit `src/data/presets.ts`
- **Add/Modify Templates**: Edit files inside `src/components/Templates/`
- **Backend / Serverless Routes**: Sync changes across `server.ts` (local Express + Vite) and `api/index.ts` (Vercel serverless)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Optional: configure environment variables in .env
# GEMINI_API_KEY=your_google_gemini_api_key

# 3. Start full-stack dev server on port 3000
npm run dev
```

Note: AI endpoints gracefully fall back to offline smart presets and heuristic analysis if `GEMINI_API_KEY` is not provided.

---

## Deploy to Vercel (Step-by-Step)

This project includes pre-configured `vercel.json` and `api/index.ts` serverless routes:

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project -> Import Repository**.
3. Framework Preset auto-detects **Vite** (`Build Command: npm run build`, `Output Directory: dist`).
4. *(Optional)* Add `GEMINI_API_KEY` under **Environment Variables**.
5. Click **Deploy** — your live HTTPS site with PWA installability & serverless `/api/*` endpoints will be online in seconds.

---

## বাংলায় সংক্ষিপ্ত নির্দেশিকা (Vercel ডিপ্লয়মেন্ট)

১. আপনার প্রজেক্টের কোড GitHub-এ আপলোড (Push) করুন।
২. Vercel Dashboard থেকে **Import Project** করে আপনার GitHub রিপোজিটরি সিলেক্ট করুন।
৩. *(ঐচ্ছিক)* **Environment Variables**-এ `GEMINI_API_KEY` যোগ করুন (AI না দিলেও অফলাইন প্রিসেট কাজ করবে)।
৪. **Deploy** বাটনে ক্লিক করলেই আপনার সাইট লাইভ হয়ে যাবে এবং মোবাইল থেকে PWA অ্যাপ হিসেবে ইনস্টল করা যাবে।

---

## Project Structure

```text
├── api/index.ts                # Vercel serverless API entry (/api/ai/*)
├── server.ts                   # Local Express + Vite dev server (port 3000)
├── vercel.json                 # Vercel build & SPA/API routing rules
├── src/
│   ├── config/appConfig.ts     # Central branding, feature flags & color presets
│   ├── components/
│   │   ├── Editor/             # Modular form accordions & Signature Canvas
│   │   ├── Templates/          # 5 A4 CV Templates (Classic, Modern, Corporate, Academic, ATS)
│   │   ├── Preview/            # Zoomable A4 sheet + PDF / DOC / TXT / Print toolbar
│   │   └── *Modal.tsx          # Profile Workspace, ATS Matcher, Theme Studio, AI & Survey Hub
│   ├── utils/
│   │   ├── cvLabels.ts         # Bilingual headings, typography helpers, state normalizer
│   │   └── pdfExport.ts        # Direct A4 PDF, Print, MS Word (.doc) & Plaintext generators
│   └── App.tsx
└── LICENSE                     # MIT License
```
