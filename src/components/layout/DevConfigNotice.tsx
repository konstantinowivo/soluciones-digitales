import { env, missingEnv } from '../../config/env'

/** Aviso visible SOLO en desarrollo cuando faltan variables de entorno. Nunca aparece en producción. */
export function DevConfigNotice() {
  if (!env.isDev) return null
  const missing = missingEnv()
  if (missing.length === 0) return null
  return (
    <div
      role="note"
      className="fixed bottom-4 left-4 z-50 max-w-xs rounded-lg border border-amber-300 bg-amber-50 p-3 text-[13px] leading-snug text-amber-900 shadow-lg"
    >
      <strong className="font-semibold">Configuración pendiente (solo dev)</strong>
      <p className="mt-1">Completá en .env:</p>
      <ul className="mt-1 list-disc pl-4 font-medium">
        {missing.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}
