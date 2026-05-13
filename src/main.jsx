import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function shouldUseMsw() {
  return import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false'
}

async function start() {
  if (shouldUseMsw()) {
    const { worker } = await import('./mocks/browser.js')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

start()
