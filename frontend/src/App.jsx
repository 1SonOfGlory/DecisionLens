import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import ProgramSelection from './pages/ProgramSelection';
import CohortAnalytics from './pages/CohortAnalytics';
import ApplicantTable from './pages/ApplicantTable';
import ApplicantReviewPanel from './components/ApplicantReviewPanel';
import CausalModelSensitivity from './components/CausalModelSensitivity';
import FeasibleRecoursePathways from './components/FeasibleRecoursePathways';
import MessageGenerator from './components/MessageGenerator';
import GlobalApplicants from './pages/GlobalApplicants';
import FairnessDashboard from './pages/FairnessDashboard';
import MessageCenter from './pages/MessageCenter';
import Settings from './pages/Settings';
import DemoFlow from './pages/DemoFlow';
import { ChevronLeft } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('programs');
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  // State for the individual review panel
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState("Graph_A_Standard");
  const [recourseResults, setRecourseResults] = useState(null);

  useEffect(() => {
    if (selectedApplicant) {
      setCandidateProfile(selectedApplicant.profile);
      setRecourseResults(null);
    }
  }, [selectedApplicant]);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleSelectProgram = (id) => {
    setSelectedProgramId(id);
    setActiveTab('cohort');
    setSelectedApplicant(null);
  };

  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
    setActiveTab('review');
  };

  const handleBackToCohort = () => {
    setSelectedApplicant(null);
    setActiveTab('cohort');
  };

  const renderContent = () => {
    if (activeTab === 'programs' || !selectedProgramId) {
      return <ProgramSelection onSelectProgram={handleSelectProgram} />;
    }

    if (activeTab === 'demo') {
      return <DemoFlow onComplete={() => setActiveTab('programs')} />;
    }

    if (activeTab === 'applicants') {
      return <GlobalApplicants />;
    }

    if (activeTab === 'fairness') {
      return <FairnessDashboard />;
    }

    if (activeTab === 'messages') {
      return <MessageCenter />;
    }

    if (activeTab === 'settings') {
      return <Settings />;
    }

    if (activeTab === 'cohort' && selectedProgramId) {
      return (
        <div className="space-y-8">
          <div className="flex items-center space-x-2 text-sm mb-4">
            <button onClick={() => { setActiveTab('programs'); setSelectedProgramId(null); }} className="text-secondary hover:text-accent font-medium">All Programs</button>
            <span className="text-border">/</span>
            <span className="text-primary font-medium">Cohort View</span>
          </div>
          <CohortAnalytics programId={selectedProgramId} />
          <ApplicantTable programId={selectedProgramId} onSelectApplicant={handleSelectApplicant} />
        </div>
      );
    }

    if (activeTab === 'review' && selectedApplicant && candidateProfile) {
      return (
        <div className="space-y-6">
          <button 
            onClick={handleBackToCohort}
            className="flex items-center text-sm font-medium text-secondary hover:text-accent transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Cohort
          </button>
          
          <div className="flex justify-between items-end border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary tracking-tight">{selectedApplicant.name}</h2>
              <p className="text-sm text-secondary font-mono">{selectedApplicant.id} • {selectedApplicant.status.toUpperCase()}</p>
            </div>
            {selectedApplicant.status !== 'admitted' && (
              <div className="text-right">
                <span className="text-xs font-semibold text-error uppercase tracking-wider block">Primary Rejection Factor</span>
                <span className="text-sm font-medium text-primary">{selectedApplicant.rejectionReason}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 space-y-6">
              <ApplicantReviewPanel 
                profile={candidateProfile} 
                setProfile={setCandidateProfile} 
              />
              <CausalModelSensitivity 
                selectedGraph={selectedGraph} 
                setSelectedGraph={setSelectedGraph}
              />
            </div>
            
            <div className="xl:col-span-8 flex flex-col space-y-6">
              <FeasibleRecoursePathways 
                candidateProfile={candidateProfile}
                selectedGraph={selectedGraph}
                recourseResults={recourseResults}
                setRecourseResults={setRecourseResults}
              />
              <MessageGenerator 
                applicant={selectedApplicant}
                recourseResults={recourseResults}
              />
            </div>
          </div>
        </div>
      );
    }

    // Fallback just in case
    return <ProgramSelection onSelectProgram={handleSelectProgram} />;
  };

  return (
    <Layout 
      onLogout={() => { setIsAuthenticated(false); setActiveTab('programs'); setSelectedProgramId(null); setSelectedApplicant(null); }}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
}
