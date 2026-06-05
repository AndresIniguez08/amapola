import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '10px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#E8660A', secondary: '#FFF3EC' },
        },
      }}
    />
  </StrictMode>,
)
