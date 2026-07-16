import React from 'react';
import { GlobalHistoryItem, FeedbackItem } from '../types';
import { Clock, RotateCcw, Trash2, Edit, PlusCircle, AlertCircle } from 'lucide-react';

interface ActivityLogViewProps {
  historyLog: GlobalHistoryItem[];
  onRestore: (logId: string) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ historyLog, onRestore }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="w-5 h-5 text-emerald-500" />;
      case 'UPDATE': return <Edit className="w-5 h-5 text-blue-500" />;
      case 'DELETE': return <Trash2 className="w-5 h-5 text-red-500" />;
      case 'RESTORE': return <RotateCcw className="w-5 h-5 text-purple-500" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'UPDATE': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
      case 'DELETE': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
      case 'RESTORE': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-850 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight mb-1">
            System Activity Log
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Track all creations, updates, and deletions. Restore deleted or changed items.
          </p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <Clock className="w-6 h-6 text-slate-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {historyLog.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No activity yet</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm">
              All system actions will be logged here. You can restore items if mistakes are made.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {historyLog.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex-1 flex gap-4 items-start">
                  <div className={`mt-1 p-2 rounded-xl border ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {log.description}
                      {log.editorName && (
                        <span className="text-slate-500 font-normal"> by <span className="font-semibold text-slate-700 dark:text-slate-300">{log.editorName}</span></span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      ID: {log.feedbackId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center self-end sm:self-auto gap-2">
                  <button
                    onClick={() => onRestore(log.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore State
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
