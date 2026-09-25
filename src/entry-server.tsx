import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** Render estático de la home para el HTML inicial (SEO y primera pintura más rápida). */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
