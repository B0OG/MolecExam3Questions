# MolecExam3 Questions

Minimal multiple-choice quiz site for Molecular Medicine Exam 3.

## One-time setup

1. Open the [master Google Sheet](https://docs.google.com/spreadsheets/d/13fqa2rBEcpVLRnJQvZAXbMMwyqkjz2NflTG3HeN15PI/edit).
2. In Google Sheets choose **File → Share → Publish to web**. Select the **Questions** tab, select **Comma-separated values (.csv)** and click Publish. Copy the generated CSV URL.
3. Send that CSV URL to ChatGPT to insert as the **DEFAULT_CSV_URL** in `index.html`. Do not rely on the website's browser-local “Save source” setting for classmates.
4. On GitHub navigate to **Settings → Pages → Build and deployment**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.
5. Visit your Pages URL and verify questions and progress. Test appending a new question in Google Sheets.

## Updating questions

Ask ChatGPT to add verified questions directly to the connected Google Sheet. Every question has an immutable ID, and the site loads the latest published CSV when opened or refreshed (Google publication updates may take a few minutes).

Columns: `id, lecture, category, source, question, A, B, C, D, E, correct, explanation, status, version, updated_at`.

Question types/categories are discovered from the Sheet automatically. Keep IDs unchanged when revising existing questions to preserve progress. Use `status=inactive` to hide withdrawn questions.

## Progress and privacy

Progress is saved in browser localStorage, by question ID. Different browsers and devices do not automatically sync. Export a JSON backup before clearing browser data or changing devices. First-attempt accuracy is preserved through retries.

The repository and published Sheet content are public. Six starter questions are embedded as a fallback until the published CSV source is configured.
