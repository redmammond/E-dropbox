import React, { useState } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Trash2, 
  Plus, 
  Check, 
  X, 
  Edit, 
  History, 
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image
} from 'lucide-react';
import { FeedbackItem, CategoryType, StatusType, Solution, UserSuggestion } from '../types';

interface EntryCardProps {
  item: FeedbackItem;
  currentUser: string;
  onUpdateStatus: (id: string, status: StatusType, editorName: string) => void;
  onUpdateSolution: (id: string, solutionContent: string, editorName: string) => void;
  onAddSuggestion: (id: string, content: string, suggesterName: string) => void;
  onEditSuggestion: (id: string, suggestionId: string, content: string) => void;
  onDeleteRequest: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  item,
  currentUser,
  onUpdateStatus,
  onUpdateSolution,
  onAddSuggestion,
  onEditSuggestion,
  onDeleteRequest,
}) => {
  const [isAddingSolution, setIsAddingSolution] = useState(false);
  const [solutionInput, setSolutionInput] = useState(item.solution?.content || '');
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  
  const [isAddingSugg, setIsAddingSugg] = useState(false);
  const [suggInput, setSuggInput] = useState('');
  const [suggesterName, setSuggesterName] = useState(currentUser);

  const [editingSuggId, setEditingSuggId] = useState<string | null>(null);
  const [editingSuggInput, setEditingSuggInput] = useState('');

  const [showHistory, setShowHistory] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Status Badge configurations
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'Solved':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/20 text-blue-700 dark:text-blue-400',
          dot: 'bg-blue-500',
          icon: Clock,
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/20 text-amber-700 dark:text-amber-400',
          dot: 'bg-amber-500',
          icon: AlertCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  const handleSaveSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionInput.trim()) return;
    onUpdateSolution(item.id, solutionInput.trim(), 'Alex Polmond');
    setIsAddingSolution(false);
    setIsEditingSolution(false);
  };

  const handleAddSuggSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggInput.trim()) return;
    onAddSuggestion(item.id, suggInput.trim(), suggesterName.trim() || 'Guest User');
    setSuggInput('');
    setIsAddingSugg(false);
  };

  const handleSaveEditSugg = (suggId: string) => {
    if (!editingSuggInput.trim()) return;
    onEditSuggestion(item.id, suggId, editingSuggInput.trim());
    setEditingSuggId(null);
    setEditingSuggInput('');
  };

  const getCategoryTheme = (category: CategoryType) => {
    switch (category) {
      case 'Issue':
        return {
          bg: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
          label: 'Issue',
        };
      case 'Concern':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
          label: 'Concern',
        };
      case 'Suggestion':
      default:
        return {
          bg: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
          label: 'Suggestion',
        };
    }
  };

  const categoryTheme = getCategoryTheme(item.category);

  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-150 dark:border-slate-800 transition-all flex flex-col gap-5 relative animate-fade-in-up"
      id={`entry-card-${item.id}`}
    >
      {/* Top Banner: Date, Submitter, Category & Deletion */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Badge */}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide uppercase ${categoryTheme.bg}`}>
            {categoryTheme.label}
          </span>

          {/* Date Stamp */}
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {item.date}
          </span>

          {/* Submitter Info */}
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <User className="w-3.5 h-3.5 text-blue-500" />
            By: {item.isAnonymous ? (
              <span className="italic text-slate-400 dark:text-slate-500">Anonymous</span>
            ) : (
              item.name
            )}
          </span>

          {/* Unit Office badge */}
          {item.office && (
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 px-2.5 py-1 rounded-lg">
              <span className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">Unit:</span>
              <span>{item.office}</span>
            </span>
          )}
        </div>

        {/* Status Dropdown Controller & Delete Icon */}
        <div className="flex items-center gap-3">
          {/* Status badge with an inline select to update status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${statusConfig.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <select
              value={item.status}
              onChange={(e) => onUpdateStatus(item.id, e.target.value as StatusType, 'Alex Polmond')}
              className="bg-transparent border-none p-0 pr-5 text-xs font-semibold focus:ring-0 cursor-pointer outline-none select-none text-slate-800 dark:text-slate-200"
              title="Click to modify workflow status"
            >
              <option value="Pending" className="text-slate-800 dark:text-slate-900 font-semibold">Pending</option>
              <option value="In Progress" className="text-slate-800 dark:text-slate-900 font-semibold">In Progress</option>
              <option value="Solved" className="text-slate-800 dark:text-slate-900 font-semibold">Solved</option>
            </select>
          </div>

          {/* Deletion Button */}
          <button
            onClick={() => onDeleteRequest(item.id)}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg transition-all cursor-pointer"
            title="Delete submission"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Body: Subject and Description */}
      <div>
        <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white leading-snug">
          {item.subject}
        </h3>
        <p className="text-sm text-slate-650 dark:text-slate-300 mt-2.5 whitespace-pre-line leading-relaxed">
          {item.description}
        </p>

        {/* Attached Photo display */}
        {item.photo && (
          <div className="mt-4">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mb-1.5 flex items-center gap-1">
              <Image className="w-3 h-3 text-blue-500" />
              <span>Attached Photo / Screenshot</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-center relative group/photo max-w-md">
              <img 
                src={item.photo} 
                alt="Attached visualization" 
                className="max-w-full max-h-80 object-contain cursor-zoom-in transition-all duration-300 hover:opacity-90"
                onClick={() => setIsZoomed(true)}
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-all cursor-zoom-in text-white text-xs font-bold gap-1.5"
                onClick={() => setIsZoomed(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Click to expand view</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Zoomed photo modal */}
      {isZoomed && item.photo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-full transition-all cursor-pointer"
            title="Close Zoom"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={item.photo} 
            alt="Zoomed attachment" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Official Solutions Section (Double styled emerald block) */}
      <div className="rounded-xl border border-emerald-550/20 dark:border-emerald-800/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Resolution Solution
            </span>
          </div>

          {/* Add or Edit Toggle Button */}
          {!isAddingSolution && !isEditingSolution && (
            <button
              onClick={() => {
                setSolutionInput(item.solution?.content || '');
                if (item.solution) {
                  setIsEditingSolution(true);
                } else {
                  setIsAddingSolution(true);
                }
              }}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{item.solution ? 'Edit Solution' : 'Add Solution'}</span>
            </button>
          )}
        </div>

        {/* View mode of Solution */}
        {!isAddingSolution && !isEditingSolution && (
          item.solution ? (
            <div className="space-y-1">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.solution.content}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold italic">
                Updated by {item.solution.updatedBy} on {item.solution.updatedAt}
              </p>
            </div>
          ) : (
            <div className="py-2 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                No formal resolution published yet. Let's work together to address this.
              </p>
            </div>
          )
        )}

        {/* Input/Edit mode of Solution */}
        {(isAddingSolution || isEditingSolution) && (
          <form onSubmit={handleSaveSolution} className="space-y-3">
            <textarea
              value={solutionInput}
              onChange={(e) => setSolutionInput(e.target.value)}
              placeholder="State the resolution clearly or details of work done to resolve..."
              rows={3}
              className="w-full p-2.5 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingSolution(false);
                  setIsEditingSolution(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publish Solution</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Collaboration Suggestions Comments Section */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-800 dark:bg-slate-950 p-4 space-y-3.5 text-white">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-300" />
            Team Discussions & Suggestions ({item.suggestions.length})
          </h4>
          
          {!isAddingSugg && (
            <button
              onClick={() => setIsAddingSugg(true)}
              className="text-xs font-bold text-blue-300 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Comment Idea</span>
            </button>
          )}
        </div>

        {/* Suggestion list */}
        {item.suggestions.length > 0 ? (
          <div className="space-y-3">
            {item.suggestions.map((sug) => {
              const isEditing = editingSuggId === sug.id;
              return (
                <div 
                  key={sug.id} 
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {sug.createdBy}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/60 font-medium">
                        {sug.createdAt}
                      </span>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingSuggId(sug.id);
                            setEditingSuggInput(sug.content);
                          }}
                          className="p-1 text-white/60 hover:text-white rounded cursor-pointer"
                          title="Edit this suggestion"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={editingSuggInput}
                        onChange={(e) => setEditingSuggInput(e.target.value)}
                        className="w-full p-2 text-xs bg-black/20 text-white border border-white/20 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingSuggId(null)}
                          className="p-1 text-[10px] font-semibold text-white/70 hover:text-white rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEditSugg(sug.id)}
                          className="px-2 py-0.5 text-[10px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/90 leading-relaxed">
                      {sug.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-white/60 italic py-1">
            No suggestions yet. Click "Comment Idea" to pitch a resolution strategy.
          </p>
        )}

        {/* Suggestion Add Interface */}
        {isAddingSugg && (
          <form onSubmit={handleAddSuggSubmit} className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
                  Your Signature Name
                </label>
                <input
                  type="text"
                  value={suggesterName}
                  onChange={(e) => setSuggesterName(e.target.value)}
                  placeholder="Anonymous or name"
                  className="w-full px-2 py-1.5 text-xs text-white bg-white/10 border border-white/20 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-white/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">
                Your Collaborative Suggestion / Comment
              </label>
              <textarea
                value={suggInput}
                onChange={(e) => setSuggInput(e.target.value)}
                placeholder="Share your experience, suggest a tool, or offer assistance..."
                rows={2}
                className="w-full px-2.5 py-2 text-xs text-white bg-white/10 border border-white/20 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none placeholder:text-white/40"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingSugg(false);
                  setSuggInput('');
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-white/70 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm cursor-pointer"
              >
                Post Idea
              </button>
            </div>
          </form>
        )}
      </div>

      {/* History Audit Log Timeline Section (Collapsible) */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between w-full text-left text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors cursor-pointer"
        >
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-indigo-500" />
            Audit History Logs ({item.history.length})
          </span>
          {showHistory ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showHistory && (
          <div className="mt-3 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/85 p-3 rounded-xl space-y-2 animate-fade-in max-h-40 overflow-y-auto">
            {item.history.map((log) => (
              <div key={log.id} className="flex gap-2 text-[10px] font-medium leading-relaxed">
                <span className="text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                  {log.timestamp}
                </span>
                <span className="text-blue-600 dark:text-blue-400 shrink-0 font-semibold">
                  [{log.user}]
                </span>
                <span className="text-slate-600 dark:text-slate-400 flex-1">
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
