import os
import pandas as pd
import numpy as np

class AdmissionsCausalGraph:
    """
    Defines explicit structural assumption graphs for the admissions domain.
    Implements structural variation to model recourse sensitivity under causal uncertainty.
    """
    def __init__(self):
        # Explicit definition of feature types to prevent downstream coordinate distortion
        self.feature_metadata = {
            "background_context": ["University Rating"],
            "immutable": ["CGPA"],
            "mutable_continuous": ["GRE Score", "TOEFL Score"],
            "mutable_ordinal": ["SOP", "LOR"],
            "mutable_binary": ["Research"]
        }
        
        # Defining feature boundaries for deterministic validity checking
        self.bounds = {
            "GRE Score": (260.0, 340.0, 1.0),
            "TOEFL Score": (80.0, 120.0, 1.0),
            "SOP": (1.0, 5.0, 0.5),
            "LOR": (1.0, 5.0, 0.5),
            "Research": (0.0, 1.0, 1.0),
            "CGPA": (5.0, 10.0, 0.01),
            "University Rating": (1.0, 5.0, 1.0)
        }

        # Multi-Graph Uncertainty Scenarios (Addressing the Karimi/Structural Uncertainty Critique)
        self.graphs = {
            "Graph_A_Standard": {
                "CGPA": ["GRE Score", "TOEFL Score", "Research"],
                "University Rating": ["GRE Score", "TOEFL Score"],
                "Research": ["SOP", "LOR"],
                "GRE Score": [], "TOEFL Score": [], "SOP": [], "LOR": []
            },
            "Graph_B_Holistic_Dominance": {
                "CGPA": ["SOP", "LOR"],
                "University Rating": ["SOP", "LOR"],
                "Research": ["GRE Score"],
                "GRE Score": [], "TOEFL Score": [], "SOP": [], "LOR": []
            }
        }

    def propagate_intervention(self, original_profile: pd.DataFrame, target_interventions: dict, graph_key: str = "Graph_A_Standard") -> pd.DataFrame:
        """
        Executes structural interventions on a causal graph by propagating downstream mutations 
        via linear structural estimation approximations.
        """
        counterfactual_profile = original_profile.copy()
        graph = self.graphs.get(graph_key, self.graphs["Graph_A_Standard"])
        
        # Apply the explicit intervention root changes
        for feature, target_val in target_interventions.items():
            counterfactual_profile[feature] = float(target_val)
            
        # Standard structural propagation heuristics (e.g., Active Research foundation adjustments cascade to SOP/LOR scores)
        if "Research" in target_interventions and target_interventions["Research"] == 1:
            if "SOP" in graph.get("Research", []):
                counterfactual_profile["SOP"] = np.minimum(counterfactual_profile["SOP"] + 0.5, 5.0)
            if "LOR" in graph.get("Research", []):
                counterfactual_profile["LOR"] = np.minimum(counterfactual_profile["LOR"] + 0.5, 5.0)
                
        if "GRE Score" in target_interventions:
            # Propagate correlated language test components under shared latent assumptions
            if "TOEFL Score" in graph.get("GRE Score", []):
                counterfactual_profile["TOEFL Score"] = np.minimum(counterfactual_profile["TOEFL Score"] + 2, 120)

        # Enforce hard deterministic feature boundaries post-propagation
        for feat, (min_b, max_b, step) in self.bounds.items():
            val = counterfactual_profile[feat].iloc[0]
            bounded_val = max(min_b, min(max_b, val))
            if step == 0.5:
                bounded_val = round(bounded_val * 2) / 2
            elif step == 1.0:
                bounded_val = round(bounded_val)
            counterfactual_profile[feat] = float(bounded_val)
            
        return counterfactual_profile