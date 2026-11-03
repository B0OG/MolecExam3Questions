# MolecExam3 Questions

Minimal multiple-choice quiz site for Molecular Medicine Exam 3.

## One-time setup

1. Open the [master Google Sheet](https://docs.google.com/spreadsheets/d/13fqa2rBEcpVLRnJQvZAXbMMwyqkjz2NflTG3HeN15PI/edit).
2. In Google Sheets choose **File → Share → Publish to web**. Select the **Questions** tab, select **Comma-separated values (.csv)** and click Publish. Copy the generated CSV URL.
3. The site's built-in Google Sheets CSV source has been configured in `index.html` (Nov 3, 2026). Refreshing the site loads the current published questions.
4. On GitHub navigate to **Settings → Pages → Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.
5. Visit your Pages URL and verify questions and progress. Test appending a new question in Google Sheets.

## Updating questions

Ask ChatGPT to add verified questions directly to the connected Google Sheet. Every question has an immutable ID, and the site loads the latest published CSV when opened or refreshed (Google publication updates may take a few minutes).

Columns: `id, lecture, category, source, question, A, B, C, D, E, correct, explanation, status, version, updated_at`.

Question types/categories are discovered from the Sheet automatically. Keep IDs unchanged when revising existing questions to preserve progress. Use `status=inactive` to hide withdrawn questions.

## Progress and privacy

Progress is saved in browser localStorage, by question ID. Different browsers and devices do not automatically sync. Export a JSON backup before clearing browser data or changing devices. First-attempt accuracy is preserved through retries.

The repository and published Sheet content are public. Six starter questions are embedded as a clearly labeled fallback if loading the published CSV fails.

## Student login (Firebase) — one-time setup

This version supports **Sign in with Google** and **email/password**, with private cloud-saved question progress. It remains in guest mode until you connect a Firebase project.

1. Go to https://console.firebase.google.com and create a **Firebase project** (Spark/free plan is fine for a small classroom study app).
2. In **Project settings → Your apps**, register a **Web app**. Copy the `firebaseConfig` values (`apiKey`, `authDomain`, `projectId`, `appId`). These are public web configuration identifiers, **not** service-account secrets.
3. In **Build → Authentication → Sign-in method**, enable **Google** and **Email/Password**.
4. In **Authentication → Settings → Authorized domains**, add `b0og.github.io` (domain only, no `https://` or repository path). Modern Firebase projects may not automatically authorize GitHub Pages.
5. In **Build → Firestore Database**, create a **Standard** database in **Native mode**. In the **Rules** tab, replace the defaults with the contents of the repository's [firestore.rules](./firestore.rules) file, then **Publish**. Do **not** leave permissive test-mode rules live.
6. Give ChatGPT the Firebase **web app configuration object** (never a private key), or edit `firebase-config.js` in this repository and fill in the four values. After the next GitHub Pages deploy, students can sign in.

**How saving works:** Each user gets separate cloud documents under `users/{uid}/progress/{questionId}`, with first-attempt history and bookmarks. The site retains the existing browser-local guest progress. The first time a user signs in from a browser containing guest answers, it offers to import *unmatched* guest records into their account; it does not silently mix students' answers. Import/export JSON remains available. Sign out returns to the current browser's guest records.

**Important:** Logging in protects **individual progress**, not the question bank. Questions remain public in the published Google Sheet. The GitHub Pages frontend is still publicly viewable. Firebase must be configured and the Firestore rules published before cloud sync is operational.
