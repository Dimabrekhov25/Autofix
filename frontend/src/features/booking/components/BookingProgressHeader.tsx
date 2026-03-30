import {
  bookingStepDefinitions,
  getBookingProgressSteps,
} from '../constants/booking-content'
import type { BookingProgressStepId } from '../types/booking'
import { MaterialIcon } from '../../../shared/ui/MaterialIcon'

interface BookingProgressHeaderProps {
  currentStep: BookingProgressStepId
  title?: string
  description?: string
}

export function BookingProgressHeader({
  currentStep,
  title = 'Schedule Service',
  description,
}: BookingProgressHeaderProps) {
  const bookingProgressSteps = getBookingProgressSteps(currentStep)
  const currentIndex = bookingStepDefinitions.findIndex((step) => step.id === currentStep)
  const maxIndex = bookingStepDefinitions.length - 1
  const progressWidth =
    maxIndex <= 0 || currentIndex <= 0
      ? '0px'
      : `calc((100% - 4.5rem) * ${currentIndex} / ${maxIndex})`

  return (
    <div className="mb-12">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-on-surface">
        {title}
      </h1>

      {description ? (
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-on-surface-variant">{description}</p>
      ) : null}

      <div className="relative mx-auto w-full max-w-3xl px-4">
        <div className="absolute left-9 right-9 top-5 h-0.5 bg-surface-container-high" />
        <div
          className="absolute left-9 top-5 h-0.5 bg-primary transition-all duration-300"
          style={{ width: progressWidth }}
        />

        <div className="relative z-10 flex items-start justify-between">
          {bookingProgressSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-2 text-center">
              <div
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-full font-bold',
                  step.state === 'completed' && 'bg-primary text-on-primary',
                  step.state === 'current' &&
                    'bg-primary text-on-primary ring-4 ring-primary-container/50',
                  step.state === 'upcoming' &&
                    'bg-surface-container-highest text-on-surface-variant',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.state === 'completed' ? (
                  <MaterialIcon name="check" className="text-sm" />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={[
                  'text-[11px] font-bold uppercase tracking-widest',
                  step.state === 'upcoming' ? 'text-on-surface-variant' : 'text-primary',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
