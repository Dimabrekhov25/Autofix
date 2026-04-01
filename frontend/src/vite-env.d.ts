/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { GoogleAccountsIdApi, GoogleCredentialResponse } from './features/auth/google-identity'

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_BACKEND_ORIGIN?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsIdApi & {
          initialize: (options: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
            context?: 'signin' | 'signup' | 'use'
            ux_mode?: 'popup'
            cancel_on_tap_outside?: boolean
          }) => void
        }
      }
    }
  }
}

export {}
