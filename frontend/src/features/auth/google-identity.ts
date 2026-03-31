export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

export interface GoogleButtonConfiguration {
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  width?: number
  logo_alignment?: 'left' | 'center'
  locale?: string
}

export interface GoogleAccountsIdApi {
  initialize: (options: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    context?: 'signin' | 'signup' | 'use'
    ux_mode?: 'popup'
    cancel_on_tap_outside?: boolean
  }) => void
  renderButton: (
    parent: HTMLElement,
    options: GoogleButtonConfiguration,
  ) => void
  cancel: () => void
}
