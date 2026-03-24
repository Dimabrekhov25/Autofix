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
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <div className="relative">
        <input
          type={type}
          className={cn(
            'w-full rounded-2xl border border-transparent bg-surface-muted px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary/20 focus:ring-2 focus:ring-primary/20',
            trailingAction ? 'pr-12' : undefined,
            inputClassName,
          )}
          {...props}
        />
        {trailingAction ? (
          <div className="absolute inset-y-0 right-3 flex items-center text-ink-muted">
            {trailingAction}
          </div>
        ) : null}
      </div>
    </label>
  )
}
