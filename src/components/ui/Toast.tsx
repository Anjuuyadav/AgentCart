import { CheckCircle, X } from 'lucide-react';
import { useApp } from '../../contexts/useApp';

export function Toast() {
  const { toast, hideToast } = useApp();
  if (!toast) return null;

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${colors[toast.type]}`}>
        {toast.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
        <span className="text-sm font-medium">{toast.message}</span>
        <button onClick={hideToast} className="ml-2 shrink-0 opacity-60 hover:opacity-100" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
