import React from 'react';
import { 
  Inbox, 
  PlusCircle, 
  CheckSquare, 
  Clock, 
  LayoutDashboard, 
  Moon, 
  Sun, 
  FolderClosed,
  X
} from 'lucide-react';
import { ActiveTab, FeedbackItem } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  feedbacks: FeedbackItem[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  feedbacks,
  isDarkMode,
  onToggleDarkMode,
  isOpenMobile,
  onCloseMobile,
}) => {
  // Compute counts
  const totalCount = feedbacks.length;
  const pendingCount = feedbacks.filter(f => f.status === 'Pending').length;
  const solvedCount = feedbacks.filter(f => f.status === 'Solved').length;

  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-sky-500',
      badge: null,
    },
    {
      id: 'new-submission' as ActiveTab,
      label: 'New Submission',
      icon: PlusCircle,
      color: 'text-emerald-500',
      badge: null,
    },
    {
      id: 'inbox' as ActiveTab,
      label: 'Inbox',
      icon: Inbox,
      color: 'text-blue-500',
      badge: totalCount,
    },
    {
      id: 'pending' as ActiveTab,
      label: 'Pending',
      icon: Clock,
      color: 'text-amber-500',
      badge: pendingCount,
    },
    {
      id: 'solved' as ActiveTab,
      label: 'Solved',
      icon: CheckSquare,
      color: 'text-emerald-500',
      badge: solvedCount,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1e3a8a] to-[#3b82f6] text-white dark:from-[#0f172a] dark:to-[#1e293b] border-r border-white/10">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 text-white shadow-sm">
            <FolderClosed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight text-white">
              MSWD staff DROPBOX
            </h1>
            <p className="text-xs font-medium text-white/70">
              Issues & Suggestions
            </p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-wider text-white/55">
          Navigation
        </p>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm font-semibold scale-[1.01]'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
              id={`sidebar-tab-${item.id}`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/80'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Area & Theme Selector & Creator Credit */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-white/5">
        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5 text-amber-300" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-white/75" />
                <span>Dark Mode</span>
              </>
            )}
          </div>
          <div className="w-8 h-4 rounded-full bg-white/20 relative transition-colors duration-300">
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                isDarkMode ? 'left-4.5 bg-amber-300' : 'left-0.5'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen shrink-0 sticky top-0" id="sidebar-desktop">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex" id="sidebar-mobile-container">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={onCloseMobile}
          />
          {/* Slide-out Panel */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-white dark:bg-slate-950 shadow-2xl animate-slide-right z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
