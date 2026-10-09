# Materials Commons Infrastructure Assessment

Static, offline-first Materials Commons infrastructure assessment questionnaire based on the supplied `Infrastructure_assessment_questionare.xlsx`. This version is configured for **GitHub Pages**.

## What it does

- Five sections matching the Excel questionnaire.
- Appropriate single-choice, multi-select, URL, free-text and composite answer controls.
- Browser-local draft saving; responses are not posted to GitHub.
- JSON export for aggregation and PDF export for a readable assessment record.
- Responsive layout based on the reference project.

## Publish with GitHub Pages

1. Create a GitHub repository and place all files from this folder at the repository root.
2. Push to the `main` branch.
3. In GitHub, open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open **Actions** and wait for `Deploy Materials Commons questionnaire to GitHub Pages` to complete.
5. Return to **Settings → Pages** to open the published site URL.

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

## Version 3 corrections

The assessment-information block contains **Name**, **Role / position**, **Organisation**, and **Date** only.
The infrastructure name is collected in Question 1.

The computational-modelling question uses a nested control: selecting **Electronic-structure calculations**
reveals DFT, wave-function-based methods, Green-function-based methods, and other electronic-structure methods.

## Version 7

Infrastructure & Governance question 5 is split into data-related services and additional services. Each option has a short definition directly underneath. Existing answer storage key is retained to preserve drafts. The new question uses the distinct ID `s1q5b`.

## Version 8

Replaced Experimental facility services with Automated / remotely accessible experimental facilities, including a definition covering self-driving laboratories.

## Version 9: SharePoint submission instructions

Respondents download both JSON and PDF files, open the linked **Questionare Answers** SharePoint folder and upload both files manually. The site does not upload data automatically; SharePoint access permissions are required. The folder link appears in the preamble and the Save assessment area.

## Version 10

A single export button requests JSON and PDF downloads and opens the SharePoint folder in a new tab. Respondents must manually upload both files. Browsers may require permission for multiple downloads or pop-ups. The SharePoint link in the preamble is yellow.

## Version 11

Fixed unreliable double-download behavior. One click now downloads a single ZIP containing separate JSON and PDF files and opens SharePoint. Extract and upload both files.
