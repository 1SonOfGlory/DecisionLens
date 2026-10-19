import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Activity, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import Tooltip from './Tooltip';

export default function FeasibleRecoursePathways({ candidateProfile, selectedGraph, recourseResults, setRecourseResults }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [animatedScore, setAnimatedScore] = useState(0);

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    
    try {
      const payload = { ...candidateProfile, selected_graph: selectedGraph };
      const evalRes = await axios.post('http://localhost:8000/api/v1/evaluate-pathway', payload);
      setRecourseResults(evalRes.data);
      setResults(evalRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "A critical API error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results && results.causal_score) {
      const targetScore = Math.round(results.causal_score * 100);
      let currentScore = 0;
      const interval = setInterval(() => {
        currentScore += 2;
        if (currentScore >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(interval);
        } else {
          setAnimatedScore(currentScore);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [results]);

  const getFeasibleActions = () => {
    if (!results) return { changed: [], locked: [] };
    const { current, causal_target } = results.matrices;
    const changed = [];
    const locked = [];
    Object.keys(current).forEach(key => {
      const diff = causal_target[key] - current[key];
      if (Math.abs(diff) > 0.01) {
        changed.push({ key, diff: diff.toFixed(2), from: current[key].toFixed(2), to: causal_target[key].toFixed(2) });
      } else {
        locked.push(key);
      }
    });
    return { changed, locked };
  };

  const { changed, locked } = getFeasibleActions();
  const isValid = results?.causal_validity === "VALID";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }
    })
  };

  return (
    <div className="bg-surface rounded-[24px] p-6 sm:p-8 shadow-soft border border-border/50 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-semibold text-primary tracking-tight">Feasible Recourse Pathways</h2>
          <p className="text-sm text-secondary mt-1">Identify actionable improvements for rejected applicants</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className={`flex items-center px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-md ${
            loading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-accent text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Selected Applicant
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-error rounded-xl border border-red-100 text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex-grow relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {!results && !loading && !error && (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-grow flex flex-col items-center justify-center text-center max-w-sm mx-auto mt-10"
            >
              <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mb-6">
                <Activity className="w-10 h-10 text-accent/40" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Ready to evaluate</h3>
              <p className="text-sm text-secondary leading-relaxed">
                We will estimate the admission outcome, feasible actions, and causal recourse validity based on your profile and assumptions.
              </p>
            </motion.div>
          )}

          {results && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="bg-background border border-border p-5 rounded-2xl flex flex-col justify-center">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center">
                    Admission Probability <Tooltip text="The estimated likelihood of being admitted based on your current profile. Usually needs to be > 75% to trigger a VALID decision." />
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-bold text-primary">{animatedScore}</span>
                    <span className="text-xl font-medium text-secondary">%</span>
                  </div>
                </motion.div>
                
                <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className={`border p-5 rounded-2xl flex flex-col justify-center ${isValid ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 flex items-center">
                    Decision Outcome <Tooltip text="Whether the model predicts an admission (VALID) or rejection (INVALID) based on the chosen causal assumptions." />
                  </span>
                  <div className="flex items-center">
                    {isValid ? <CheckCircle2 className="w-6 h-6 text-success mr-2" /> : <ShieldAlert className="w-6 h-6 text-error mr-2" />}
                    <span className={`text-2xl font-bold tracking-tight ${isValid ? 'text-success' : 'text-error'}`}>
                      {results.causal_validity.replace(/_/g, ' ')}
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bg-background border border-border p-5 rounded-2xl">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4 flex items-center">
                    Best Feasible Action <Tooltip text="Candidate changes found by the model under the selected assumptions. They do not guarantee admission." />
                  </span>
                  {changed.length > 0 ? (
                    <div className="space-y-3">
                      {changed.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border/50">
                          <span className="text-sm font-medium text-primary">{c.key}</span>
                          <div className="flex items-center text-sm font-semibold">
                            <span className="text-secondary">{c.from}</span>
                            <ArrowRight className="w-3 h-3 mx-2 text-accent" />
                            <span className="text-accent">{c.to}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary italic">No viable actions found under current friction.</p>
                  )}
                </motion.div>

                <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="bg-background border border-border p-5 rounded-2xl">
                  <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4 flex items-center">
                    Actions Locked by Friction <Tooltip text="Things the AI recognizes you cannot easily change, such as your past GPA or the Tier of your University." />
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {locked.map(l => (
                      <span key={l} className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-medium text-secondary">
                        {l}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="bg-background border border-border p-5 rounded-2xl">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3 block">What This Means</span>
                <p className="text-sm text-primary leading-relaxed" dangerouslySetInnerHTML={{ __html: results.narrative_report.replace(/\n/g, '<br/>') }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}
