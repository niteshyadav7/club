import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { removeToast, ToastNotification } from '../store/slices/uiSlice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    // Auto vanish after 3.5 seconds
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
  };

  const borders = {
    success: 'border-emerald-200/90 bg-white/95 text-emerald-950',
    info: 'border-blue-200/90 bg-white/95 text-blue-950',
    warning: 'border-amber-200/90 bg-white/95 text-amber-950',
    error: 'border-rose-200/90 bg-white/95 text-rose-950'
  };

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 flex items-start gap-2.5 animate-in slide-in-from-bottom-3 fade-in duration-200 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs font-bold text-gray-900 leading-tight">{toast.title}</h4>
        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition shrink-0 cursor-pointer"
        title="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const NotificationToasts: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col gap-2 max-w-xs sm:max-w-sm w-full pointer-events-none">
      {toasts.slice(-3).map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={(id) => dispatch(removeToast(id))}
        />
      ))}
    </div>
  );
};

export default NotificationToasts;
