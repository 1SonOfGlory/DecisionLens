import React from 'react';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, MessageSquare, Settings, Bell, Search, LogOut, PlayCircle } from 'lucide-react';

export default function Layout({ children, onLogout, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Users },
    { id: 'applicants', label: 'Applicants', icon: UserCheck },
    { id: 'fairness', label: 'Fairness & Risk', icon: ShieldAlert },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary tracking-tight">DecisionLens</h1>
          <p className="text-xs text-secondary mt-1 font-medium">Institutional Intelligence</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-secondary hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-accent' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setActiveTab('demo')}
            className="w-full flex items-center justify-center px-3 py-2 mb-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Interactive Demo
          </button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
              DR
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary">Dr. Reviewer</p>
              <p className="text-xs text-secondary">Admissions Chair</p>
            </div>
          </div>
          <button onClick={onLogout} className="mt-4 w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-secondary hover:text-error transition-colors rounded-md hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8">
          <div className="flex items-center w-96 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Search applicants, ID, or metrics..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
              Fall 2027 Cycle
            </span>
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
