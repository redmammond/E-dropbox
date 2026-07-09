import React, { useState, useEffect } from 'react';
import { MailCheck, RefreshCw, Trash2, Calendar, ShieldCheck, User } from 'lucide-react';
import { CategoryType, FeedbackItem, FormDraft } from '../types';

interface SubmissionFormProps {
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'status' | 'solution' | 'suggestions' | 'history'>) => Promise<boolean>;
}

const DEFAULT_DRAFT: FormDraft = {
  name: '',
  isAnonymous: false,
  category: 'Suggestion',
  subject: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  office: 'Main',
};

const CHARACTER_LIMIT = 1000;

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<FormDraft>(DEFAULT_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormDraft, string>>>({});
  const [hasSuccess, setHasSuccess] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('dropbox_submission_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as FormDraft;
        // Verify default date is updated if draft didn't specify one or if it is stale
        if (!parsed.date) {
          parsed.date = new Date().toISOString().split('T')[0];
        }
        setForm(parsed);
      } catch (e) {
        console.error('Failed to parse saved draft', e);
      }
    }
  }, []);

  // Save draft on form changes
  const updateField = <K extends keyof FormDraft>(field: K, value: FormDraft[K]) => {
    const updatedForm = { ...form, [field]: value };
    setForm(updatedForm);
    localStorage.setItem('dropbox_submission_draft', JSON.stringify(updatedForm));
    
    // Clear validation error for that field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const clearDraft = () => {
    setForm({
      ...DEFAULT_DRAFT,
      date: new Date().toISOString().split('T')[0],
    });
    localStorage.removeItem('dropbox_submission_draft');
    setValidationErrors({});
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormDraft, string>> = {};
    
    if (!form.isAnonymous && !form.name.trim()) {
      errors.name = 'Please provide your name, or toggle "Submit Anonymously" below.';
    }
    if (!form.subject.trim()) {
      errors.subject = 'A subject line is required.';
    } else if (form.subject.length > 100) {
      errors.subject = 'Subject cannot exceed 100 characters.';
    }
    if (!form.description.trim()) {
      errors.description = 'A detailed description is required.';
    } else if (form.description.length < 15) {
      errors.description = 'Please explain in at least 15 characters to help us collaborate.';
    }
    if (!form.date) {
      errors.date = 'Date is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate slight network lag for satisfying loading animation
    const success = await onSubmit({
      date: form.date,
      name: form.isAnonymous ? 'Anonymous' : form.name.trim(),
      isAnonymous: form.isAnonymous,
      category: form.category,
      subject: form.subject.trim(),
      description: form.description.trim(),
      office: form.office,
    });

    setIsSubmitting(false);

    if (success) {
      setHasSuccess(true);
      clearDraft();
      // Clear success indicator after 5s
      setTimeout(() => setHasSuccess(false), 5000);
    }
  };

  const charCount = form.description.length;
  const isOverLimit = charCount > CHARACTER_LIMIT;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up" id="submission-form-container">
      <div className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        
        {/* Decorative composer top bar */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] dark:from-[#0f172a] dark:to-[#1e293b] px-6 py-4 flex items-center justify-between text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <MailCheck className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold font-sans tracking-tight">
                Compose Submission
              </h2>
              <p className="text-[10px] text-white/75 font-medium tracking-wide">
                Secure Dropbox Dispatch Console
              </p>
            </div>
          </div>
          
          <button
            onClick={clearDraft}
            type="button"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/25 active:bg-white/30 text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Wipe form draft"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Draft</span>
          </button>
        </div>

        {/* The Submission Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Success feedback panel */}
          {hasSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-3 animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold">Form Submitted Successfully!</p>
                <p className="mt-0.5 text-emerald-600/90 dark:text-emerald-400/90">
                  Your entry is registered in the Dropbox inbox. Team members can now view and collaborate on solutions.
                </p>
              </div>
            </div>
          )}

          {/* Date, Category and Unit Office Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Submission Date (Auto, but editable) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Date of Incident/Idea
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                className={`w-full px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 outline-none transition-all ${
                  validationErrors.date 
                    ? 'border-rose-400 focus:ring-rose-500/20' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {validationErrors.date && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1">{validationErrors.date}</p>
              )}
            </div>

            {/* Submission Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category Selection
              </label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as CategoryType)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer"
              >
                <option value="Issue">⚠️ Issue (Problem/Bug)</option>
                <option value="Concern">❓ Concern (Clarification)</option>
                <option value="Suggestion">💡 Suggestion (Idea)</option>
              </select>
            </div>

            {/* Unit Office */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Unit Office
              </label>
              <select
                value={form.office}
                onChange={(e) => updateField('office', e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 outline-none transition-all cursor-pointer"
              >
                <option value="Main">🏢 Main</option>
                <option value="Malasakit">💖 Malasakit</option>
                <option value="ER">🚨 ER</option>
              </select>
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-slate-950/40 border border-blue-100/40 dark:border-slate-800/60 flex items-start gap-3">
            <input
              type="checkbox"
              id="isAnonymous"
              checked={form.isAnonymous}
              onChange={(e) => updateField('isAnonymous', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="isAnonymous" className="text-xs font-bold text-slate-800 dark:text-slate-200 block cursor-pointer select-none">
                Submit Anonymously
              </label>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Checking this hides your profile and name from other users. Administrators will only see "Anonymous" as the submitter.
              </p>
            </div>
          </div>

          {/* Submitter Name Input */}
          {!form.isAnonymous && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" />
                Submitter Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your name (e.g. John Doe)"
                className={`w-full px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 outline-none transition-all ${
                  validationErrors.name 
                    ? 'border-rose-400 focus:ring-rose-500/20' 
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {validationErrors.name && (
                <p className="text-[11px] font-semibold text-rose-500 mt-1">{validationErrors.name}</p>
              )}
            </div>
          )}

          {/* Subject Line Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              placeholder="Provide a short, descriptive summary of the item"
              maxLength={100}
              className={`w-full px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 outline-none transition-all ${
                validationErrors.subject 
                  ? 'border-rose-400 focus:ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {validationErrors.subject && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1">{validationErrors.subject}</p>
            )}
          </div>

          {/* Description Textarea with Character Counter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Detailed Description
              </label>
              <span className={`text-[10px] font-bold ${isOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                {charCount} / {CHARACTER_LIMIT}
              </span>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Explain the background context, current challenges, and potential ways of solving this..."
              rows={5}
              maxLength={1200}
              className={`w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/80 outline-none transition-all resize-y ${
                validationErrors.description 
                  ? 'border-rose-400 focus:ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {validationErrors.description ? (
                <p className="text-[11px] font-semibold text-rose-500">{validationErrors.description}</p>
              ) : (
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Please be specific and professional in your feedback.
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isOverLimit}
              className={`w-full py-3 px-5 rounded-xl font-bold text-sm text-white shadow-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting || isOverLimit
                  ? 'bg-slate-400 dark:bg-slate-800 text-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-sm'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing Dispatch...</span>
                </>
              ) : (
                <>
                  <MailCheck className="w-5 h-5" />
                  <span>Send to Dropbox Inbox</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2.5">
              Draft is automatically saved in your browser storage.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
