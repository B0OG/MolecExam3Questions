# MolecExam3 Questions — Recovery backup
Snapshot date: 2026-11-04 (America/Chicago)

## What this backup includes

This backup GitHub branch is a frozen *copy of the deployed website source at the time of the snapshot* plus copies of the separate Google Sheets question bank.

- `index.html` — complete website interface, embedded drawing, homepage, study/custom/exam modes, question navigation, highlighter and cross-outs.
- `auth.js`, `firebase-config.js`, `firestore.rules` — sign-in/progress syncing client code, public configuration, and Firestore security rules.
- `README.md` — existing site setup instructions (some historical details may be outdated).
- `backup-data/Questions.csv` — 258 live question records and all 21 original columns, including permanent IDs, answer keys, corrections, explanations, and references.
- `backup-data/Archive-Recall.csv` — 22 archived recall/fill-in questions (not displayed on the site).
- `backup-data/Lectures.csv` — 8 lecture-catalog rows.
- `BACKUP_README.md` — these restore instructions.

The snapshot preserves the original repository files as they were. The data files in `backup-data/` are added **only on the backup branch**, not to the live `main` branch.

### What it does NOT contain

**Student progress and Firebase database contents are NOT in this backup.** Each student's browser stores local progress separately, and signed-in user progress is held in Firebase Firestore. Website code and question bank backups cannot automatically restore that private data. Each student should use the website's **Export progress** button to download their own JSON file and store it somewhere safe. If the website is not accessible, restoring browser progress requires a valid previously exported JSON backup. Cloud data backup requires separate Firebase administration/export.

## Download a single ZIP

1. Open the `backup-2026-11-04` branch on GitHub: https://github.com/B0OG/MolecExam3Questions/tree/backup-2026-11-04
2. Click **Code → Download ZIP**.
3. Save the ZIP somewhere *outside GitHub*, such as your computer and a second backup location.

You may also use the immutable commit archive link supplied in the ChatGPT conversation; it continues to represent the exact commit if the branch is later edited.

## Restore the website code

1. **Don't overwrite newer work without checking.** Download the backup ZIP, unzip it, and inspect the files.
2. In the GitHub repository `B0OG/MolecExam3Questions`, restore these root files from the ZIP to the live `main` branch: `index.html`, `auth.js`, `firebase-config.js`, `firestore.rules`, and, if desired, `README.md`.
3. If you prefer GitHub operations, you can create a temporary recovery branch from the backup and compare or open a PR targeting `main`. Be aware that merging the backup branch as-is would also add `backup-data/` to `main`.
4. GitHub Pages is configured to publish from `main`, so the site will deploy the restored code after the normal publication delay.
5. Verify homepage, sign-in, question loading and answer submission after deployment.

For a pure *website UI rollback*, you can restore just `index.html` if the other code is still correct.

## Restore question-bank data

Live source (as of snapshot):
https://docs.google.com/spreadsheets/d/13fqa2rBEcpVLRnJQvZAXbMMwyqkjz2NflTG3HeN15PI/edit

1. Open the backup ZIP and locate `backup-data/Questions.csv`.
2. Import it into a **new** Google Sheet first (File → Import → Upload) to review the data.
3. To repair an existing damaged question bank, import the backup into the existing spreadsheet's **Questions** tab, replacing its *data* only after making a copy of the newer sheet. Keep the column names, source answer letters, and IDs unchanged.
4. If the original Google Sheet no longer exists, create a new one and import `Questions.csv` into a tab named **Questions**. Optionally recreate **Lectures** and **Archive - Recall (not on site)** from their respective CSVs.
5. If the spreadsheet URL changes, publish the **Questions** tab as CSV in Google Sheets and update `DEFAULT_CSV_URL` in the website's `index.html`. The browser may have a locally overridden URL too.
6. Wait for the published CSV feed to refresh, reload the website, and verify the question count.

**Restoring a snapshot overwrites later additions/corrections:** review newer questions and answers before replacing data. Source answer keys use the original option-letter columns; the website handles displayed-answer shuffling.

## Live links

- Website: https://b0og.github.io/MolecExam3Questions/
- Source repository: https://github.com/B0OG/MolecExam3Questions
- Backup branch: https://github.com/B0OG/MolecExam3Questions/tree/backup-2026-11-04
- Google Sheet: https://docs.google.com/spreadsheets/d/13fqa2rBEcpVLRnJQvZAXbMMwyqkjz2NflTG3HeN15PI/edit

Recommendation: download a new backup when you make significant code changes or add major batches of questions.
