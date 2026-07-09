import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIconContainer = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertCircle className="w-4.5 h-4.5" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Info className="w-4.5 h-4.5" />
          </div>
        );
    }
  };

  return (
    <div
      className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 animate-slide-in max-w-sm w-full pointer-events-auto"
      id={`toast-${toast.id}`}
    >
      {getIconContainer()}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/90 leading-relaxed">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
