import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '../lib/cn'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  inputClassName?: string
  wrapperClassName?: string
  trailingAction?: ReactNode
}

export function TextField({
  label,
  inputClassName,
  wrapperClassName,
  trailingAction,
  type = 'text',
  ...props
}: TextFieldProps) {
  return (
    <label className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
        {label}
      </span>
      <div className="relative">
        <input
          type={type}
          className={cn(
            'w-full rounded-xl border border-transparent bg-surface-container-low px-4 py-3.5 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary/20 focus:bg-white focus:ring-2 focus:ring-primary/15',
            trailingAction ? 'pr-12' : undefined,
            inputClassName,
          )}
          {...props}
        />
        {trailingAction ? (
          <div className="absolute inset-y-0 right-3 flex items-center text-on-surface-variant">
            {trailingAction}
          </div>
        ) : null}
      </div>
    </label>
  )
}
