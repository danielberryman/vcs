import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ModalProvider } from './hooks/useGlobalModal.tsx'
import { ToastProvider } from './hooks/useToast.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModalProvider>
      <ToastProvider>
        <BrowserRouter basename="/vcs">
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ModalProvider>
  </StrictMode>,
)
