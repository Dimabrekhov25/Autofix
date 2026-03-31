import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../shared/config/routes'
import { BrandMark } from '../../shared/ui/BrandMark'

interface AuthShellProps extends PropsWithChildren {
  eyebrow: string
  title: string
  description: string
}

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-shell-glow" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col rounded-[2rem] border border-white/70 bg-white/45 p-3 shadow-card backdrop-blur-sm lg:grid lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-[1.6rem] bg-primary px-6 py-8 text-on-primary sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <Link
                to={APP_ROUTES.home}
                className="inline-flex items-center rounded-full border border-white/80 bg-white px-5 py-2.5 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-24px_rgba(15,23,42,0.82)]"
              >
                <BrandMark className="font-headline text-2xl font-extrabold tracking-tight text-primary" />
              </Link>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                Precision Atelier
              </span>
            </div>

            <div className="mt-auto max-w-xl pt-20 lg:pt-28">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-lg text-4xl font-headline font-extrabold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/80">{description}</p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center rounded-[1.6rem] bg-surface-container-lowest px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>
    </div>
  )
}
