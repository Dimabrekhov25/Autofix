import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import {
  siteFooterBottomLinks,
  siteFooterColumns,
  siteSocialLinks,
} from '../../shared/config/site-shell'
import { BrandMark } from '../../shared/ui/BrandMark'
import { Container } from '../../shared/ui/Container'
import { Icon } from '../../shared/ui/Icon'

interface SiteFooterProps {
  variant?: 'full' | 'compact'
}

export function SiteFooter({ variant = 'full' }: SiteFooterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  if (variant === 'compact') {
    return (
      <footer className="border-t border-slate-200/80 bg-slate-50 py-8">
        <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-2">
            <BrandMark className="font-heading text-lg font-extrabold tracking-[-0.06em] text-slate-900" />
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              © 2026 AUTOFIX Precision Atelier. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            {siteFooterBottomLinks.map((link) => (
              <Link key={link.label} to={link.to} className="transition hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </footer>
    )
  }

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 pt-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-6">
            <BrandMark className="font-heading text-xl font-extrabold tracking-[-0.06em] text-slate-900" />
            <p className="text-sm leading-7 text-slate-500">
              Redefining automotive care through digital transparency and engineering excellence.
            </p>
            <div className="flex gap-4">
              {siteSocialLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/70 text-primary transition hover:bg-primary hover:text-white"
                >
                  <Icon name={link.icon} />
                </Link>
              ))}
            </div>
          </div>

          {siteFooterColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-6">
              <h2 className="font-heading text-lg font-extrabold text-slate-900">
                {column.title}
              </h2>
              <ul className="flex list-none flex-col gap-3 p-0 text-sm text-slate-500">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link className="transition hover:text-primary" to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-lg font-extrabold text-slate-900">Newsletter</h2>
            <p className="text-sm leading-7 text-slate-500">
              Get vehicle maintenance tips and priority booking access.
            </p>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <button
                type="submit"
                aria-label="Submit email"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white transition hover:bg-primary-dark"
              >
                <Icon name="arrowRight" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 AUTOFIX Precision Atelier. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            {siteFooterBottomLinks.map((link) => (
              <Link key={link.label} to={link.to} className="transition hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
