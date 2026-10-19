import React from 'react';
import { motion } from 'framer-motion';
import { mockPrograms } from '../mockData';
import { Users, FileX, CheckCircle, Clock, BarChart3, Activity } from 'lucide-react';

export default function CohortAnalytics({ programId }) {
  const prog = mockPrograms.find(p => p.id === programId);
  if (!prog) return null;

  const cards = [
    { label: 'Algorithmic Recourse Feasibility', value: `${prog.recourseFeasibility}%`, icon: CheckCircle, color: 'text-success', bg: 'bg-green-50' },
    { label: 'Counterfactual Lockout Rate', value: `${prog.lockoutRate}%`, icon: FileX, color: 'text-error', bg: 'bg-red-50' },
    { label: 'Subpopulation Friction Disparity', value: prog.subpopDisparity, icon: Activity, color: 'text-warning', bg: 'bg-yellow-50' },
    { label: 'Min Actionable Distance', value: prog.minDistance, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="h-full flex flex-col space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary tracking-tight">{prog.name} Analytics</h2>
        <p className="text-sm text-secondary mt-1">Institutional overview and cohort health metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface p-5 rounded-2xl border border-border/50 shadow-soft"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-secondary">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-surface p-6 rounded-2xl border border-border/50 shadow-soft"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-primary">Admissions Funnel</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          {/* Mock visual representation of a funnel/chart */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Total Applications</span>
                <span>{prog.applicants}</span>
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="absolute inset-y-0 left-0 bg-gray-300"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Reviewed</span>
                <span>{Math.floor(prog.applicants * (prog.reviewedPercent / 100))}</span>
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${prog.reviewedPercent}%` }} transition={{ duration: 1, delay: 0.2 }} className="absolute inset-y-0 left-0 bg-blue-400"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Feasible Recourse Identified</span>
                <span>{Math.floor(prog.applicants * (prog.recourseFeasibility / 100))}</span>
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${prog.recourseFeasibility}%` }} transition={{ duration: 1, delay: 0.4 }} className="absolute inset-y-0 left-0 bg-accent"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-secondary mb-1">
                <span>Admitted</span>
                <span>{Math.floor(prog.applicants * (prog.stats.admitted / 100))}</span>
              </div>
              <div className="w-full h-8 bg-gray-100 rounded-md overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${prog.stats.admitted}%` }} transition={{ duration: 1, delay: 0.6 }} className="absolute inset-y-0 left-0 bg-success"></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-surface p-6 rounded-2xl border border-border/50 shadow-soft"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-primary">Fairness & Causal Risk</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl bg-background">
            <p className="text-sm text-secondary max-w-xs text-center">
              Risk metrics indicate {prog.riskMessage.toLowerCase()}. Structural lockout rate is heavily influenced by non-actionable traits.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
             <div className="p-4 bg-background border border-border rounded-xl">
               <span className="text-xs text-secondary uppercase tracking-wider">Model Drift Confidence</span>
               <p className="text-2xl font-bold text-primary mt-1">{prog.avgConfidence}%</p>
             </div>
             <div className="p-4 bg-background border border-border rounded-xl">
               <span className="text-xs text-secondary uppercase tracking-wider">Immutable Trait Dependency</span>
               <p className="text-2xl font-bold text-primary mt-1">{(100 - prog.recourseFeasibility).toFixed(1)}%</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
