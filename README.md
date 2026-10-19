# DecisionLens

A research prototype for inspecting counterfactual alternatives to a random-forest prediction on an admissions-score dataset. The backend compares baseline and feature-weighted DiCE searches, then explores downstream changes under two manually specified graphs. A React interface presents the proposed changes.

## What to inspect

- `src/optimizer.py`: split, preprocessing, random forest, and DiCE adapter.
- `src/causal_recourse.py`: comparison of candidate alternatives.
- `src/causal_graph.py`: explicit graph assumptions and downstream adjustments.
- `src/api.py`: FastAPI request and response boundary.
- `frontend/src/components/FeasibleRecoursePathways.jsx`: applicant-facing comparison.

## Run locally

Use Python 3.12 and a virtual environment. Install `requirements.txt`. Obtain a dataset you have permission to use and place it at `data/Admission_Predict.csv`. Required columns are `GRE Score`, `TOEFL Score`, `University Rating`, `SOP`, `LOR`, `CGPA`, `Research`, and `Chance of Admit`; an optional `Serial No.` is discarded. The dataset and trained artifacts are not distributed here because the original data license was not recorded.

Set `GROQ_API_KEY` and `GEMINI_API_KEY` in the environment for narrative generation. These provider calls may incur charges. Start the backend with `python -m uvicorn src.api:app --host 127.0.0.1 --port 8000`. In `frontend`, run `npm ci` and `npm run dev`.

## Interpretation and limitations

The binary target is a thresholded `Chance of Admit` score, not a verified admissions decision. The graphs and action costs are assumptions, not identified causal effects. Search failure does not prove that recourse is impossible. Changing the model prediction does not guarantee admission.

The existing audit identified preprocessing fitted before the inner cross-validation folds, categorical feature weights that may not affect DiCE proximity as intended, inconsistent success thresholds, and missing saved evaluation results. Those methodological issues remain open. Numerical performance, fairness, and user-benefit claims are not established by this release.

Several interface pages use mock applicants and fixed demonstration statistics. They are not live institutional records. The application needs the omitted dataset and provider configuration for an end-to-end run. This is a source publication, not a production deployment or a validated admissions tool.
