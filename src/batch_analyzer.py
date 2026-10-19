import os
import pandas as pd
import numpy as np
from optimizer import InstitutionalModelRegistry, IntelligentRecourseEngine

class InstitutionalStressTester:
    """
    Executes Step 1 (Batch System Auditing) and Step 2 (Multi-Objective Optimization)
    across historically rejected dataset splits.
    """
    def __init__(self, data_path: str = "data/Admission_Predict.csv"):
        # Initialize our unified data and model registry
        self.registry = InstitutionalModelRegistry(data_path)
        from causal_graph import AdmissionsCausalGraph
        self.graph = AdmissionsCausalGraph(data_path)
        self.engine = IntelligentRecourseEngine(self.registry, self.graph)
        
        # Define our Step 2 Multi-Objective Friction Profiles mathematically
        self.MUTATION_PROFILES = {
            "Balanced_Policy": {
                "GRE Score": 3, "TOEFL Score": 3, "SOP": 3, "LOR": 3
            },
            "Narrative_Holistic_Policy": {
                "GRE Score": 5, "TOEFL Score": 5, "SOP": 1, "LOR": 1
            },
            "Quant_Exam_Policy": {
                "GRE Score": 1, "TOEFL Score": 1, "SOP": 5, "LOR": 5
            }
        }

    def isolate_rejected_test_cohort(self) -> pd.DataFrame:
        """Extracts applicants from the isolated test partition who did not gain direct acceptance."""
        X_test_raw = self.registry.X_test_raw.copy()
        y_test = self.registry.y_test
        
        # Filter for rows labeled as 0 (Not directly admitted under current thresholds)
        rejected_indices = np.where(y_test == 0)[0]
        return X_test_raw.iloc[rejected_indices]

    def run_batch_audit(self):
        """Step 1: Audits the entire rejected cohort across multi-objective boundaries."""
        rejected_cohort = self.isolate_rejected_test_cohort()
        total_applicants = len(rejected_cohort)
        
        print("\n" + "="*60)
        # DeepMind-inspired minimalist text formatting
        print("INSTITUTIONAL SYSTEM POLICY AUDIT & MATRIX ANALYSIS")
        print("="*60)
        print(f"Isolated Evaluation Pool Size: {total_applicants} profiles")
        print("Executing simulation passes across multi-objective profiles...")
        print("-"*60)
        
        for profile_name, friction_settings in self.MUTATION_PROFILES.items():
            successful_recourse_count = 0
            lockout_count = 0
            
            for idx in range(total_applicants):
                candidate_row = rejected_cohort.iloc[[idx]]
                
                # Verify they don't trigger simple hard code violations first
                policy_checks = {"degree_completed_before_start": True}
                status, score, _ = self.engine.evaluate_multi_stage_funnel(candidate_row, policy_checks)
                
                if "REJECT" in status or status == "WAITLIST_POOL":
                    outcome, _ = self.engine.generate_weighted_recourse(candidate_row, friction_settings)
                    if outcome == "SUCCESS":
                        successful_recourse_count += 1
                    else:
                        lockout_count += 1
                        
            viability_rate = (successful_recourse_count / total_applicants) * 100
            lockout_rate = (lockout_count / total_applicants) * 100
            
            print(f"Profile Paradigm: {profile_name.replace('_', ' ')}")
            print(f"  -> Actionable Recourse Path Viability : {viability_rate:.1f}%")
            print(f"  -> Absolute Structural Lockout Rate  : {lockout_rate:.1f}%")
            print("-"*60)

    def generate_candidate_options_menu(self, candidate_index: int = 0):
        """Step 2: Generates a distinct three-choice pathway menu for a specific individual."""
        rejected_cohort = self.isolate_rejected_test_cohort()
        if candidate_index >= len(rejected_cohort):
            print("Target evaluation index out of bounds.")
            return
            
        candidate_profile = rejected_cohort.iloc[[candidate_index]]
        print(f"\n[Generating Menu Options for Candidate ID: {candidate_index}]")
        print("Baseline Profile Input Vectors:")
        print(candidate_profile.to_string(index=False))
        print("\nComputing multi-objective strategy coordinates...")
        print("="*60)
        
        for profile_name, friction_settings in self.MUTATION_PROFILES.items():
            outcome, result = self.engine.generate_weighted_recourse(candidate_profile, friction_settings)
            
            print(f"\nPathway Option: {profile_name.replace('_', ' ')}")
            if outcome == "SUCCESS":
                cf_df = result.cf_examples_list[0].final_cfs_df
                display_df = cf_df.copy()
                if self.registry.target_col in display_df.columns:
                    display_df.drop(columns=[self.registry.target_col], inplace=True)
                    
                original_row = candidate_profile.iloc[0]
                target_row = display_df.iloc[0]
                
                adjustments = []
                for col in candidate_profile.columns:
                    if abs(original_row[col] - target_row[col]) > 0.01:
                        adjustments.append(f"{col}: {original_row[col]} -> {target_row[col]}")
                        
                if adjustments:
                    for adj in adjustments:
                        print(f"  * {adj}")
                else:
                    print("  * Target metrics comfortably maintained at baseline.")
            else:
                print("  * Path Infeasible: Immutability constraints create an insurmountable boundary for this profile.")
        print("="*60 + "\n")

if __name__ == "__main__":
    # Initialize the automated benchmarking framework
    tester = InstitutionalStressTester()
    
    # 1. Execute Step 1: Global Batch Audit Simulation
    tester.run_batch_audit()
    
    # 2. Execute Step 2: Individual Multi-Objective Menu Generation
    tester.generate_candidate_options_menu(candidate_index=2)