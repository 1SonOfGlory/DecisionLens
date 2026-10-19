import React from 'react';
import { Shield, Key, Sliders, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">Institutional Settings</h2>
        <p className="text-sm text-secondary mt-1">Configure causal models, LLM API keys, and team access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2 text-accent" /> API Configurations
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Groq API Key (Llama3)</label>
                <input type="password" value="gsk_********************************" readOnly className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-secondary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Google Gemini API Key</label>
                <input type="password" value="AIzaSy*******************************" readOnly className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm text-secondary" />
              </div>
              <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-secondary hover:bg-gray-50 transition-colors">Update Keys</button>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-accent" /> Causal Thresholds
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary text-sm">Admission Probability Threshold</p>
                  <p className="text-xs text-secondary">Minimum score required for a valid recourse path.</p>
                </div>
                <span className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-bold text-primary">75%</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="font-medium text-primary text-sm">Max Recourse Distance (Cost)</p>
                  <p className="text-xs text-secondary">Reject paths that require extreme, unrealistic changes.</p>
                </div>
                <span className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-bold text-primary">15.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-accent" /> Approved Causal Graphs
            </h3>
            <p className="text-sm text-secondary mb-4">Toggle which structural assumptions reviewers are allowed to use when evaluating applicants.</p>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-accent/30 bg-accent/5 rounded-xl cursor-pointer">
                <input type="checkbox" checked readOnly className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent" />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-primary">Graph A: Standard Assumption</span>
                  <span className="block text-xs text-secondary">Balanced structural review.</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked readOnly className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent" />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-primary">Graph B: Exam-Heavy Bias</span>
                  <span className="block text-xs text-secondary">GRE/TOEFL have direct causal edges to outcome.</span>
                </div>
              </label>
              <label className="flex items-center p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked readOnly className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent" />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-primary">Graph C: Holistic Review</span>
                  <span className="block text-xs text-secondary">SOP/LOR can rescue low quantitative metrics.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
