import React from 'react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-8 border-b border-border bg-background shadow-sm">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-primary">FrontierStratum</h1>
        <p className="text-sm text-secondary font-medium tracking-wide">Digital Griot | Institutional Policy & Decision Engine</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-background font-bold text-sm shadow-md">
          DG
        </div>
      </div>
    </nav>
  );
}
