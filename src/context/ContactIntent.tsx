import { useMemo, useState, type ReactNode } from 'react'
import type { NeedValue } from '../data/contact'
import { ContactIntentContext } from './contactIntentContext'

export function ContactIntentProvider({ children }: { children: ReactNode }) {
  const [need, setNeed] = useState<NeedValue | ''>('')
  const value = useMemo(() => ({ need, setNeed }), [need])
  return <ContactIntentContext.Provider value={value}>{children}</ContactIntentContext.Provider>
}
