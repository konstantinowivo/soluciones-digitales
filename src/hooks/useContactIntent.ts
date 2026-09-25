import { useContext } from 'react'
import { ContactIntentContext } from '../context/contactIntentContext'

export function useContactIntent() {
  const context = useContext(ContactIntentContext)
  if (!context) throw new Error('useContactIntent debe usarse dentro de <ContactIntentProvider>')
  return context
}
