import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '../lib/cn'
import type { ActionTone } from '../types/content'

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-headline text-sm font-bold tracking-wide transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2'

const toneClassNames: Record<ActionTone, string> = {
  primary:
    'bg-primary text-on-primary shadow-shell hover:-translate-y-0.5 hover:bg-primary-dark',
  secondary:
    'bg-surface-container text-primary hover:-translate-y-0.5 hover:bg-surface-container-high',
  inverse:
    'bg-surface-container-lowest text-primary shadow-panel hover:-translate-y-0.5 hover:bg-surface-container-low',
  ghost:
    'border border-outline-variant/40 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/20',
}

type BaseProps = PropsWithChildren<{
  tone?: ActionTone
  className?: string
}>

type RouterButtonProps = BaseProps & Omit<LinkProps, 'className' | 'to'> & { to: string }
type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & { href: string }
type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: never; to?: never }

export function Button(props: RouterButtonProps | LinkButtonProps | NativeButtonProps) {
  const tone = props.tone ?? 'primary'
  const className = cn(baseClassName, toneClassNames[tone], props.className)

  if ('to' in props) {
    const {
      children,
      className: omittedClassName,
      tone: omittedTone,
      to,
      ...rest
    } = props as RouterButtonProps
    void omittedClassName
    void omittedTone

    return (
      <Link className={className} to={to} {...rest}>
        {children}
      </Link>
    )
  }

  if ('href' in props) {
    const {
      children,
      className: omittedClassName,
      tone: omittedTone,
      href,
      ...rest
    } = props as LinkButtonProps
    void omittedClassName
    void omittedTone

    return (
      <a className={className} href={href} {...rest}>
        {children}
      </a>
    )
  }

  const {
    children,
    className: omittedClassName,
    tone: omittedTone,
    type = 'button',
    ...rest
  } = props as NativeButtonProps
  void omittedClassName
  void omittedTone

  return (
    <button className={className} type={type} {...rest}>
      {children}
    </button>
  )
}
