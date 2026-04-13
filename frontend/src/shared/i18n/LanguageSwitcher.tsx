import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '../lib/cn'
import { MaterialIcon } from '../ui/MaterialIcon'
import { supportedLanguages, type SupportedLanguage } from './resources'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement | null>(null)
  const currentLanguage = supportedLanguages.some((language) => language.code === i18n.resolvedLanguage)
    ? i18n.resolvedLanguage as SupportedLanguage
    : 'en'
  const selectedLanguage =
    supportedLanguages.find((language) => language.code === currentLanguage) ?? supportedLanguages[0]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div
      ref={switcherRef}
      className={cn('relative inline-flex', className)}
    >
      <button
        type="button"
        aria-label={t('common.language')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-[0.6875rem] font-black uppercase tracking-[0.14em] text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-950"
      >
        <span>{selectedLanguage.label}</span>
        <MaterialIcon
          name="keyboard_arrow_down"
          className={cn('text-[1rem] transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={t('common.language')}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] min-w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl"
        >
          {supportedLanguages.map((language) => {
            const isSelected = language.code === currentLanguage

            return (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  void i18n.changeLanguage(language.code)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold transition',
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}
              >
                <span>{language.name}</span>
                <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>{language.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
