import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

export default function CausalModelSensitivity({ selectedGraph, setSelectedGraph }) {
  
  const graphs = [
    { id: "Graph_A_Standard", label: "Standard Graph", desc: "Balanced structural assumptions" },
    { id: "Graph_B_Holistic_Dominance", label: "Holistic Review Graph", desc: "Prioritizes SOP & Recommendations" }
  ];

  const renderVisualGraph = () => {
    // A simplified visual abstraction of the DAG
    const nodes = [
      { id: 'GRE', x: 20, y: 20 },
      { id: 'TOEFL', x: 20, y: 80 },
      { id: 'GPA', x: 80, y: 20 },
      { id: 'Tier', x: 80, y: 80 },
      { id: 'SOP', x: 140, y: 20 },
      { id: 'LOR', x: 140, y: 80 },
      { id: 'Research', x: 200, y: 50 },
      { id: 'Admit', x: 260, y: 50, highlight: true }
    ];

    const edges = selectedGraph === "Graph_A_Standard" 
      ? [
          { from: 'GRE', to: 'GPA' }, { from: 'TOEFL', to: 'GPA' },
          { from: 'GRE', to: 'Tier' }, { from: 'TOEFL', to: 'Tier' },
          { from: 'SOP', to: 'Research' }, { from: 'LOR', to: 'Research' },
          { from: 'GPA', to: 'Admit' }, { from: 'Research', to: 'Admit' }
        ]
      : [
          { from: 'SOP', to: 'GPA' }, { from: 'LOR', to: 'GPA' },
          { from: 'SOP', to: 'Tier' }, { from: 'LOR', to: 'Tier' },
          { from: 'GRE', to: 'Research' },
          { from: 'GPA', to: 'Admit' }, { from: 'Research', to: 'Admit' }
        ];

    return (
      <div className="relative w-full h-32 bg-background/50 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center mt-6">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 100">
          {edges.map((edge, i) => {
            const n1 = nodes.find(n => n.id === edge.from);
            const n2 = nodes.find(n => n.id === edge.to);
            return (
              <motion.line 
                key={`${edge.from}-${edge.to}-${selectedGraph}`}
                x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} 
                stroke="#d1d5db" strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            );
          })}
          {nodes.map(node => (
            <motion.circle
              key={node.id}
              cx={node.x} cy={node.y} r={node.highlight ? "8" : "4"}
              fill={node.highlight ? "#4f46e5" : "#6b7280"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-surface rounded-[24px] p-6 sm:p-8 shadow-soft border border-border/50 transition-all">
      <h2 className="text-xl font-semibold text-primary tracking-tight mb-1 flex items-center">
        Causal Model Sensitivity <Tooltip text="A causal assumption controls how the AI models structural friction. Changing this shifts the recourse feasibility constraints." />
      </h2>
      <p className="text-sm text-secondary mb-6">Observe how recommendations shift under different causal frameworks.</p>
      
      <div className="space-y-3">
        {graphs.map(graph => (
          <label 
            key={graph.id}
            className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all border ${
              selectedGraph === graph.id 
                ? 'bg-accent/5 border-accent shadow-sm' 
                : 'bg-background border-border hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <input 
                type="radio" 
                name="causalGraph" 
                value={graph.id}
                checked={selectedGraph === graph.id}
                onChange={() => setSelectedGraph(graph.id)}
                className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
              />
              <div className="ml-3">
                <span className={`block text-sm font-medium ${selectedGraph === graph.id ? 'text-accent' : 'text-primary'}`}>
                  {graph.label}
                </span>
                <span className="block text-xs text-secondary mt-0.5">{graph.desc}</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {renderVisualGraph()}
    </div>
  );
}
