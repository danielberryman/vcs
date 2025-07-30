// useGlobalModal.tsx
import React, { createContext, useContext, useState } from 'react';

type ModalContent = React.ReactNode;

interface ModalContextValue {
  showModal: (content: ModalContent) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useGlobalModal must be used within ModalProvider');
  return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ModalContent | null>(null);

  const showModal = (node: ModalContent) => setContent(node);
  const hideModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {content && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center"
          onClick={hideModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
