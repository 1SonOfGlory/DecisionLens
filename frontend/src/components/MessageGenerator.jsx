import React, { useState } from 'react';
import { Bot, RefreshCw, Send, Copy, Check, Mail } from 'lucide-react';

export default function MessageGenerator({ applicant, recourseResults }) {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMessage = () => {
    setGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      if (applicant.status === 'admitted') {
        setMessage(`Dear ${applicant.name},\n\nCongratulations! We are thrilled to offer you admission to the ${applicant.programId === 'prog-1' ? 'MS Computer Science' : 'program'}.\n\nYour profile ranked in the ${applicant.percentile} of our applicant pool. Specifically, your metrics heavily outperformed the median admitted cohort, placing you firmly within the highly competitive bandwidth.\n\nWe look forward to welcoming you.\n\nSincerely,\nThe Admissions Committee`);
      } else {
        const hasRecourse = recourseResults && recourseResults.matrices;
        let rankStr = applicant.rank && applicant.percentile 
          ? `Your application ranked ${applicant.rank} (${applicant.percentile}), but our strict cohort cutoff fell at the Top 18%.\n\n`
          : ``;

        let actionStr = "While your application had strengths, our cohort selection was highly constrained by quantitative baselines.";
        let frictionStr = "";
        
        // Institutional values statement
        const valuesStr = "Our admissions committee heavily values a strong quantitative foundation paired with rigorous academic preparation to ensure all admitted students can thrive in our demanding curriculum.\n\n";

        if (hasRecourse) {
          const { current, causal_target } = recourseResults.matrices;
          const diffs = [];
          
          Object.keys(current).forEach(key => {
            const gap = causal_target[key] - current[key];
            if (gap > 0.01) {
              diffs.push(`improving your ${key} from ${current[key].toFixed(1)} to our target benchmark of ${causal_target[key].toFixed(1)}`);
            }
          });

          if (diffs.length > 0) {
            actionStr = `To help you prepare for a future application, we want to provide actionable feedback. Based on our cohort analysis, focusing your efforts on ${diffs.join(' and ')} will give you the strongest chance of a successful outcome next cycle.`;
          }

          // Generate detailed constraint explanation
          const lockedKeys = Object.keys(current).filter(k => causal_target[k] === current[k]);
          if (lockedKeys.length > 0 && diffs.length > 0) {
            frictionStr = `\n\nWe know that some aspects of your background, such as your ${lockedKeys.slice(0, 2).join(' and ')}, cannot easily be changed—since time constraints or graduation status make altering past experiences impossible. Therefore, we do not expect you to change these locked parameters; we encourage you to focus entirely on the actionable, forward-looking goals outlined above.`;
          }
        }

        const disclaimerStr = `\n\n*Please note that admission is highly competitive and dependent on the applicant pool each year. While meeting these benchmarks strengthens your profile, it does not guarantee future admission if next year's cohort is exceptionally competitive.*`;
        
        const ctaStr = `\n\n[ View Typical Successful Applicant Profile & Deeper Explanations ] ->`;

        setMessage(`Dear ${applicant.name},\n\nThank you for applying to the ${applicant.programId === 'prog-1' ? 'MS Computer Science' : 'program'}. We appreciate the time you took to share your background with us.\n\n${rankStr}${valuesStr}After careful review, we regret to inform you that we cannot offer you admission at this time.\n\n${actionStr}${frictionStr}${disclaimerStr}${ctaStr}\n\nWe wish you the best in your future academic endeavors.\n\nSincerely,\nThe Admissions Committee`);
      }
      setGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-soft mt-6 overflow-hidden flex flex-col">
      {/* Email Header */}
      <div className="bg-gray-50 border-b border-border p-4 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-primary flex items-center">
          <Bot className="w-4 h-4 mr-2 text-accent" /> AI Draft Communicator
        </h3>
        {!message && (
          <button 
            onClick={generateMessage}
            disabled={generating}
            className="flex items-center px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
          >
            {generating ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
            {generating ? 'Drafting...' : 'Generate Draft'}
          </button>
        )}
      </div>

      {/* Email Metadata */}
      {message && (
        <div className="bg-background border-b border-border px-5 py-3 space-y-2 text-sm">
          <div className="flex">
            <span className="w-16 text-secondary font-medium">To:</span>
            <span className="text-primary">{applicant.name} &lt;{applicant.name.toLowerCase().replace(' ', '.')}@applicant.edu&gt;</span>
          </div>
          <div className="flex">
            <span className="w-16 text-secondary font-medium">From:</span>
            <span className="text-primary">Admissions Committee &lt;admissions@university.edu&gt;</span>
          </div>
          <div className="flex">
            <span className="w-16 text-secondary font-medium">Subject:</span>
            <span className="text-primary font-semibold">Update on your application to {applicant.programId === 'prog-1' ? 'MS Computer Science' : 'our program'}</span>
          </div>
        </div>
      )}

      {/* Email Body Area */}
      <div className="p-5 flex-1 bg-background relative min-h-[250px]">
        {!message && !generating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 border-2 border-dashed border-border rounded-xl">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-secondary">Click generate to draft a personalized, friction-aware message.</p>
            </div>
          </div>
        )}

        {generating && (
          <div className="space-y-4">
            <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse mt-4"></div>
            <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse mt-4"></div>
          </div>
        )}

        {message && (
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-full min-h-[200px] bg-transparent border-none resize-none focus:outline-none text-sm text-primary leading-relaxed"
          />
        )}
      </div>

      {/* Email Footer Actions */}
      {message && (
        <div className="bg-gray-50 border-t border-border p-3 flex justify-end space-x-3">
          <button 
            onClick={generateMessage}
            className="flex items-center px-3 py-1.5 text-secondary hover:text-primary hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate
          </button>
          <button 
            onClick={copyToClipboard}
            className="flex items-center px-4 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 rounded-md text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copied ? 'Copied' : 'Copy Draft'}
          </button>
          <button className="flex items-center px-4 py-1.5 bg-accent text-white hover:bg-indigo-700 rounded-md text-xs font-semibold transition-colors shadow-sm">
            <Send className="w-3.5 h-3.5 mr-1.5" /> Send to Applicant
          </button>
        </div>
      )}
    </div>
  );
}
