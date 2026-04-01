import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'

import type { GoogleCredentialResponse } from '../google-identity'

interface GoogleSignInCardProps {
  mode: 'login' | 'register'
  disabled?: boolean
  onCredential: (credential: string) => Promise<void>
}

const GOOGLE_SCRIPT_ID = 'autofix-google-identity'
const GOOGLE_SCRIPT_SOURCE = 'https://accounts.google.com/gsi/client?hl=en'

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.76-.07-1.49-.2-2.18H12v4.13h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.21c1.88-1.73 3-4.29 3-7.48Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.21-2.51c-.89.6-2.03.95-3.4.95-2.61 0-4.82-1.76-5.61-4.12H3.07v2.59A9.98 9.98 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.39 13.87a5.99 5.99 0 0 1 0-3.74V7.54H3.07a9.99 9.99 0 0 0 0 8.92l3.32-2.59Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.01c1.47 0 2.8.51 3.84 1.5l2.88-2.88C16.95 2.99 14.7 2 12 2a9.98 9.98 0 0 0-8.93 5.54l3.32 2.59C7.18 7.77 9.39 6.01 12 6.01Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function loadGoogleScript() {
  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)
  if (existingScript) {
    if (window.google?.accounts.id) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve, reject) => {
      const handleLoad = () => {
        existingScript.removeEventListener('load', handleLoad)
        existingScript.removeEventListener('error', handleError)
        resolve()
      }

      const handleError = () => {
        existingScript.removeEventListener('load', handleLoad)
        existingScript.removeEventListener('error', handleError)
        reject(new Error('Failed to load Google Identity Services.'))
      }

      existingScript.addEventListener('load', handleLoad, { once: true })
      existingScript.addEventListener('error', handleError, { once: true })
    })
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = GOOGLE_SCRIPT_SOURCE
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services.'))
    document.head.append(script)
  })
}

export function GoogleSignInCard({
  mode,
  disabled = false,
  onCredential,
}: GoogleSignInCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonMountRef = useRef<HTMLDivElement | null>(null)
  const [buttonWidth, setButtonWidth] = useState(0)
  const [isScriptReady, setIsScriptReady] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
  const isConfigured = Boolean(clientId)
  const contextCopy = useMemo(
    () =>
      mode === 'login'
        ? {
            title: 'Continue with Google',
            description: 'Use your Google account for a faster sign-in experience.',
            text: 'continue_with' as const,
            context: 'signin' as const,
            fallbackLabel: 'Continue with Google',
            fallbackDescription: 'Google sign-in will appear here once the project configuration is complete.',
          }
        : {
            title: 'Create your account with Google',
            description: 'Skip manual sign-up and enter the platform in a single step.',
            text: 'signup_with' as const,
            context: 'signup' as const,
            fallbackLabel: 'Sign up with Google',
            fallbackDescription: 'Google sign-up will appear here once the project configuration is complete.',
          },
    [mode],
  )

  const handleCredential = useEffectEvent(async (response: GoogleCredentialResponse) => {
    if (!response.credential || disabled) {
      return
    }

    await onCredential(response.credential)
  })

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 0)
      setButtonWidth(nextWidth)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isConfigured) {
      return
    }

    let isMounted = true

    void loadGoogleScript()
      .then(() => {
        if (isMounted) {
          setIsScriptReady(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsScriptReady(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isConfigured])

  useEffect(() => {
    if (
      !clientId ||
      !isScriptReady ||
      !buttonMountRef.current ||
      !window.google?.accounts.id ||
      buttonWidth <= 0
    ) {
      return
    }

    buttonMountRef.current.innerHTML = ''
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        void handleCredential(response)
      },
      context: contextCopy.context,
      ux_mode: 'popup',
      cancel_on_tap_outside: true,
    })
    window.google.accounts.id.renderButton(buttonMountRef.current, {
      theme: 'outline',
      size: 'large',
      text: contextCopy.text,
      shape: 'pill',
      logo_alignment: 'left',
      locale: 'en',
      width: Math.max(buttonWidth - 32, 240),
    })

    return () => {
      window.google?.accounts.id.cancel()
    }
  }, [buttonWidth, clientId, contextCopy.context, contextCopy.text, isScriptReady])

  return (
    <section ref={containerRef} className="space-y-4">
      {isConfigured ? (
        <div
          className={disabled ? 'mx-auto w-fit pointer-events-none opacity-60' : 'mx-auto w-fit'}
          ref={buttonMountRef}
        />
      ) : (
        <div className="mx-auto w-full max-w-[360px] space-y-3">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_18px_30px_-26px_rgba(15,23,42,0.85)]"
            disabled
            type="button"
          >
            <GoogleMark />
            <span>{contextCopy.fallbackLabel}</span>
          </button>
          <p className="text-center text-xs leading-5 text-slate-500">
            {contextCopy.fallbackDescription}
          </p>
        </div>
      )}
    </section>
  )
}
