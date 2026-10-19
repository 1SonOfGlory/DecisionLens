import React from 'react';
import { motion } from 'framer-motion';
import { mockApplicants, mockPrograms } from '../mockData';
import { Search, Filter, Download, MoreHorizontal } from 'lucide-react';

export default function GlobalApplicants() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Global Applicant Pool</h2>
          <p className="text-sm text-secondary mt-1">Cross-program view of all candidates in the current cycle.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by ID, name, or email..." 
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft flex-1">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Candidate</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Program Applied</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Fit Score</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Recourse</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Risk</th>
              <th className="px-6 py-4 text-right font-semibold text-secondary"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {mockApplicants.map((app, i) => {
              const progName = mockPrograms.find(p => p.id === app.programId)?.name || 'Unknown';
              return (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{app.name}</p>
                    <p className="text-xs text-secondary font-mono mt-0.5">{app.id} • {app.lastReviewed}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {progName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                      app.status === 'admitted' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-medium text-primary mr-2">{app.fitScore}</span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden xl:block">
                        <div className="h-full bg-accent" style={{ width: `${app.fitScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                      app.recourseStatus === 'feasible' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                      app.recourseStatus === 'infeasible' ? 'bg-gray-100 border-gray-200 text-gray-600' :
                      app.recourseStatus === 'N/A' ? 'bg-transparent border-transparent text-gray-400' :
                      'bg-orange-50 border-orange-200 text-orange-700'
                    }`}>
                      {app.recourseStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                      app.riskFlag === 'high' ? 'bg-red-50 text-error' :
                      app.riskFlag === 'medium' ? 'bg-yellow-50 text-warning' :
                      app.riskFlag === 'low' ? 'bg-green-50 text-success' :
                      'bg-gray-50 text-secondary'
                    }`}>
                      {app.riskFlag.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-secondary hover:text-primary p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
