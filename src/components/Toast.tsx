import React from 'react';

interface ToastProps {
  message: string | null;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white text-sm px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
};

export default Toast;
