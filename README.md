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
