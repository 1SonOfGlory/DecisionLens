import pandas as pd
import numpy as np
from src.optimizer import InstitutionalModelRegistry, BaselineExplainerEngine
from src.causal_graph import AdmissionsCausalGraph

class CausalRecourseAuditor:
    """
    Implements true causal intervention adjustments, audits counterfactual validity,
    and isolates structural lockout distributions by proxy groups.
    """
    def __init__(self, registry: InstitutionalModelRegistry, explainer: BaselineExplainerEngine, graph_engine: AdmissionsCausalGraph):
        self.registry = registry
        self.explainer = explainer
        self.graph_engine = graph_engine
        
        self.friction_costs = {
            "GRE Score": 5.0, "TOEFL Score": 2.5, "SOP": 1.0, "LOR": 1.0, "Research": 10.0
        }

    def compute_comparative_recourse(self, raw_profile: pd.DataFrame, target_graph: str = "Graph_A_Standard") -> dict:
        """
        Evaluates an applicant's alternative routes across three distinct tiers:
        1. Non-Causal DiCE, 2. Friction-Aware Selection, 3. True Propagated Causal Intervention.
        """
        features_to_vary = ["GRE Score", "TOEFL Score", "SOP", "LOR", "Research"]
        
        # Mode 1: Non-Causal Baseline Counterfactual
        cf_raw = self.explainer.exp.generate_counterfactuals(
            raw_profile, total_CFs=1, desired_class=1, features_to_vary=features_to_vary
        )
        mode1_df = cf_raw.cf_examples_list[0].final_cfs_df
        
        # Mode 2: Friction-Aware (Current Setup)
        dice_weights = {feat: float(self.friction_costs.get(feat, 1.0)) for feat in features_to_vary}
        cf_weighted = self.explainer.exp.generate_counterfactuals(
            raw_profile, total_CFs=1, desired_class=1, features_to_vary=features_to_vary, feature_weights=dice_weights
        )
        mode2_df = cf_weighted.cf_examples_list[0].final_cfs_df
        
        # Mode 3: True Propagated Causal Recourse Intervention
        # Isolate target changes suggested by baseline weights, then force graph propagation downstream
        interventions = {}
        for feat in features_to_vary:
            orig = raw_profile[feat].iloc[0]
            tgt = mode2_df[feat].iloc[0]
            if abs(orig - tgt) > 0.01:
                interventions[feat] = tgt
                
        mode3_df = self.graph_engine.propagate_intervention(raw_profile, interventions, graph_key=target_graph)
        
        # Validity audits via the classifier manifold
        scaled_m3 = self.registry.scale_dataframe(mode3_df)
        m3_validity_score = self.registry.model.predict_proba(scaled_m3)[0][1]
        m3_verdict = "VALID" if m3_validity_score >= 0.5 else "INVALID_CAUSAL_COLLAPSE"
        
        return {
            "mode1_non_causal": mode1_df,
            "mode2_friction_aware": mode2_df,
            "mode3_causal_propagated": mode3_df,
            "causal_validity": m3_verdict,
            "causal_score": m3_validity_score
        }

    def run_proxy_distribution_audit(self, sample_size: int = 50) -> pd.DataFrame:
        """Audits structural lockout boundaries across tier groups instead of explicit demographics."""
        test_cohort = self.registry.X_test_raw.copy().head(sample_size)
        audit_records = []
        
        for idx in range(len(test_cohort)):
            row = test_cohort.iloc[[idx]]
            scaled_row = self.registry.scale_dataframe(row)
            base_score = self.registry.model.predict_proba(scaled_row)[0][1]
            
            if base_score < 0.5:
                # Evaluate alternative strategy availability
                res = self.compute_comparative_recourse(row)
                lockout = "No" if res["causal_validity"] == "VALID" else "Yes_Structural_Lockout"
                
                audit_records.append({
                    "University_Tier": row["University Rating"].iloc[0],
                    "CGPA_Band": "Low (<7.5)" if row["CGPA"].iloc[0] < 7.5 else "High (>=7.5)",
                    "Research_Experience": row["Research"].iloc[0],
                    "Structural_Lockout": lockout
                })
                
        return pd.DataFrame(audit_records)
