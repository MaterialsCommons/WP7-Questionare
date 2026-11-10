# Materials Commons infrastructure questionnaire — Version 18

Version 18 changes: single + Add resource button; free-text Category field with hover/focus tooltip; category included in community resources JSON and PDF exports; automatic migration of Version 17 category-grouped browser drafts. Infrastructure questionnaire and SharePoint submission flow remain unchanged.

Deploy all files to GitHub Pages. Browser data stays in the same local storage key.

# Materials Commons infrastructure questionnaire — Version 15

Based on the deployed Version 14 website package, preserving the established five sections, exports, deployment workflow, and local draft key.

## Changes
- Infrastructure & Governance: new federation/consortium/research-centre membership question.
- Programmatic Access & Interfaces Q6: new question about discovery, querying, and retrieval through external platforms, with conditional details (moved from Section 1; existing answer ID `s1q7c` retained for draft compatibility).
- Infrastructure & Governance: optional operational status, access conditions and capacity details when HPC/cloud resources are selected.
- Scientific Scope: add general-purpose/no domain mandate option and explanatory notes for both Cross-domain and General-purpose.
- Programmatic Access & Interfaces Q2: focus on interfaces/protocols including REST, SFTP, HTTPS and WebDAV.
- Programmatic Access & Interfaces Q5: retain existing retrieval mechanisms, clarifying their distinction from Q2.
- Version updated to 15 in page label, questionnaire metadata, and asset cache-busting parameters.

## Deploy
Copy the files into the root of the `main` branch of your existing GitHub repository. Keep your existing repository configuration if it differs. Commit and push to `main`; the included Pages workflow is unchanged.

## Compatibility
The browser draft storage key is unchanged. Existing selected options for Section 4 Q2 `Bulk download` and `File transfer` no longer appear in Q2; respondents should review and reselect relevant protocols there. These retrieval capabilities remain available in Q5. New question IDs are additive; existing IDs are preserved.

Test locally using `python -m http.server 8000`, and review the new questions, JSON/PDF export and draft retention before publishing.

## Version 15 refinement — Other (please specify)
- Ontologies / controlled vocabularies: add Other with conditional free-text input.
- Scientific Scope materials domains: existing Other conditional free-text input retained.
- Computational modelling and simulation: add conditional free-text input for the main Other option (nested electronic-structure Other already supported).
- External platform capabilities: add Other with conditional free-text input.
- Version remains 15; existing question IDs and stored answers are preserved.

## Version 15 follow-up refinements
- Technical contacts: use **+ Add another contact** for multiple name/topic/email entries. Original first-contact name and email answer keys remain intact.
- Scientific Scope: Cross-domain and General-purpose each reveal their own optional specification box when selected; Other reveals **Other (please specify)**.
- Computational modelling: selecting main-level Other reveals **Other (please specify)** immediately below the choice.
- Ontologies / controlled vocabularies: selecting Other reveals **Other (please specify)**.
- Existing Version 15 section order and questions are unchanged.

## Version 16 — multiple infrastructures
- Add any number of infrastructures with **+ Add another infrastructure**.
- Each infrastructure has its own answers and remembers its current section across switches.
- The respondent information (name, role, organisation, date) is shared.
- The selector displays each infrastructure's name from Section 1 Question 1; unnamed entries use numbered placeholders.
- **Remove current** asks for confirmation and deletes only that infrastructure's answers.
- One download ZIP contains **one JSON and one PDF per infrastructure**, with unique numbered filenames.
- Existing single-infrastructure drafts are migrated automatically on first load. The local-storage key remains unchanged.
- All five questionnaire sections and Version 15 fields are retained.

## Submission instructions
Respondents must download the ZIP and upload the ZIP itself to the designated SharePoint folder. Downloading does not submit responses. These instructions appear at the beginning and end of the questionnaire and in the download confirmation.


## Version 17 — Awesome MaterialsCommons Resources
- A prominent sixth tab, **★ Community Resources**, is separate from the five infrastructure-specific sections.
- Collect community resources in seven categories: Infrastructures, Dataspaces, Tools, Workflows, Interfaces, Protocols, Ontologies.
- Each category supports any number of free-form entries with **Name**, **Purpose / short description**, and **Link to repository or website**.
- This tab is optional, does not depend on the currently selected infrastructure, and persists across infrastructure switching.
- Entries are saved locally with the assessment and included once in the ZIP as `community-resources.json` and `community-resources.pdf`, alongside one JSON and PDF per infrastructure.
- Respondents must still upload the downloaded ZIP to the existing SharePoint folder; downloading alone does not submit it.
- Existing Version 16 local drafts migrate automatically, with no change to the storage key.

## Version 17 layout revision
- The community resources collection is **not** a sixth tab. All five infrastructure questionnaire tabs remain unchanged.
- The green community resources introduction box has been moved from the preamble to the end of the fifth section, immediately before the download area.
- The editable community resource categories (name, purpose, link, with add/remove controls) appear in the same box, before the download button.
- Entries are shared across infrastructures and included in the same JSON/PDF export files as before.

## Version 17 layout refinement
- The community resources panel is collapsed by default and expands when its header is clicked.
- Each category shows a **+ Add** button; entry fields appear only after a resource is added.
- An **Other** category allows suggestions that do not fit the seven named categories.
- Resources remain independent of infrastructure and are included in the combined export.

## Infrastructure selection guidance
The infrastructure selector explains that all five sections are completed per infrastructure, answers are saved separately, and the dropdown label updates from Section 1, Question 1. The first question is retained to avoid changing existing response data and exports.

## Infrastructure naming (Version 17 refinement)
Infrastructure names are entered in the green Infrastructures selector panel, not as Section 1 Question 1. The dropdown updates live. Existing saved answers to the former Question 1 are migrated into the infrastructure name field; infrastructure exports continue to include the name.

Version 17: The optional community resources disclosure now has a prominent circular arrow that rotates when expanded and an explicit expand/collapse label.
