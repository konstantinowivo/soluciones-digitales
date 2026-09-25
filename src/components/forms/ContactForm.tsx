import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { env } from '../../config/env'
import { needOptions, whatsappMessageByNeed, type NeedValue } from '../../data/contact'
import { useContactIntent } from '../../hooks/useContactIntent'
import { trackEvent } from '../../lib/analytics'
import {
  LIMITS,
  emptyInquiry,
  isFormConfigured,
  submitInquiry,
  validateField,
  validateInquiry,
  InquiryError,
  type InquiryErrors,
  type InquiryField,
  type InquiryInput,
} from '../../lib/inquiry'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

type Status = 'idle' | 'sending' | 'success' | 'error'

/** Tiempo mínimo entre que se muestra el formulario y el envío (los bots envían al instante). */
const MIN_FILL_MS = 3000
/** Milisegundos transcurridos desde `start`. Fuera del componente: solo se usa en eventos. */
const elapsedSince = (start: number): number => Date.now() - start
const now = (): number => Date.now()

const FIELD_ORDER: InquiryField[] = ['name', 'company', 'email', 'whatsapp', 'need', 'message']

export function ContactForm() {
  const { need, setNeed } = useContactIntent()
  const [values, setValues] = useState<Omit<InquiryInput, 'need'>>(emptyInquiry)
  const [fieldErrors, setErrors] = useState<InquiryErrors>({})
  // Si el visitante elige una necesidad desde una tarjeta, el error de ese campo deja de aplicar.
  const errors: InquiryErrors = need ? { ...fieldErrors, need: undefined } : fieldErrors
  const [touched, setTouched] = useState<Partial<Record<InquiryField, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [submitError, setSubmitError] = useState('')
  const [honeypot, setHoneypot] = useState(false)
  const mountedAt = useRef(0)
  const started = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const formId = useId()

  const allValues: InquiryInput = { ...values, need }

  useEffect(() => {
    mountedAt.current = now()
  }, [])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
    if (status === 'error') errorRef.current?.focus()
  }, [status])

  const update = (field: InquiryField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.value
    if (field === 'need') setNeed(value as NeedValue | '')
    else setValues((current) => ({ ...current, [field]: value }))

    if (touched[field]) {
      const next = { ...allValues, [field]: value } as InquiryInput
      setErrors((current) => ({ ...current, [field]: validateField(field, next) }))
    }
  }

  /** Primer foco en el formulario: permite medir cuántos empiezan vs. cuántos envían. */
  const handleFocus = () => {
    if (started.current) return
    started.current = true
    trackEvent('form_start', { location: 'contact_form', need: need || undefined })
  }

  const blur = (field: InquiryField) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: validateField(field, allValues) }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const found = validateInquiry(allValues)
    setErrors(found)
    setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])))
    const firstInvalid = FIELD_ORDER.find((field) => found[field])
    if (firstInvalid) {
      document.getElementById(`${formId}-${firstInvalid}`)?.focus()
      return
    }

    // Anti-spam: honeypot marcado o envío demasiado rápido → se descarta en silencio.
    if (honeypot || elapsedSince(mountedAt.current) < MIN_FILL_MS) {
      setStatus('success')
      return
    }

    setStatus('sending')
    setSubmitError('')
    try {
      await submitInquiry(allValues, honeypot)
      trackEvent('generate_lead', { location: 'contact_form', need: allValues.need || undefined })
      setStatus('success')
    } catch (error) {
      setSubmitError(error instanceof InquiryError ? error.message : 'No pudimos enviar la consulta.')
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(emptyInquiry)
    setNeed('')
    setErrors({})
    setTouched({})
    setStatus('idle')
    mountedAt.current = now()
    started.current = false
  }

  if (status === 'success') {
    const successWhatsApp = buildWhatsAppUrl(need ? whatsappMessageByNeed[need] : undefined)
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start rounded-[var(--radius-card)] border border-line bg-surface p-8 sm:p-10"
      >
        <CircleCheck className="size-10 text-signal" aria-hidden="true" />
        <p className="mt-5 text-2xl leading-snug font-semibold tracking-[-0.02em] text-navy">
          ¡Gracias por contactarnos!
        </p>
        <p className="mt-2 text-lg leading-relaxed text-muted">
          Recibimos tu consulta y te vamos a responder por email con los próximos pasos.
        </p>
        {successWhatsApp && (
          <>
            <p className="mt-6 text-[15px] text-ink">¿Es urgente? Escribinos y lo vemos ahora.</p>
            <a
              href={successWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { location: 'form_success', need: need || undefined })}
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-whatsapp px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#16733d]"
            >
              <WhatsAppIcon className="size-5" />
              Hablar por WhatsApp
            </a>
          </>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-7 text-[15px] font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
        >
          Enviar otra consulta
        </button>
      </div>
    )
  }

  const fieldProps = (field: InquiryField) => ({
    id: `${formId}-${field}`,
    name: field,
    onBlur: blur(field),
    onChange: update(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${formId}-${field}-error` : undefined,
    className: 'field mt-2',
  })

  const whatsappUrl = buildWhatsAppUrl()

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      aria-labelledby="contact-form-title"
      className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-9"
    >
      <h3 id="contact-form-title" className="text-xl font-semibold tracking-[-0.015em] text-navy">
        Solicitá tu presupuesto
      </h3>
      <p className="mt-1.5 text-[15px] text-muted">
        Los campos marcados con <span aria-hidden="true">*</span>
        <span className="sr-only">asterisco</span> son obligatorios.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" required htmlFor={`${formId}-name`} error={errors.name} errorId={`${formId}-name-error`}>
          <input
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            value={values.name}
            {...fieldProps('name')}
          />
        </Field>
        <Field label="Empresa" htmlFor={`${formId}-company`} error={errors.company} errorId={`${formId}-company-error`} optional>
          <input
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={values.company}
            {...fieldProps('company')}
          />
        </Field>
        <Field label="Email" required htmlFor={`${formId}-email`} error={errors.email} errorId={`${formId}-email-error`}>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            required
            value={values.email}
            {...fieldProps('email')}
          />
        </Field>
        <Field label="WhatsApp" htmlFor={`${formId}-whatsapp`} error={errors.whatsapp} errorId={`${formId}-whatsapp-error`} optional>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Ej.: 351 123 4567"
            maxLength={LIMITS.whatsapp}
            value={values.whatsapp}
            {...fieldProps('whatsapp')}
          />
        </Field>
        <Field
          label="¿Qué necesitás?"
          required
          htmlFor={`${formId}-need`}
          error={errors.need}
          errorId={`${formId}-need-error`}
          className="sm:col-span-2"
        >
          <select required value={need} {...fieldProps('need')}>
            <option value="" disabled>
              Elegí una opción
            </option>
            {needOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Contanos brevemente tu proyecto"
          required
          htmlFor={`${formId}-message`}
          error={errors.message}
          errorId={`${formId}-message-error`}
          className="sm:col-span-2"
        >
          <textarea
            rows={5}
            maxLength={LIMITS.message}
            required
            placeholder="Qué hace tu negocio, qué querés resolver y si tenés alguna fecha en mente."
            value={values.message}
            {...fieldProps('message')}
            className="field mt-2 min-h-32 resize-y"
          />
        </Field>
      </div>

      {/* Honeypot anti-spam: invisible para personas, los bots lo completan. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          No completar este campo
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            checked={honeypot}
            onChange={(event) => setHoneypot(event.target.checked)}
          />
        </label>
      </div>

      {status === 'error' && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-[15px] text-danger"
        >
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            {submitError}{' '}
            {whatsappUrl || env.contactEmail ? (
              <>
                También podés escribirnos
                {whatsappUrl && (
                  <>
                    {' '}por{' '}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                      WhatsApp
                    </a>
                  </>
                )}
                {whatsappUrl && env.contactEmail && ' o'}
                {env.contactEmail && (
                  <>
                    {' '}a{' '}
                    <a
                      href={`mailto:${env.contactEmail}`}
                      onClick={() => trackEvent('email_click', { location: 'form_error' })}
                      className="font-semibold underline"
                    >
                      {env.contactEmail}
                    </a>
                  </>
                )}
                .
              </>
            ) : (
              'Intentá de nuevo en unos minutos.'
            )}
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-accent px-8 text-base font-semibold text-white transition-colors hover:bg-accent-strong disabled:cursor-wait disabled:opacity-80"
        >
          {status === 'sending' ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              Enviando…
            </>
          ) : (
            'Solicitar presupuesto'
          )}
        </button>
        <p className="text-[13px] leading-snug text-muted sm:max-w-[16rem] sm:text-right">
          Usamos tus datos solo para responder esta consulta.{' '}
          <a href="/privacidad" className="underline underline-offset-2 hover:text-ink">
            Política de privacidad
          </a>
        </p>
      </div>
      {!isFormConfigured() && env.isDev && (
        <p className="mt-4 text-[13px] text-amber-800">
          Dev: falta VITE_WEB3FORMS_ACCESS_KEY, el envío va a mostrar un error.
        </p>
      )}
    </form>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  errorId: string
  required?: boolean
  optional?: boolean
  className?: string
  children: ReactNode
}

function Field({ label, htmlFor, error, errorId, required, optional, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-[15px] font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-accent">
            *
          </span>
        )}
        {optional && <span className="ml-1.5 font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-[14px] text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
