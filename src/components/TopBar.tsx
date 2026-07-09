import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, CheckCircle, Info, Clock, AlertTriangle } from 'lucide-react';
import { FeedbackItem } from '../types';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  searchText: string;
  onSearchChange: (text: string) => void;
  feedbacks: FeedbackItem[];
  onSelectFeedback: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileSidebar,
  searchText,
  onSearchChange,
  feedbacks,
  onSelectFeedback,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive notifications from recent feedback history entries
  const recentActivities = feedbacks
    .flatMap((f) => 
      f.history.map((h) => ({
        ...h,
        feedbackId: f.id,
        feedbackSubject: f.subject,
        feedbackCategory: f.category,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5); // Take top 5 recent changes

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Issue':
        return <div className="p-1 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-500 text-xs font-semibold">Issue</div>;
      case 'Concern':
        return <div className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-500 text-xs font-semibold">Concern</div>;
      case 'Suggestion':
      default:
        return <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 text-xs font-semibold">Suggestion</div>;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-8" id="topbar">
      {/* Search and Sidebar Toggle */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Box */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search submissions..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-sm text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-xl text-slate-450 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5.5 h-5.5" />
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"></span>
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in-down" id="notification-dropdown">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">
                  Activity Feed
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                  Recent Actions
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-150 dark:divide-slate-800/60">
                {recentActivities.length > 0 ? (
                  recentActivities.map((act) => (
                    <button
                      key={`${act.feedbackId}-${act.timestamp}-${act.id}`}
                      onClick={() => {
                        onSelectFeedback(act.feedbackId);
                        setIsNotifOpen(false);
                      }}
                      className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors flex gap-3 cursor-pointer"
                    >
                      <div className="shrink-0 mt-0.5">
                        {act.action.toLowerCase().includes('solved') ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : act.action.toLowerCase().includes('progress') ? (
                          <Clock className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Info className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {act.user}
                          </p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 shrink-0">
                            {act.timestamp.split(' ')[1] || act.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {act.action}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic truncate mt-0.5">
                          "{act.feedbackSubject}"
                        </p>
                        <div className="mt-1.5 flex items-center justify-between">
                          {getCategoryIcon(act.feedbackCategory)}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                    No recent activities recorded.
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Sync status: Local Storage
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
