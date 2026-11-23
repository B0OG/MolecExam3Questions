# MolecExam3 Questions

Minimal lecture-organized question bank for Molecular Medicine **Exam 5**, supporting multiple-choice and fill-in-the-blank recall. (The repository name still says Exam 3; the site now serves Exam 5 only.)

## One-time setup

1. Open the [master Google Sheet](https://docs.google.com/spreadsheets/d/13fqa2rBEcpVLRnJQvZAXbMMwyqkjz2NflTG3HeN15PI/edit).
2. In Google Sheets choose **File → Share → Publish to web**. The whole document is published, so each tab is reachable as CSV by its `gid`.
3. The site's built-in Google Sheets CSV source is configured in `index.html` (`DEFAULT_CSV_URL`, repointed to the **Exam 5 Questions** tab on Nov 23, 2026). Refreshing the site loads the current published questions.
4. On GitHub navigate to **Settings → Pages → Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.
5. Visit your Pages URL and verify questions and progress. Test appending a new question in Google Sheets.

## Scope

The site serves **Exam 5 Molecular Medicine questions only**. The HSS, PCS and OPP course tabs and their CSV files were removed on Nov 23, 2026, and the Exam 3 and Exam 4 banks are retired (their published-CSV URLs are kept as comments in `index.html`). Progress for retired questions stays in localStorage keyed by question ID; it is simply not shown.

## Updating questions

Add verified questions directly to the connected Google Sheet (the `Exam 5 Questions` tab). Every question has an immutable ID, and the site loads the latest published CSV when opened or refreshed (Google publication updates may take a few minutes).

Columns: `id, lecture, category, source, question, A, B, C, D, E, correct, explanation, status, version, updated_at, type, answer, section, reference, faculty_key_note, source_page`.

- `type=mcq`: use original question choices (two to five choices), and `correct` is the letter of the answer.
- `type=recall`: keep the original fill-in-the-blank stem and put faculty-key answers in `answer`; no answer options or `correct` letter needed. The student reveals the answer, then self-marks correct or missed.
- The `Lectures` tab is the human-readable catalog. `LECTURE_ORDER` in `index.html` sets the display order; any lecture not listed there is sorted alphabetically after the listed ones.
- Exam 5 (Nov 23, 2026): Basic Principles of Antimicrobial Therapy, Extracellular Matrix ILA, Developmental Genetics ILA and Inflammation ILA, with `Intro Questions (AI)`, `Exam Style Questions (AI)` and faculty `Bits Questions`.

Question types/categories are discovered from the Sheet automatically. Keep IDs unchanged when revising existing questions to preserve progress. Use `status=inactive` to hide withdrawn questions.

## Progress and privacy

Progress is saved in browser localStorage, by question ID. Different browsers and devices do not automatically sync. Export a JSON backup before clearing browser data or changing devices. First-attempt accuracy is preserved through retries.

The repository and published Sheet content are public. No starter/demo questions remain. If the Google Sheet cannot load, the site displays a connection error rather than substitute test questions.

## Student login (Firebase) — one-time setup

This version supports **Sign in with Google** and **email/password**, with private cloud-saved question progress. It remains in guest mode until Firebase Authentication and Firestore have been configured and enabled for the project.

1. Go to https://console.firebase.google.com and create a **Firebase project** (Spark/free plan is fine for a small classroom study app).
2. In **Project settings → Your apps**, register a **Web app**. Copy the `firebaseConfig` values (`apiKey`, `authDomain`, `projectId`, `appId`). These are public web configuration identifiers, **not** service-account secrets.
3. In **Build → Authentication → Sign-in method**, enable **Google** and **Email/Password**.
4. In **Authentication → Settings → Authorized domains**, add `b0og.github.io` (domain only, no `https://` or repository path). Modern Firebase projects may not automatically authorize GitHub Pages.
5. In **Build → Firestore Database**, create a **Standard** database in **Native mode**. In the **Rules** tab, replace the defaults with the contents of the repository's [firestore.rules](./firestore.rules) file, then **Publish**. Do **not** leave permissive test-mode rules live.
6. The Firebase **public web app configuration** is already saved in `firebase-config.js`. After enabling authentication, publishing Firestore rules, and deploying GitHub Pages, students can sign in.

**How saving works:** Each user gets separate cloud documents under `users/{uid}/progress/{questionId}`, with first-attempt history and bookmarks. The site retains the existing browser-local guest progress. The first time a user signs in from a browser containing guest answers, it offers to import *unmatched* guest records into their account; it does not silently mix students' answers. Import/export JSON remains available. Sign out returns to the current browser's guest records.

**Important:** Logging in protects **individual progress**, not the question bank. Questions remain public in the published Google Sheet. The GitHub Pages frontend is still publicly viewable. Firebase must be configured and the Firestore rules published before cloud sync is operational.
