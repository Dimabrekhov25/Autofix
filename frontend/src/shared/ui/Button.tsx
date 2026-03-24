import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '../lib/cn'
import type { ActionTone } from '../types/content'

const baseClassName =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-heading text-sm font-extrabold tracking-tight transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'

const toneClassNames: Record<ActionTone, string> = {
  primary:
    'bg-primary text-white shadow-soft hover:-translate-y-0.5 hover:bg-primary-dark',
  secondary:
    'bg-slate-200/80 text-primary hover:-translate-y-0.5 hover:bg-slate-300/90',
  inverse: 'bg-white text-primary hover:-translate-y-0.5 hover:bg-slate-100',
  ghost:
    'border border-slate-300/80 bg-white/10 text-white hover:-translate-y-0.5 hover:bg-white/20',
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
