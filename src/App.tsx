import { Analytics } from '@vercel/analytics/react'
import { DevConfigNotice } from './components/layout/DevConfigNotice'
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { ContactIntentProvider } from './context/ContactIntent'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <ContactIntentProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <HomePage />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <DevConfigNotice />
      {/* Vercel Web Analytics: visitas sin cookies. Se activa en Vercel → Analytics. */}
      <Analytics />
    </ContactIntentProvider>
  )
}
