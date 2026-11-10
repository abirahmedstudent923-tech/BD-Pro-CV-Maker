import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        let bgStyle = 'bg-slate-900 text-white border-slate-700';
        let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-900 text-white border-emerald-700';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-950 text-white border-rose-800';
          icon = <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-950 text-white border-amber-800';
          icon = <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200 ${bgStyle}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <p className="font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
