import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { initAnalytics } from './lib/analytics'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML viene pre-renderizado (scripts/prerender.mjs): se hidrata.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)

initAnalytics()
