import os
from dotenv import load_dotenv
from groq import Groq
from google import genai
from google.genai import types

load_dotenv()

class RecourseNarrativeTranslator:
    """
    Handles LLM-assisted narrative drafting and critique workflows.
    Reframed to support applicant action pathways and mitigate legal profiling risk.
    """
    def __init__(self):
        # Secure instantiation via environmental configuration variables
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def generate_applicant_pathway_report(self, status: str, score: float, metrics_context: str) -> str:
        """Drafts an applicant-centric feasibility narrative report."""
        prompt = f"""
        Role: Lead Applicant Action Pathway Advisor.
        Task: Translate backend institutional decision tracking logs into a clear, supportive action trajectory report.
        
        [CONTEXT]
        - Current Track State: {status}
        - Base Path Fit Score: {score:.2%}
        - Metric Constraints Context: {metrics_context}
        
        Instructions:
        1. Emphasize applicant action pathways and clear alternatives.
        2. If structural lockout is reached, define it clearly as a state where no feasible action path exists under current institutional configurations.
        3. Maintain an honest, realistic tone without artificial marketing language or buzzwords.
        """
        
        # Agent 1 Draft Pass
        completion = self.groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        draft = completion.choices[0].message.content.strip()
        
        # Agent 2 Evaluation Pass
        critique_prompt = f"""
        Review this applicant trajectory advisory draft. Remove any institutional corporate-speak, sanitize formatting for raw plain-text layout delivery, and guarantee no misleading guidance or false expectations are set:
        
        "{draft}"
        """
        response = self.gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=critique_prompt
        )
        return response.text.strip()