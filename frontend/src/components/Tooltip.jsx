import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function Tooltip({ text }) {
  return (
    <div className="relative group inline-flex items-center ml-2">
      <HelpCircle className="w-4 h-4 text-secondary/50 hover:text-accent cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center shadow-xl">
        {text}
        {/* Little triangle arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
