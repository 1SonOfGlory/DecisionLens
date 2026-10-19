import React from 'react';
import { motion } from 'framer-motion';
import { mockApplicants } from '../mockData';
import { ChevronRight, Search, Filter } from 'lucide-react';

export default function ApplicantTable({ programId, onSelectApplicant }) {
  const applicants = mockApplicants.filter(a => a.programId === programId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Applicant Cohort</h2>
          <p className="text-sm text-secondary mt-1">Review candidates and evaluate recourse pathways.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search cohort..." 
              className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft flex-1">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Applicant</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Fit Score</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary">Recourse</th>
              <th className="px-6 py-4 text-left font-semibold text-secondary hidden lg:table-cell">Primary Filter</th>
              <th className="px-6 py-4 text-right font-semibold text-secondary">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {applicants.map((app, i) => (
              <motion.tr 
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onSelectApplicant(app)}
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-primary">{app.name}</p>
                  <p className="text-xs text-secondary font-mono mt-0.5">{app.id}</p>
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
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
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
                <td className="px-6 py-4 hidden lg:table-cell text-secondary truncate max-w-[200px]">
                  {app.rejectionReason || "Meets all criteria"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-accent hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors inline-flex items-center">
                    Review <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
