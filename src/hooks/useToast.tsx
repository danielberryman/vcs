import React, { createContext, useContext, useState } from 'react';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showToast = (msg: string, duration = 3000) => {
    setMessage(msg);
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setMessage(null), duration);
    setTimeoutId(id);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-black text-white text-sm px-4 py-2 rounded shadow-lg max-w-sm animate-fade-in">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
