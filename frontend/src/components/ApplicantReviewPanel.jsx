import React from 'react';
import Tooltip from './Tooltip';

export default function ApplicantReviewPanel({ profile, setProfile }) {
  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const getProfileStrength = () => {
    // A simplified visual heuristic for live profile strength feedback (0-100)
    let score = 0;
    score += ((profile.gre - 260) / 80) * 30;
    score += ((profile.toefl - 80) / 40) * 20;
    score += (profile.cgpa / 10) * 30;
    score += (profile.sop / 5) * 5;
    score += (profile.lor / 5) * 5;
    score += profile.research * 10;
    return Math.min(100, Math.max(0, score));
  };

  const strength = getProfileStrength();

  return (
    <div className="bg-surface rounded-[24px] p-6 sm:p-8 shadow-soft border border-border/50 transition-all">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-primary tracking-tight">Applicant Review Panel</h2>
          <p className="text-sm text-secondary mt-1">Simulate changes to applicant metrics</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-secondary uppercase tracking-wider mb-1">Live Strength</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300" 
                style={{ width: `${strength}%` }}
              />
            </div>
            <span className="text-sm font-bold text-primary">{strength.toFixed(0)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-primary flex items-center">
              GRE Score <Tooltip text="Graduate Record Examination score out of 340. A major quantitative baseline." />
            </label>
            <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">{profile.gre}</span>
          </div>
          <input 
            type="range" min="260" max="340" step="1" 
            value={profile.gre} onChange={(e) => handleChange('gre', e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-primary flex items-center">
              TOEFL Score <Tooltip text="English proficiency score out of 120. Often acts as a hard filter." />
            </label>
            <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">{profile.toefl}</span>
          </div>
          <input 
            type="range" min="80" max="120" step="1" 
            value={profile.toefl} onChange={(e) => handleChange('toefl', e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-primary flex items-center">
              GPA <Tooltip text="Cumulative Grade Point Average scaled out of 10.0." />
            </label>
            <span className="text-sm font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-md">{profile.cgpa.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="5.0" max="10.0" step="0.01" 
            value={profile.cgpa} onChange={(e) => handleChange('cgpa', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-primary flex items-center">
                Statement Quality <Tooltip text="Strength of your Statement of Purpose (SOP) on a 1-5 subjective scale." />
              </label>
              <span className="text-sm font-semibold text-accent">{profile.sop.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1.0" max="5.0" step="0.5" 
              value={profile.sop} onChange={(e) => handleChange('sop', e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-primary flex items-center">
                Recommendation <Tooltip text="Strength of your Letters of Recommendation (LOR) on a 1-5 subjective scale." />
              </label>
              <span className="text-sm font-semibold text-accent">{profile.lor.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="1.0" max="5.0" step="0.5" 
              value={profile.lor} onChange={(e) => handleChange('lor', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-primary mb-3 flex items-center">
            University Tier <Tooltip text="Tier of the target university. T1 represents elite top-tier schools; T5 represents average institutions." />
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(tier => (
              <button
                key={tier}
                onClick={() => handleChange('univ_rating', tier)}
                className={`py-2 text-sm font-medium rounded-lg transition-all ${
                  profile.univ_rating === tier 
                    ? 'bg-accent text-white shadow-md' 
                    : 'bg-background border border-border text-secondary hover:border-accent hover:text-accent'
                }`}
              >
                T{tier}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-primary mb-3 flex items-center">
            Research Experience <Tooltip text="Do you have verifiable, published research experience? This significantly lowers the barrier for elite tiers." />
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => handleChange('research', 0)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                profile.research === 0 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-background border border-border text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              None
            </button>
            <button
              onClick={() => handleChange('research', 1)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                profile.research === 1 
                  ? 'bg-accent text-white shadow-md' 
                  : 'bg-background border border-border text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              Verified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
