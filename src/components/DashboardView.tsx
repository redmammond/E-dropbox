import React from 'react';
import { 
  Inbox, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  FileSpreadsheet, 
  Printer, 
  FileText, 
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { FeedbackItem } from '../types';

interface DashboardViewProps {
  feedbacks: FeedbackItem[];
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrintReport: () => void;
  onNavigateToTab: (tab: 'inbox' | 'solved' | 'pending') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  feedbacks,
  onExportExcel,
  onExportPDF,
  onPrintReport,
  onNavigateToTab,
}) => {
  const total = feedbacks.length;
  const issues = feedbacks.filter((f) => f.category === 'Issue').length;
  const concerns = feedbacks.filter((f) => f.category === 'Concern').length;
  const suggestions = feedbacks.filter((f) => f.category === 'Suggestion').length;

  const solved = feedbacks.filter((f) => f.status === 'Solved').length;
  const pending = feedbacks.filter((f) => f.status === 'Pending').length;
  const inProgress = feedbacks.filter((f) => f.status === 'In Progress').length;

  const solvedRate = total > 0 ? Math.round((solved / total) * 100) : 0;
  const pendingRate = total > 0 ? Math.round((pending / total) * 100) : 0;
  const inProgressRate = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  // Recent 3 submissions
  const recentSubmissions = [...feedbacks]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-view">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-transparent p-6 rounded-2xl border border-blue-500/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold font-sans text-slate-900 dark:text-white tracking-tight">
            Helpdesk Dashboard
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics and mailbox overview for Submitted Issues, Concerns, and Suggestions.
          </p>
        </div>
        
        {/* Export / Print Panel */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            title="Download CSV file compatible with Microsoft Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/50 border border-sky-200 dark:border-sky-800/50 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            title="Download PDF Summary Report"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 rounded-xl transition-all shadow-sm hover:shadow cursor-pointer"
            title="Print structured report of all items"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Numerical Counters Block */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4" id="stats-counter-grid">
        {/* Total Card */}
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800/50 backdrop-blur-md shadow-sm flex flex-col justify-between group hover:scale-[1.03] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-sans">
              {total}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Inbox capacity</p>
          </div>
        </div>

        {/* Issues Card */}
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800/50 border-l-4 border-l-red-500 backdrop-blur-md shadow-sm flex flex-col justify-between hover:scale-[1.03] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Issues</span>
            <div className="p-1.5 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-sans">
              {issues}
            </h3>
            <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">Critical bugs</p>
          </div>
        </div>

        {/* Concerns Card */}
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800/50 border-l-4 border-l-amber-500 backdrop-blur-md shadow-sm flex flex-col justify-between hover:scale-[1.03] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Concerns</span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-lg">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-sans">
              {concerns}
            </h3>
            <p className="text-[10px] text-amber-500 dark:text-amber-400 mt-1">Queries</p>
          </div>
        </div>

        {/* Suggestions Card */}
        <div className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800/50 border-l-4 border-l-blue-500 backdrop-blur-md shadow-sm flex flex-col justify-between hover:scale-[1.03] transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Suggestions</span>
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-sans">
              {suggestions}
            </h3>
            <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1">Workplace ideas</p>
          </div>
        </div>

        {/* Solved Card - Solid Green */}
        <button
          onClick={() => onNavigateToTab('solved')}
          className="p-5 text-left rounded-2xl bg-green-500 text-white shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:bg-green-600 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Solved</span>
            <div className="p-1.5 bg-white/20 text-white rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black font-sans">
              {solved}
            </h3>
            <p className="text-[10px] opacity-80 mt-1">Completed actions</p>
          </div>
        </button>

        {/* Pending Card - Solid Amber/Orange */}
        <button
          onClick={() => onNavigateToTab('pending')}
          className="p-5 text-left rounded-2xl bg-amber-500 text-white shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:bg-amber-600 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Pending</span>
            <div className="p-1.5 bg-white/20 text-white rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black font-sans">
              {pending}
            </h3>
            <p className="text-[10px] opacity-80 mt-1">Awaiting actions</p>
          </div>
        </button>
      </div>

      {/* Visual Analytics Sections (Category Dist and Resolution Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Resolution Progress Glass card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Resolution Pipeline
            </h3>
          </div>

          <div className="space-y-5">
            {/* Solved Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                  Solved ({solved})
                </span>
                <span>{solvedRate}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${solvedRate}%` }}
                />
              </div>
            </div>

            {/* In Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" />
                  In Progress ({inProgress})
                </span>
                <span>{inProgressRate}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${inProgressRate}%` }}
                />
              </div>
            </div>

            {/* Pending Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                  Pending ({pending})
                </span>
                <span>{pendingRate}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pendingRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Overall completion rate:</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{solvedRate}% Solved</span>
          </div>
        </div>

        {/* Right Side: Category Breakdown via SVG Circular Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
            Category Share
          </h3>

          <div className="flex items-center justify-around gap-4 flex-1 my-2">
            {/* Beautiful Custom SVG Pie Chart */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Track */}
                <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="3" />
                
                {/* Issue segment (rose) */}
                {total > 0 && (
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className="stroke-rose-500"
                    strokeWidth="3.2"
                    strokeDasharray={`${(issues / total) * 100} 100`}
                    strokeDashoffset="0"
                  />
                )}
                
                {/* Concern segment (amber) */}
                {total > 0 && (
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className="stroke-amber-500"
                    strokeWidth="3.2"
                    strokeDasharray={`${(concerns / total) * 100} 100`}
                    strokeDashoffset={`-${(issues / total) * 100}`}
                  />
                )}
                
                {/* Suggestion segment (emerald) */}
                {total > 0 && (
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    className="stroke-emerald-500"
                    strokeWidth="3.2"
                    strokeDasharray={`${(suggestions / total) * 100} 100`}
                    strokeDashoffset={`-${((issues + concerns) / total) * 100}`}
                  />
                )}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">{total}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Entries</span>
              </div>
            </div>

            {/* Labels Column */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-rose-500 block shrink-0" />
                <span>Issues: {issues}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-amber-500 block shrink-0" />
                <span>Concerns: {concerns}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-emerald-500 block shrink-0" />
                <span>Suggestions: {suggestions}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic mt-2">
            Distribution reflects all-time submissions.
          </p>
        </div>
      </div>

      {/* Recent Submissions List Section */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-lg shadow-sm">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 font-sans">
          Most Recent Inbox Arrivals
        </h3>
        
        {recentSubmissions.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSubmissions.map((item) => (
              <div
                key={item.id}
                className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {item.date}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.category === 'Issue'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : item.category === 'Concern'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.status === 'Solved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                    {item.subject}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 max-w-2xl">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToTab('inbox')}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors border border-blue-200/20 self-start md:self-auto cursor-pointer"
                >
                  View in Inbox
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center py-4">
            No submissions found. Start by submitting a new form!
          </p>
        )}
      </div>
    </div>
  );
};
