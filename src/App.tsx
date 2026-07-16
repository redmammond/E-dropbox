import { useState, useEffect, useTransition } from 'react';
import { 
  Plus, 
  Trash, 
  ArrowUpDown, 
  FileSpreadsheet, 
  Printer, 
  FileText, 
  Info, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  PlusSquare,
  AlertTriangle
} from 'lucide-react';
import { FeedbackItem, ActiveTab, CategoryType, StatusType, ToastMessage, GlobalHistoryItem, GlobalActionType } from './types';
import { initialFeedbacks } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Toast } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { DashboardView } from './components/DashboardView';
import { SubmissionForm } from './components/SubmissionForm';
import { EntryCard } from './components/EntryCard';
import { ActivityLogView } from './components/ActivityLogView';
import { Logo } from './components/Logo';

const ITEMS_PER_PAGE = 4;

export default function App() {
  // Local storage state load
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('dropbox_submissions_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage submissions, loading initial data', e);
      }
    }
    return initialFeedbacks;
  });

  const [globalHistory, setGlobalHistory] = useState<GlobalHistoryItem[]>(() => {
    const saved = localStorage.getItem('dropbox_global_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage history', e);
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('dropbox_current_user');
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('dropbox_is_admin') === 'true';
  });

  const [loginRole, setLoginRole] = useState<'staff' | 'admin'>('staff');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('dropbox_dark_mode');
    return saved === 'true';
  });

  // Sidebar controls
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  // Search and Filtering
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | CategoryType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | StatusType>('All');
  const [officeFilter, setOfficeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Deletion Modal Trigger
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-set dark mode body class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dropbox_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Reset pagination when filter/search/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, categoryFilter, statusFilter, officeFilter, sortBy, activeTab]);

  // Helpers to persist feedbacks
  const persistFeedbacks = (updated: FeedbackItem[]) => {
    setFeedbacks(updated);
    localStorage.setItem('dropbox_submissions_list', JSON.stringify(updated));
  };

  const persistGlobalHistory = (history: GlobalHistoryItem[]) => {
    setGlobalHistory(history);
    localStorage.setItem('dropbox_global_history', JSON.stringify(history));
  };

  const logGlobalAction = (
    feedbackId: string,
    action: GlobalActionType,
    description: string,
    previousState: FeedbackItem | null,
    newState: FeedbackItem | null
  ) => {
    const timestampStr = new Date().toISOString();
    const newEntry: GlobalHistoryItem = {
      id: `gh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      feedbackId,
      action,
      description,
      timestamp: timestampStr,
      editorName: currentUser || undefined,
      previousState,
      newState
    };
    persistGlobalHistory([newEntry, ...globalHistory]);
  };

  // Toast handlers
  const addToast = (type: ToastMessage['type'], message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Submission Form Submission Handler
  const handleFormSubmit = async (
    formData: Omit<FeedbackItem, 'id' | 'status' | 'solution' | 'suggestions' | 'history'>
  ): Promise<boolean> => {
    // Mimic database latency for UX satisfying loading animation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const newId = `fb-${Date.now()}`;
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newItem: FeedbackItem = {
      ...formData,
      id: newId,
      status: 'Pending',
      solution: null,
      suggestions: [],
      history: [
        {
          id: `h-init-${Date.now()}`,
          action: formData.isAnonymous ? 'Submission dispatched anonymously' : 'Submission dispatched',
          timestamp: timestampStr,
          user: formData.isAnonymous ? 'System' : formData.name,
        },
      ],
    };

    const updated = [newItem, ...feedbacks];
    persistFeedbacks(updated);
    logGlobalAction(newId, 'CREATE', 'Created a new submission entry.', null, newItem);
    addToast('success', 'Your submission has been securely filed in the Dropbox inbox!');
    
    // Auto redirect to inbox tab to see their entry
    setActiveTab('inbox');
    return true;
  };

  // Status Change handler
  const handleUpdateStatus = (id: string, newStatus: StatusType, editorName: string) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const oldItem = feedbacks.find(f => f.id === id) || null;
    let newItemObj: FeedbackItem | null = null;
    
    const updated = feedbacks.map((item) => {
      if (item.id === id) {
        newItemObj = {
          ...item,
          status: newStatus,
          history: [
            ...item.history,
            {
              id: `h-${Date.now()}`,
              action: `Workflow Status modified to [${newStatus}]`,
              timestamp: timestampStr,
              user: editorName,
            },
          ],
        };
        return newItemObj;
      }
      return item;
    });

    if (newItemObj) {
      logGlobalAction(id, 'UPDATE', `Status updated to ${newStatus}`, oldItem, newItemObj);
    }
    persistFeedbacks(updated);
    addToast('info', `Workflow status updated to [${newStatus}]`);
  };

  // Add/Edit official solution
  const handleUpdateSolution = (id: string, solutionContent: string, editorName: string) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const oldItem = feedbacks.find(f => f.id === id) || null;
    let newItemObj: FeedbackItem | null = null;
    
    const updated = feedbacks.map((item) => {
      if (item.id === id) {
        const isNew = item.solution === null;
        newItemObj = {
          ...item,
          solution: {
            content: solutionContent,
            updatedAt: timestampStr,
            updatedBy: editorName,
          },
          history: [
            ...item.history,
            {
              id: `h-${Date.now()}`,
              action: isNew ? 'Official Solution added and published' : 'Official Solution edited and republished',
              timestamp: timestampStr,
              user: editorName,
            },
          ],
        };
        return newItemObj;
      }
      return item;
    });

    if (newItemObj) {
      logGlobalAction(id, 'UPDATE', `Updated official solution`, oldItem, newItemObj);
    }
    persistFeedbacks(updated);
    addToast('success', 'Official resolution solution updated successfully!');
  };

  // Add a collaboration suggestion
  const handleAddSuggestion = (id: string, content: string, suggesterName: string) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const oldItem = feedbacks.find(f => f.id === id) || null;
    let newItemObj: FeedbackItem | null = null;
    
    const updated = feedbacks.map((item) => {
      if (item.id === id) {
        newItemObj = {
          ...item,
          suggestions: [
            ...item.suggestions,
            {
              id: `sug-${Date.now()}`,
              content,
              createdAt: timestampStr,
              createdBy: suggesterName,
            },
          ],
          history: [
            ...item.history,
            {
              id: `h-${Date.now()}`,
              action: `Added suggestion comment: "${content.substring(0, 30)}..."`,
              timestamp: timestampStr,
              user: suggesterName,
            },
          ],
        };
        return newItemObj;
      }
      return item;
    });

    if (newItemObj) {
      logGlobalAction(id, 'UPDATE', `Added suggestion: "${content.substring(0, 30)}..."`, oldItem, newItemObj);
    }
    persistFeedbacks(updated);
    addToast('success', `Feedback comment registered from ${suggesterName}`);
  };

  // Edit a custom suggestion
  const handleEditSuggestion = (id: string, suggestionId: string, content: string) => {
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const oldItem = feedbacks.find(f => f.id === id) || null;
    let newItemObj: FeedbackItem | null = null;
    
    const updated = feedbacks.map((item) => {
      if (item.id === id) {
        newItemObj = {
          ...item,
          suggestions: item.suggestions.map((sug) =>
            sug.id === suggestionId
              ? { ...sug, content, createdAt: `${timestampStr} (Edited)` }
              : sug
          ),
          history: [
            ...item.history,
            {
              id: `h-${Date.now()}`,
              action: `Modified suggestion comment`,
              timestamp: timestampStr,
              user: 'Alex Polmond',
            },
          ],
        };
        return newItemObj;
      }
      return item;
    });

    if (newItemObj) {
      logGlobalAction(id, 'UPDATE', `Edited a suggestion comment`, oldItem, newItemObj);
    }
    persistFeedbacks(updated);
    addToast('info', 'Team suggestion updated successfully.');
  };

  // Deletion modals triggers
  const handleDeleteRequest = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    const oldItem = feedbacks.find((f) => f.id === deletingId) || null;
    const updated = feedbacks.filter((f) => f.id !== deletingId);
    if (oldItem) {
      logGlobalAction(deletingId, 'DELETE', `Deleted entry: "${oldItem.subject}"`, oldItem, null);
    }
    persistFeedbacks(updated);
    setIsDeleteModalOpen(false);
    setDeletingId(null);
    addToast('warning', 'Submission entry permanently deleted from Dropbox database.');
  };

  // Navigation from activity bell list click
  const handleSelectFeedbackFromActivity = (id: string) => {
    setActiveTab('inbox');
    const targetItem = feedbacks.find((f) => f.id === id);
    if (targetItem) {
      setSearchText(targetItem.subject);
    }
  };

  // Filter & Search Feedbacks
  const filteredFeedbacks = feedbacks
    .filter((item) => {
      // Search keyword matches (Subject, Description, Submitter name, Category, Solutions)
      const keyword = searchText.toLowerCase().trim();
      const matchSearch =
        !keyword ||
        item.subject.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        (item.solution && item.solution.content.toLowerCase().includes(keyword));

      // Category filter matching
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;

      // Office filter matching
      const matchOffice = officeFilter === 'All' || item.office === officeFilter;

      // Tab matching and status filters
      let matchTabAndStatus = true;
      if (activeTab === 'solved') {
        matchTabAndStatus = item.status === 'Solved';
      } else if (activeTab === 'pending') {
        matchTabAndStatus = item.status === 'Pending';
      } else {
        // Inbox Tab supports granular Status dropdown filters
        matchTabAndStatus = statusFilter === 'All' || item.status === statusFilter;
      }

      return matchSearch && matchCategory && matchTabAndStatus && matchOffice;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handleRestoreState = (logId: string) => {
    const logItem = globalHistory.find(l => l.id === logId);
    if (!logItem) return;

    let updatedFeedbacks = [...feedbacks];

    if (logItem.action === 'CREATE') {
      updatedFeedbacks = updatedFeedbacks.filter(f => f.id !== logItem.feedbackId);
      logGlobalAction(logItem.feedbackId, 'RESTORE', `Reverted creation of entry`, logItem.newState, null);
    } else if (logItem.action === 'DELETE') {
      if (logItem.previousState) {
        if (!updatedFeedbacks.some(f => f.id === logItem.feedbackId)) {
          updatedFeedbacks = [logItem.previousState, ...updatedFeedbacks];
        } else {
           updatedFeedbacks = updatedFeedbacks.map(f => f.id === logItem.feedbackId ? logItem.previousState! : f);
        }
        logGlobalAction(logItem.feedbackId, 'RESTORE', `Restored deleted entry`, null, logItem.previousState);
      }
    } else if (logItem.action === 'UPDATE') {
      if (logItem.previousState) {
        updatedFeedbacks = updatedFeedbacks.map(f => f.id === logItem.feedbackId ? logItem.previousState! : f);
        logGlobalAction(logItem.feedbackId, 'RESTORE', `Restored to previous state`, logItem.newState, logItem.previousState);
      }
    } else if (logItem.action === 'RESTORE') {
      if (logItem.previousState) {
        if (!updatedFeedbacks.some(f => f.id === logItem.feedbackId)) {
          updatedFeedbacks = [logItem.previousState, ...updatedFeedbacks];
        } else {
          updatedFeedbacks = updatedFeedbacks.map(f => f.id === logItem.feedbackId ? logItem.previousState! : f);
        }
        logGlobalAction(logItem.feedbackId, 'RESTORE', `Reverted a restore action`, logItem.newState, logItem.previousState);
      } else {
        updatedFeedbacks = updatedFeedbacks.filter(f => f.id !== logItem.feedbackId);
        logGlobalAction(logItem.feedbackId, 'RESTORE', `Reverted a restore action`, logItem.newState, null);
      }
    }

    persistFeedbacks(updatedFeedbacks);
    addToast('success', 'State successfully restored!');
  };

  // Pagination parameters
  const totalItems = filteredFeedbacks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems = filteredFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Logo className="w-10 h-10 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Welcome to the Dropbox
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Please enter your full name to continue. This ensures all actions and suggestions are properly logged to you.
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = (formData.get('name') as string)?.trim();
              if (name) {
                if (loginRole === 'admin') {
                  const pw = formData.get('password') as string;
                  if (pw !== '@mswd123') {
                    alert('Invalid admin password (hint: @mswd123)');
                    return;
                  }
                  setIsAdmin(true);
                  localStorage.setItem('dropbox_is_admin', 'true');
                } else {
                  setIsAdmin(false);
                  localStorage.setItem('dropbox_is_admin', 'false');
                }
                setCurrentUser(name);
                localStorage.setItem('dropbox_current_user', name);
              }
            }}
            className="space-y-4 text-left"
          >
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setLoginRole('staff')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginRole === 'staff' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Staff Access
              </button>
              <button
                type="button"
                onClick={() => setLoginRole('admin')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginRole === 'admin' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Admin Access
              </button>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g., Jane Doe"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              />
            </div>

            {loginRole === 'admin' && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              Enter Workspace
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4f8] dark:bg-slate-900 transition-colors duration-300 font-sans" id="app-root">
      
      {/* Mailbox-Style Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Reset status filters when clicking Solved/Pending tabs specifically
          if (tab === 'solved') setStatusFilter('Solved');
          else if (tab === 'pending') setStatusFilter('Pending');
          else setStatusFilter('All');
        }}
        feedbacks={feedbacks}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
        isAdmin={isAdmin}
      />

      {/* Main Mailbox Content Box */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-area">
        
        {/* Top bar with search, notifications, profile */}
        <TopBar
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(true)}
          searchText={searchText}
          onSearchChange={setSearchText}
          feedbacks={feedbacks}
          onSelectFeedback={handleSelectFeedbackFromActivity}
          currentUser={currentUser}
        />

        {/* Inner Panel body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto space-y-6">
          
          {/* Main Workspace renderer based on Active Tab */}
          {activeTab === 'dashboard' ? (
            <DashboardView
              feedbacks={feedbacks}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                if (tab === 'solved') setStatusFilter('Solved');
                else if (tab === 'pending') setStatusFilter('Pending');
                else setStatusFilter('All');
              }}
            />
          ) : activeTab === 'new-submission' ? (
            <SubmissionForm onSubmit={handleFormSubmit} />
          ) : activeTab === 'activity-log' && isAdmin ? (
            <ActivityLogView historyLog={globalHistory} onRestore={handleRestoreState} />
          ) : activeTab === 'activity-log' && !isAdmin ? (
            <div className="flex items-center justify-center p-12 text-slate-500">Access Denied</div>
          ) : (
            // Feedbacks Inbox Listing (Inbox, Solved, Pending tabs)
            <div className="space-y-6">
              
              {/* Mailbox Header filter strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white font-sans capitalize">
                    {activeTab === 'inbox' ? 'Main Dropbox Inbox' : `${activeTab} Entries`}
                  </h2>
                  <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded-full">
                    {totalItems} items matching
                  </span>
                </div>

                {/* Filters Controllers */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  
                  {/* Category Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-450 dark:text-slate-500 font-bold">Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as any)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-slate-800 dark:text-slate-200 outline-none font-semibold cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Issue">⚠️ Issue</option>
                      <option value="Concern">❓ Concern</option>
                      <option value="Suggestion">💡 Suggestion</option>
                    </select>
                  </div>

                  {/* Unit Office Filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-450 dark:text-slate-500 font-bold">Unit:</span>
                    <select
                      value={officeFilter}
                      onChange={(e) => setOfficeFilter(e.target.value)}
                      className="bg-transparent border-none p-0 focus:ring-0 text-slate-800 dark:text-slate-200 outline-none font-semibold cursor-pointer"
                    >
                      <option value="All">All Units</option>
                      <option value="Main">🏢 Main</option>
                      <option value="Malasakit">💖 Malasakit</option>
                      <option value="ER">🚨 ER</option>
                    </select>
                  </div>

                  {/* Status Filter (Only visible inside main Inbox tab) */}
                  {activeTab === 'inbox' && (
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="text-slate-450 dark:text-slate-500 font-bold">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-transparent border-none p-0 focus:ring-0 text-slate-800 dark:text-slate-200 outline-none font-semibold cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Solved">Solved</option>
                      </select>
                    </div>
                  )}

                  {/* Sort Direction Controller */}
                  <button
                    onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-slate-200 dark:border-slate-850 cursor-pointer"
                    title={`Click to sort by ${sortBy === 'newest' ? 'oldest first' : 'newest first'}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-blue-500" />
                    <span>Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}</span>
                  </button>
                </div>
              </div>

              {/* Items Cards List */}
              {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-6" id="submissions-list">
                  {currentItems.map((item) => (
                    <EntryCard
                      key={item.id}
                      item={item}
                      currentUser={currentUser}
                      onUpdateStatus={handleUpdateStatus}
                      onUpdateSolution={handleUpdateSolution}
                      onAddSuggestion={handleAddSuggestion}
                      onEditSuggestion={handleEditSuggestion}
                      onDeleteRequest={handleDeleteRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white/50 dark:bg-slate-900/45 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 backdrop-blur-md" id="empty-state">
                  <div className="flex justify-center mb-3 text-slate-350 dark:text-slate-600">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No results found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    No entries match your selected criteria. Try adjusting your keyword search, filters, or select a different tab.
                  </p>
                  <button
                    onClick={() => {
                      setSearchText('');
                      setCategoryFilter('All');
                      setStatusFilter('All');
                      setOfficeFilter('All');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800" id="pagination-controls">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Showing page <span className="font-bold text-slate-700 dark:text-slate-300">{currentPage}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{totalPages}</span> ({totalItems} total matching)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-all ${
                        currentPage === 1
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 cursor-pointer'
                      }`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition-all ${
                        currentPage === totalPages
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-750 cursor-pointer'
                      }`}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Action confirmation dialog overlay (Deletion protection) */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Confirm permanent deletion"
        message="Are you sure you want to permanently erase this feedback submission? All associated solutions, suggestions, team discussions, and history audits will be deleted. This operation cannot be undone."
        confirmLabel="Erase Permanently"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeletingId(null);
        }}
      />

      {/* Toast Notification HUD */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none p-4 md:p-0">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={handleDismissToast} />
          </div>
        ))}
      </div>
    </div>
  );
}
