import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

from src.optimizer import InstitutionalModelRegistry, BaselineExplainerEngine
from src.causal_graph import AdmissionsCausalGraph
from src.causal_recourse import CausalRecourseAuditor
from src.translator import RecourseNarrativeTranslator

# Resolve input files relative to this checkout.
ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = os.path.join(ROOT_DIR, "data", "Admission_Predict.csv")

app = FastAPI(title="DecisionLens Causal Recourse Core Engine")

# Allow the local frontend during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Training currently runs at application startup.
registry = InstitutionalModelRegistry(DATA_PATH)
explainer = BaselineExplainerEngine(registry)
graph_engine = AdmissionsCausalGraph()
auditor = CausalRecourseAuditor(registry, explainer, graph_engine)
translator = RecourseNarrativeTranslator()

class ProfileInputSchema(BaseModel):
    gre: float
    toefl: float
    univ_rating: float
    sop: float
    lor: float
    cgpa: float
    research: float
    selected_graph: str = "Graph_A_Standard"

@app.post("/api/v1/evaluate-pathway")
async def evaluate_pathway(payload: ProfileInputSchema):
    try:
        profile_df = pd.DataFrame([{
            "GRE Score": payload.gre, "TOEFL Score": payload.toefl, "University Rating": payload.univ_rating,
            "SOP": payload.sop, "LOR": payload.lor, "CGPA": payload.cgpa, "Research": payload.research
        }])
        
        # Compare candidates under the selected graph assumptions.
        results = auditor.compute_comparative_recourse(profile_df, target_graph=payload.selected_graph)
        
        # Draft a narrative from the computed comparison.
        narrative = translator.generate_applicant_pathway_report(
            status=results["causal_validity"], score=results["causal_score"], metrics_context="Causal evaluation mapping complete."
        )
        
        return {
            "causal_validity": results["causal_validity"],
            "causal_score": float(results["causal_score"]),
            "narrative_report": narrative,
            "matrices": {
                "current": profile_df.iloc[0].to_dict(),
                "causal_target": results["mode3_causal_propagated"].iloc[0].to_dict()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/proxy-audit")
async def proxy_audit(sample_size: int = 30):
    try:
        audit_df = auditor.run_proxy_distribution_audit(sample_size=sample_size)
        return audit_df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
