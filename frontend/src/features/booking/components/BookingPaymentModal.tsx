import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'

import { cn } from '../../../shared/lib/cn'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingPaymentModalProps {
  open: boolean
  totalAmount: number
  paymentMethod: 'now' | 'shop'
  onClose: () => void
  onConfirm: () => void
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiryDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)

  if (digits.length <= 2) {
    return digits
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`
}

export function BookingPaymentModal({
  open,
  totalAmount,
  paymentMethod,
  onClose,
  onConfirm,
}: BookingPaymentModalProps) {
  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [saveCard, setSaveCard] = useState(false)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onConfirm()
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-md"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-payment-title"
    >
      <div className="relative flex w-full max-w-[46rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/70 bg-surface-container-lowest shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-b-full bg-primary/25 blur-sm" />

        <div className="z-10 flex items-start justify-between gap-4 border-b border-outline-variant/10 bg-surface-container-lowest/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MaterialIcon name="lock" className="text-[20px]" />
            </div>
            <div>
              <h2
                id="booking-payment-title"
                className="font-headline text-xl font-extrabold tracking-tight text-slate-900"
              >
                Secure Payment
              </h2>
              <p className="mt-1 flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                <MaterialIcon name="verified_user" className="text-sm" />
                PCI DSS Compliant Environment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment modal"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-surface-container-low hover:text-slate-900"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <section className="space-y-3">
              <label className="block px-1 text-[0.625rem] font-black uppercase tracking-[0.22em] text-on-surface-variant">
                Express Checkout
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  <MaterialIcon name="phone_iphone" className="text-lg" />
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-surface-container-low active:scale-[0.98]"
                >
                  <MaterialIcon name="android" className="text-lg text-primary" />
                  <span>Google Pay</span>
                </button>
              </div>
            </section>

            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/15" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-container-lowest px-3 text-[0.6875rem] font-medium italic text-on-surface-variant">
                  Or pay with card
                </span>
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="block px-1 text-xs font-semibold text-on-surface-variant">
                  Cardholder Name
                </span>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(event) => setCardholderName(event.target.value)}
                  placeholder="Johnathan Doe"
                  className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 font-medium text-slate-900 placeholder:text-outline/60 focus:ring-2 focus:ring-primary/35"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="block px-1 text-xs font-semibold text-on-surface-variant">
                  Card Number
                </span>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 pr-24 font-medium text-slate-900 placeholder:text-outline/60 focus:ring-2 focus:ring-primary/35"
                  />
                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    <span className="rounded-md bg-slate-900 px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white">
                      Visa
                    </span>
                    <span className="rounded-md bg-surface-container-high px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-slate-600">
                      MC
                    </span>
                  </div>
                </div>
              </label>

              <label className="space-y-1.5">
                <span className="block px-1 text-xs font-semibold text-on-surface-variant">
                  Expiry Date
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(formatExpiryDate(event.target.value))}
                  placeholder="MM / YY"
                  className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 font-medium text-slate-900 placeholder:text-outline/60 focus:ring-2 focus:ring-primary/35"
                />
              </label>

              <label className="space-y-1.5">
                <span className="block px-1 text-xs font-semibold text-on-surface-variant">
                  CVV / CVC
                </span>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                    placeholder="123"
                    className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 pr-12 font-medium text-slate-900 placeholder:text-outline/60 focus:ring-2 focus:ring-primary/35"
                  />
                  <MaterialIcon
                    name="help"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-outline/40"
                  />
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 py-0.5 sm:col-span-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(event) => setSaveCard(event.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border-2 border-outline-variant/40 transition-all',
                      saveCard && 'border-primary bg-primary'
                    )}
                  >
                    <MaterialIcon
                      name="check"
                      className={cn(
                        'text-[14px] text-on-primary transition-transform',
                        saveCard ? 'scale-100' : 'scale-0'
                      )}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-on-surface-variant">
                  Save card for future services
                </span>
              </label>
            </section>
          </div>

          <div className="space-y-4 border-t border-outline-variant/10 bg-surface-container-low/50 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-on-surface-variant">Order Total</span>
              <span className="font-headline text-[1.75rem] font-extrabold tracking-tight text-slate-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dim font-headline text-base font-bold text-on-primary shadow-[0_8px_30px_rgba(0,102,104,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,102,104,0.4)] active:translate-y-0 active:scale-[0.98]"
            >
              <MaterialIcon name="lock" className="text-[20px]" />
              <span>
                {paymentMethod === 'shop' ? 'Confirm Booking Details' : 'Pay & Confirm Booking'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-5 opacity-60">
              <div className="flex items-center gap-1.5 grayscale">
                <MaterialIcon name="shield" className="text-[18px]" />
                <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.24em]">
                  SSL Secure
                </span>
              </div>
              <div className="flex items-center gap-1.5 grayscale">
                <MaterialIcon name="encrypted" className="text-[18px]" />
                <span className="text-[0.625rem] font-extrabold uppercase tracking-[0.24em]">
                  AES-256 Bit
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
