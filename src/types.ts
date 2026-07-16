export type CategoryType = 'Issue' | 'Concern' | 'Suggestion';
export type StatusType = 'Pending' | 'In Progress' | 'Solved';

export interface Solution {
  content: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UserSuggestion {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface HistoryItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface FeedbackItem {
  id: string;
  date: string;
  name: string;
  isAnonymous: boolean;
  category: CategoryType;
  subject: string;
  description: string;
  status: StatusType;
  solution: Solution | null;
  suggestions: UserSuggestion[];
  history: HistoryItem[];
  office?: string;
  photo?: string;
}

export interface FormDraft {
  name: string;
  isAnonymous: boolean;
  category: CategoryType;
  subject: string;
  description: string;
  date: string;
  office: string;
  photo?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export type ActiveTab = 'new-submission' | 'inbox' | 'solved' | 'pending' | 'dashboard';
