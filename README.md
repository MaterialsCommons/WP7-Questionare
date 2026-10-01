# Materials Commons — Infrastructure Assessment Questionnaire

Static, offline-first questionnaire adapted from the supplied CircSmeltSteel GitLab Pages project and the supplied `Infrastructure_assessment_questionare.xlsx`. This version is configured for **GitHub Pages**.

## What it does

- Five sections matching the Excel questionnaire.
- Appropriate single-choice, multi-select, URL, free-text and composite answer controls.
- Browser-local draft saving; responses are not posted to GitHub.
- JSON export for aggregation and PDF export for a readable assessment record.
- Responsive layout based on the reference project.

## Publish with GitHub Pages

1. Push to the `main` branch.
2. In GitHub, open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open **Actions** and wait for `Deploy Materials Commons questionnaire to GitHub Pages` to complete.
4. Return to **Settings → Pages** to open the published site URL.

The workflow is `.github/workflows/pages.yml`. Unlike the reference project, no `.gitlab-ci.yml` is required.

## Local preview

Run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. Do not rely on opening `index.html` directly because browsers may block loading `questionnaire.json` from a local file URL.

## Files

- `index.html` — page shell and assessment metadata.
- `styles.css` — responsive styling adapted from the reference project.
- `app.js` — rendering, local draft storage and exports.
- `questionnaire.json` — questionnaire content derived from the Excel workbook.
- `pdf-export.js` — self-contained PDF export.
- `.github/workflows/pages.yml` — GitHub Pages deployment.

## Data/privacy model

The site is static. Answers remain in browser `localStorage` until cleared and are exported locally as files. GitHub Pages hosts the questionnaire application but does not receive the completed assessment through this application. If central submission is later required, add an approved destination/workflow separately.
