import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ArrowRight, UserCheck, ShieldAlert, Mail } from 'lucide-react';
import { mockApplicants } from '../mockData';

export default function DemoFlow({ onComplete }) {
  const [step, setStep] = useState(0);

  const demoSteps = [
    {
      title: "Step 1: Identify Borderline Candidates",
      desc: "DecisionLens automatically flags candidates who were rejected but have mathematically viable paths to admission.",
      icon: ShieldAlert,
      content: (
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-primary text-lg">Elena Rodriguez</p>
              <p className="text-sm text-secondary">APP-4402 • MS Computer Science</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-bold">REJECTED</span>
          </div>
          <p className="text-sm text-secondary border-l-2 border-warning pl-3 py-1 mb-4">
            System Flag: This candidate's GPA (6.8) falls below the hard policy cutoff (7.5).
          </p>
        </div>
      )
    },
    {
      title: "Step 2: Causal Recourse Analysis",
      desc: "The system pings the backend causal engine to calculate the minimum structural changes required to flip the decision.",
      icon: UserCheck,
      content: (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center p-3 border border-border rounded-lg bg-background">
            <span className="text-sm font-medium text-primary">Target: TOEFL Score</span>
            <span className="text-sm font-bold text-accent">95 → 106</span>
          </div>
          <div className="flex justify-between items-center p-3 border border-border rounded-lg bg-gray-50 opacity-50">
            <span className="text-sm font-medium text-secondary">Target: Undergraduate GPA</span>
            <span className="text-xs font-bold text-gray-400 uppercase">Locked by Friction</span>
          </div>
          <p className="text-xs text-secondary mt-2 text-center">
            DecisionLens prevents suggesting impossible changes like rewriting history.
          </p>
        </div>
      )
    },
    {
      title: "Step 3: Generate Friction-Aware Communications",
      desc: "Instead of a generic rejection, generate an AI draft that tells the applicant exactly what they need to improve for next cycle.",
      icon: Mail,
      content: (
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="bg-gray-50 border border-border rounded-lg p-4 font-mono text-xs text-primary leading-relaxed h-64 overflow-y-auto">
            <span className="text-secondary">To:</span> elena.rodriguez@applicant.edu<br/>
            <span className="text-secondary">Subject:</span> Update on your MS CS Application<br/>
            <br/>
            Dear Elena,<br/><br/>
            Thank you for applying. We appreciate the time you took to share your background with us.<br/><br/>
            Your application ranked 1105 / 1248 (Bottom 11%), but our strict cohort cutoff fell at the Top 18%.<br/><br/>
            Our admissions committee heavily values a strong quantitative foundation paired with rigorous academic preparation to ensure all admitted students can thrive in our demanding curriculum. After careful review, we regret to inform you that we cannot offer you admission at this time.<br/><br/>
            <span className="bg-accent/20 text-accent font-bold px-1 rounded">To help you prepare for a future application, we want to provide actionable feedback. Based on our cohort analysis, focusing your efforts on improving your TOEFL from 95 to our target benchmark of 106 will give you the strongest chance of a successful outcome next cycle.</span><br/><br/>
            <span className="text-gray-500 italic">We know that some aspects of your background, such as your Undergraduate GPA, cannot easily be changed—since time constraints or graduation status make altering past experiences impossible. Therefore, we do not expect you to change these locked parameters; we encourage you to focus entirely on the actionable, forward-looking goals outlined above.</span><br/><br/>
            <span className="text-xs text-secondary">*Please note that admission is highly competitive and dependent on the applicant pool each year. While meeting these benchmarks strengthens your profile, it does not guarantee future admission if next year's cohort is exceptionally competitive.*</span><br/><br/>
            <a href="#" className="text-accent underline font-semibold cursor-pointer">[ View Typical Successful Applicant Profile & Deeper Explanations ]</a><br/><br/>
            Sincerely,<br/>
            Admissions Committee
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary tracking-tight mb-3">Live Demo: End-to-End Workflow</h2>
        <p className="text-secondary">Experience how DecisionLens transforms institutional reviews from a black box into a transparent, actionable pipeline.</p>
      </div>

      <div className="w-full relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mr-4">
                  {React.createElement(demoSteps[step].icon, { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{demoSteps[step].title}</h3>
                  <p className="text-sm text-secondary">{demoSteps[step].desc}</p>
                </div>
              </div>
              
              <div className="flex-1">
                {demoSteps[step].content}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full mt-12 flex justify-between items-center border-t border-border pt-6">
        <div className="flex space-x-2">
          {demoSteps.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === step ? 'bg-accent' : 'bg-gray-200'}`} />
          ))}
        </div>
        
        <div className="flex space-x-3">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-100 rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          {step < demoSteps.length - 1 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="flex items-center px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button 
              onClick={onComplete}
              className="flex items-center px-6 py-2 bg-success text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-md"
            >
              Finish Demo <UserCheck className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
