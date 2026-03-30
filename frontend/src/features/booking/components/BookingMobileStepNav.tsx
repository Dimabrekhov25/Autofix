import { getBookingProgressStepsWithCompletion } from '../constants/booking-content'
import type { BookingProgressStepId } from '../types/booking'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'
import { Link } from 'react-router-dom'

const mobileIcons = {
  services: 'build',
  schedule: 'calendar_today',
  vehicle: 'directions_car',
  summary: 'assignment_turned_in',
} as const

interface BookingMobileStepNavProps {
  currentStep: BookingProgressStepId
  completedSteps?: BookingProgressStepId[]
  stepLinks?: Partial<Record<BookingProgressStepId, string>>
}

export function BookingMobileStepNav({
  currentStep,
  completedSteps = [],
  stepLinks,
}: BookingMobileStepNavProps) {
  const bookingProgressSteps = getBookingProgressStepsWithCompletion(currentStep, completedSteps)

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[1.5rem] border-t border-outline-variant/10 bg-white px-4 pb-6 pt-3 shadow-[0_-20px_40px_rgba(45,47,49,0.06)] md:hidden">
      {bookingProgressSteps.map((step) => {
        const isCurrent = step.state === 'current'
        const className = [
          'flex flex-col items-center justify-center px-5 py-2 transition-all',
          isCurrent
            ? 'scale-95 rounded-2xl bg-cyan-50 text-cyan-700'
            : step.state === 'upcoming'
              ? 'text-slate-400'
              : 'text-cyan-700 hover:text-cyan-500',
        ]
          .filter(Boolean)
          .join(' ')

        if (stepLinks?.[step.id]) {
          return (
            <Link key={step.id} to={stepLinks[step.id] as string} className={className}>
              <MaterialIcon
                name={mobileIcons[step.id]}
                className={isCurrent ? 'text-[24px]' : undefined}
              />
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider">
                {step.label}
              </span>
            </Link>
          )
        }

        return (
          <button key={step.id} type="button" className={className} disabled>
            <MaterialIcon
              name={mobileIcons[step.id]}
              className={isCurrent ? 'text-[24px]' : undefined}
            />
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider">
              {step.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
