import React from 'react';
import { motion } from 'framer-motion';
import { mockPrograms } from '../mockData';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ProgramSelection({ onSelectProgram }) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary tracking-tight">Program Pipelines</h2>
        <p className="text-sm text-secondary mt-1">Select a cohort to view causal analytics and applicant statuses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPrograms.map((prog, i) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelectProgram(prog.id)}
            className="bg-surface rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-md hover:border-accent/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{prog.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                prog.riskLevel === 'high' ? 'bg-red-50 text-error' :
                prog.riskLevel === 'medium' ? 'bg-yellow-50 text-warning' :
                'bg-green-50 text-success'
              }`}>
                {prog.riskLevel.toUpperCase()} RISK
              </span>
            </div>
            
            <p className="text-sm text-secondary mb-6 line-clamp-2">{prog.description}</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-secondary mb-1">
                  <span>Applications Reviewed</span>
                  <span>{prog.reviewedPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${prog.reviewedPercent}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <div className="flex items-center text-xs font-medium text-secondary mb-1">
                    <Users className="w-3.5 h-3.5 mr-1" /> Model Drift (Conf)
                  </div>
                  <p className="text-lg font-semibold text-primary">{prog.avgConfidence}%</p>
                </div>
                <div>
                  <div className="flex items-center text-xs font-medium text-secondary mb-1">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> Algorithmic Feasibility
                  </div>
                  <p className="text-lg font-semibold text-primary">{prog.recourseFeasibility}%</p>
                </div>
              </div>

              {prog.riskLevel !== 'low' && (
                <div className="pt-2 flex items-start text-xs text-secondary bg-gray-50 p-2 rounded-lg">
                  <AlertTriangle className={`w-4 h-4 mr-2 flex-shrink-0 ${prog.riskLevel === 'high' ? 'text-error' : 'text-warning'}`} />
                  {prog.riskMessage}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
