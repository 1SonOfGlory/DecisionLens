import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, TrendingDown, Users, Activity } from 'lucide-react';

export default function FairnessDashboard() {
  const flags = [
    { id: 1, severity: 'high', title: 'Tier 3 University Lockout', desc: 'Candidates from Tier 3 institutions require computationally infeasible test scores to achieve valid recourse.', program: 'MS Computer Science' },
    { id: 2, severity: 'medium', title: 'GPA Floor Sensitivity', desc: 'Slight shifts in the holistic assumption graph disproportionately affect candidates with GPA below 7.0.', program: 'Global' },
    { id: 3, severity: 'low', title: 'Research Experience Deficit', desc: 'Recourse actions frequently ask for impossible increases in research experience for recent graduates.', program: 'PhD Machine Learning' },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">Fairness & Causal Risk</h2>
        <p className="text-sm text-secondary mt-1">Audit institutional models for structural bias and feasibility lockouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Global Lockout Rate</span>
            <ShieldAlert className="w-5 h-5 text-error" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-primary">31.4%</span>
            <span className="text-sm font-medium text-error flex items-center"><TrendingDown className="w-3 h-3 mr-1" /> 2.1%</span>
          </div>
          <p className="text-xs text-secondary mt-2">Rejected candidates with mathematically impossible recourse paths.</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Average Friction Burden</span>
            <Activity className="w-5 h-5 text-warning" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-primary">High</span>
          </div>
          <p className="text-xs text-secondary mt-2">Recourse recommendations heavily depend on immutable attributes.</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Graph Stability</span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-primary">88%</span>
          </div>
          <p className="text-xs text-secondary mt-2">Recourse validity remains stable across different causal assumptions.</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-primary mt-4">Active Structural Flags</h3>
      <div className="space-y-4">
        {flags.map((flag, i) => (
          <motion.div 
            key={flag.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl border ${
              flag.severity === 'high' ? 'bg-red-50/50 border-red-200' :
              flag.severity === 'medium' ? 'bg-yellow-50/50 border-yellow-200' :
              'bg-blue-50/50 border-blue-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${
                  flag.severity === 'high' ? 'text-error' :
                  flag.severity === 'medium' ? 'text-warning' :
                  'text-blue-500'
                }`} />
                <div>
                  <h4 className="font-bold text-primary">{flag.title}</h4>
                  <p className="text-sm text-secondary mt-1">{flag.desc}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-background border border-border text-secondary shadow-sm">
                {flag.program}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
