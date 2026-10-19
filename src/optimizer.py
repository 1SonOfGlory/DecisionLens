import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, roc_auc_score
import dice_ml
from src.causal_graph import AdmissionsCausalGraph

class InstitutionalModelRegistry:
    def __init__(self, data_path: str, target_threshold: float = 0.75, model_dir: str = "models"):
        self.data_path = data_path
        self.target_threshold = target_threshold
        self.target_col = "Admit_Status"
        self.model_dir = model_dir
        
        os.makedirs(self.model_dir, exist_ok=True)
        
        raw_df = pd.read_csv(data_path)
        raw_df.columns = raw_df.columns.str.strip()
        if "Serial No." in raw_df.columns:
            raw_df.drop(columns=["Serial No."], inplace=True)
            
        self.feature_cols = [col for col in raw_df.columns if col != "Chance of Admit"]
        
        X_raw = raw_df[self.feature_cols]
        y_raw = np.where(raw_df["Chance of Admit"] >= self.target_threshold, 1, 0)
        
        self.X_train_raw, self.X_test_raw, self.y_train, self.y_test = train_test_split(
            X_raw, y_raw, test_size=0.2, random_state=42, stratify=y_raw
        )
        
        self.scaler = StandardScaler()
        self.numeric_features = ["GRE Score", "TOEFL Score", "CGPA"]
        self.scaler.fit(self.X_train_raw[self.numeric_features])
        
        self.X_train_scaled = self.scale_dataframe(self.X_train_raw)
        self.X_test_scaled = self.scale_dataframe(self.X_test_raw)
        
        self.processed_df = self.X_train_raw.copy()
        self.processed_df[self.target_col] = self.y_train
        
        self.model, self.metrics = self.train_and_serialize_model()

    def scale_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        df_scaled = df.copy()
        df_scaled[self.numeric_features] = self.scaler.transform(df[self.numeric_features])
        return df_scaled

    def train_and_serialize_model(self):
        clf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(clf, self.X_train_scaled, self.y_train, cv=cv, scoring='accuracy')
        clf.fit(self.X_train_scaled, self.y_train)
        
        # Correctly serialize elements to models directory using joblib
        joblib.dump(clf, os.path.join(self.model_dir, "rf_admissions_model.joblib"))
        joblib.dump(self.scaler, os.path.join(self.model_dir, "robust_scaler.joblib"))
        
        metrics = {
            "cv_accuracy_mean": cv_scores.mean(),
            "cv_accuracy_std": cv_scores.std(),
            "train_accuracy": accuracy_score(self.y_train, clf.predict(self.X_train_scaled)),
            "test_accuracy": accuracy_score(self.y_test, clf.predict(self.X_test_scaled)),
            "roc_auc": roc_auc_score(self.y_test, clf.predict_proba(self.X_test_scaled)[:, 1])
        }
        return clf, metrics

class DiCEModelWrapper:
    def __init__(self, model, registry):
        self.model = model
        self.registry = registry

    def predict_proba(self, instances):
        if not isinstance(instances, pd.DataFrame):
            instances = pd.DataFrame(instances, columns=self.registry.feature_cols)
        scaled = self.registry.scale_dataframe(instances)
        return self.model.predict_proba(scaled)

class BaselineExplainerEngine:
    """Configures DiCE natively with strict parameter limits, stepping, and category checks."""
    def __init__(self, registry: InstitutionalModelRegistry):
        self.registry = registry
        continuous = ["GRE Score", "TOEFL Score", "CGPA"]
        
        self.d = dice_ml.Data(
            dataframe=self.registry.processed_df, 
            continuous_features=continuous, 
            outcome_name=self.registry.target_col
        )
        wrapper = DiCEModelWrapper(self.registry.model, self.registry)
        self.m = dice_ml.Model(model=wrapper, backend="sklearn")
        self.exp = dice_ml.Dice(self.d, self.m, method="genetic")