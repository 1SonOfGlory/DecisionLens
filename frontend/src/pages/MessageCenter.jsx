import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Clock, Search, MoreVertical, X, TrendingDown, Target } from 'lucide-react';
import { mockApplicants } from '../mockData';

export default function MessageCenter() {
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  // We map the mock applicants to "messages" so we have full context.
  // We'll just take the first 3 for the demo.
  const messages = mockApplicants.slice(0, 3).map((app, index) => {
    let status = index === 0 ? 'pending' : index === 1 ? 'approved' : 'sent';
    let date = index === 0 ? '2 hours ago' : index === 1 ? '5 hours ago' : '1 day ago';
    let preview = app.status === 'admitted' 
      ? `Dear ${app.name.split(' ')[0]}, Congratulations on your admission...`
      : `Dear ${app.name.split(' ')[0]}, Thank you for applying. Your application ranked ${app.rank}...`;

    let actionStr = "While your application had strengths, our cohort selection was highly constrained by quantitative baselines.";
    let frictionStr = "";

    const valuesStr = "Our admissions committee heavily values a strong quantitative foundation paired with rigorous academic preparation to ensure all admitted students can thrive in our demanding curriculum.\n\n";

    if (app.status !== 'admitted') {
      actionStr = `To help you prepare for a future application, we want to provide actionable feedback. Based on our cohort analysis, focusing your efforts on improving your ${app.frictionPoints[0]} to our target benchmark of ${app.frictionPoints[0] === 'GRE Quantitative' ? '325' : '105'} will give you the strongest chance of a successful outcome next cycle.`;
      
      if (app.frictionPoints.length > 1) {
        frictionStr = `\n\nWe know that some aspects of your background, such as your ${app.frictionPoints.slice(1).join(' and ')}, cannot easily be changed—since time constraints or graduation status make altering past experiences impossible. Therefore, we do not expect you to change these locked parameters; we encourage you to focus entirely on the actionable, forward-looking goals outlined above.`;
      } else {
        frictionStr = `\n\nWe know that some aspects of your background, such as your Undergraduate GPA, cannot easily be changed—since time constraints or graduation status make altering past experiences impossible. Therefore, we do not expect you to change these locked parameters; we encourage you to focus entirely on the actionable, forward-looking goals outlined above.`;
      }
    }

    const disclaimerStr = `\n\n*Please note that admission is highly competitive and dependent on the applicant pool each year. While meeting these benchmarks strengthens your profile, it does not guarantee future admission if next year's cohort is exceptionally competitive.*`;
    const ctaStr = `\n\n[ View Typical Successful Applicant Profile & Deeper Explanations ] ->`;

    let fullEmail = app.status === 'admitted'
      ? `Dear ${app.name},\n\nCongratulations! We are thrilled to offer you admission.\n\nYour profile ranked in the ${app.percentile} of our applicant pool. Specifically, your metrics heavily outperformed the median admitted cohort, placing you firmly within the highly competitive bandwidth.\n\nWe look forward to welcoming you.\n\nSincerely,\nThe Admissions Committee`
      : `Dear ${app.name},\n\nThank you for applying. We appreciate the time you took to share your background with us.\n\nYour application ranked ${app.rank} (${app.percentile}), but our strict cohort cutoff fell at the Top 18%.\n\n${valuesStr}After careful review, we regret to inform you that we cannot offer you admission at this time.\n\n${actionStr}${frictionStr}${disclaimerStr}${ctaStr}\n\nWe wish you the best in your future academic endeavors.\n\nSincerely,\nThe Admissions Committee`;

    return {
      id: `msg-${index}`,
      applicant: app,
      status,
      date,
      preview,
      fullEmail
    };
  });

  const selectedMsg = messages.find(m => m.id === selectedMsgId);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Message Center</h2>
          <p className="text-sm text-secondary mt-1">Review and dispatch AI-assisted candidate communications.</p>
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      <div className="flex space-x-6 border-b border-border pb-2 shrink-0">
        <button className="text-sm font-semibold text-accent border-b-2 border-accent pb-2">Pending Review (1)</button>
        <button className="text-sm font-medium text-secondary hover:text-primary pb-2">Approved (1)</button>
        <button className="text-sm font-medium text-secondary hover:text-primary pb-2">Sent (1)</button>
      </div>

      <div className="flex-1 flex overflow-hidden space-x-6 relative">
        {/* List View */}
        <div className={`flex-col space-y-4 overflow-y-auto w-full transition-all duration-300 ${selectedMsgId ? 'lg:w-1/3 pr-2 hidden lg:flex' : 'w-full'}`}>
          {messages.map((msg, i) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedMsgId(msg.id)}
              className={`bg-surface p-5 rounded-2xl border shadow-soft flex items-start group hover:border-accent/30 transition-colors cursor-pointer ${selectedMsgId === msg.id ? 'border-accent ring-1 ring-accent/20' : 'border-border'}`}
            >
              <div className={`p-3 rounded-xl mr-4 shrink-0 ${
                msg.status === 'pending' ? 'bg-yellow-50 text-warning' :
                msg.status === 'approved' ? 'bg-blue-50 text-blue-500' :
                'bg-green-50 text-success'
              }`}>
                {msg.status === 'pending' && <Clock className="w-5 h-5" />}
                {msg.status === 'approved' && <Mail className="w-5 h-5" />}
                {msg.status === 'sent' && <Check className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-primary truncate">{msg.applicant.name}</h4>
                  <span className="text-xs text-secondary shrink-0 ml-2">{msg.date}</span>
                </div>
                <p className="text-xs font-semibold text-secondary mb-2 truncate">
                  {msg.applicant.programId === 'prog-1' ? 'MS CS' : 'MBA'} • {msg.status.toUpperCase()}
                </p>
                <p className="text-sm text-secondary line-clamp-2">{msg.preview}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail View */}
        <AnimatePresence>
          {selectedMsg && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 lg:relative lg:flex-1 bg-surface border border-border rounded-2xl shadow-soft flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-gray-50 shrink-0">
                <div className="flex items-center space-x-3">
                  <button onClick={() => setSelectedMsgId(null)} className="lg:hidden p-1.5 text-secondary hover:bg-gray-200 rounded-md">
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-semibold text-primary flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-accent" /> AI Draft Review
                  </h3>
                </div>
                <div className="flex space-x-2">
                  {selectedMsg.status === 'pending' && (
                    <>
                      <button className="px-3 py-1.5 bg-background border border-border text-secondary rounded-md text-xs font-medium hover:bg-gray-100">Edit</button>
                      <button className="px-3 py-1.5 bg-accent text-white rounded-md text-xs font-medium hover:bg-indigo-700">Approve & Send</button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Advanced Context Panel */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 border-r border-indigo-100/50 pr-4">
                    <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block mb-1">Applicant Context</span>
                    <p className="font-medium text-primary text-sm mb-1">{selectedMsg.applicant.programId === 'prog-1' ? 'MS Computer Science' : 'MBA'}</p>
                    <p className="text-xs text-secondary">ID: {selectedMsg.applicant.id}</p>
                  </div>
                  <div className="flex-1 border-r border-indigo-100/50 pr-4">
                    <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block mb-1 flex items-center"><Target className="w-3 h-3 mr-1"/> Cohort Rank</span>
                    <p className="font-bold text-primary text-sm mb-1">{selectedMsg.applicant.rank}</p>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs font-bold">{selectedMsg.applicant.percentile}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider block mb-1 flex items-center"><TrendingDown className="w-3 h-3 mr-1"/> Primary Friction</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMsg.applicant.frictionPoints.map(fp => (
                        <span key={fp} className="px-2 py-0.5 bg-red-50 border border-red-100 text-red-700 rounded text-xs font-medium">{fp}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 border-b border-border px-4 py-3 space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-16 text-secondary font-medium">To:</span>
                      <span className="text-primary">{selectedMsg.applicant.name} &lt;{selectedMsg.applicant.name.toLowerCase().replace(' ', '.')}@applicant.edu&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-16 text-secondary font-medium">From:</span>
                      <span className="text-primary">Admissions Committee &lt;admissions@university.edu&gt;</span>
                    </div>
                    <div className="flex">
                      <span className="w-16 text-secondary font-medium">Subject:</span>
                      <span className="text-primary font-semibold">Update on your application</span>
                    </div>
                  </div>
                  <div className="p-5 bg-background min-h-[300px]">
                    <p className="text-sm text-primary whitespace-pre-wrap leading-relaxed">
                      {selectedMsg.fullEmail}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
