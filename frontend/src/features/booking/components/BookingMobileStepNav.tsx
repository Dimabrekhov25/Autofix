import { bookingProgressSteps } from '../constants/booking-content'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

const mobileIcons = {
  services: 'build',
  schedule: 'calendar_today',
  vehicle: 'directions_car',
  summary: 'assignment_turned_in',
} as const

export function BookingMobileStepNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[1.5rem] border-t border-outline-variant/10 bg-white px-4 pb-6 pt-3 shadow-[0_-20px_40px_rgba(45,47,49,0.06)] md:hidden">
      {bookingProgressSteps.map((step) => {
        const isCurrent = step.state === 'current'

        return (
          <button
            key={step.id}
            type="button"
            className={[
              'flex flex-col items-center justify-center px-5 py-2 transition-all',
              isCurrent
                ? 'scale-95 rounded-2xl bg-cyan-50 text-cyan-700'
                : 'text-slate-400 hover:text-cyan-500',
            ]
              .filter(Boolean)
              .join(' ')}
          >
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
