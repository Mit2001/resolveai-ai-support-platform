import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (message, title = 'Success') => addToast({ message, title, type: 'success' });
  const error = (message, title = 'Error') => addToast({ message, title, type: 'error', duration: 5000 });
  const info = (message, title = 'Information') => addToast({ message, title, type: 'info' });
  const warning = (message, title = 'Warning') => addToast({ message, title, type: 'warning' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
              error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
              info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
            };

            const borders = {
              success: 'border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
              error: 'border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200',
              warning: 'border-amber-500/20 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
              info: 'border-blue-500/20 bg-blue-50/90 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200',
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto p-4 rounded-xl border shadow-lg backdrop-blur-md flex items-start justify-between gap-3 ${borders[toast.type]}`}
              >
                <div className="flex items-start gap-3">
                  {icons[toast.type]}
                  <div>
                    {toast.title && <h4 className="text-sm font-semibold">{toast.title}</h4>}
                    <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
