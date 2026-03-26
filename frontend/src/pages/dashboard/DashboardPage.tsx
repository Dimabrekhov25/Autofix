import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'
import { Button } from '../../shared/ui/Button'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

export function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mb-12">
        <h1 className="mb-8 text-4xl font-headline font-extrabold tracking-tight text-on-background">
          Performance Dashboard
        </h1>

        <div className="grid grid-cols-12 gap-6">
          <div className="shell-panel relative col-span-12 overflow-hidden p-6 lg:col-span-5">
            <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-10">
              <MaterialIcon name="build_circle" className="text-[120px]" />
            </div>
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-primary">
                  Active Service
                </span>
                <span className="text-xs font-medium text-on-surface-variant">ID: #AF-9921</span>
              </div>
              <h2 className="text-2xl font-headline font-bold">In Repair</h2>
              <p className="font-medium text-on-surface-variant">Tesla Model 3 • ABC-1234</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
              <div>
                <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Estimated Completion
                </p>
                <p className="text-sm font-semibold">Today, 4:30 PM</p>
              </div>
              <Button to="/booking" tone="inverse" className="px-4 py-2 text-xs">
                Details
              </Button>
            </div>
          </div>

          <div className="col-span-12 rounded-xl bg-primary p-6 text-on-primary shadow-shell md:col-span-6 lg:col-span-4">
            <MaterialIcon name="event" className="mb-4 text-4xl" />
            <h2 className="text-xl font-headline font-bold">Upcoming Booking</h2>
            <p className="mt-2 font-medium text-on-primary/80">Oil Service & Brake Check</p>
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-3">
                <MaterialIcon name="calendar_today" className="text-lg" />
                <span className="font-semibold">Friday, Oct 12</span>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon name="schedule" className="text-lg" />
                <span className="font-semibold">9:00 AM</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 rounded-xl bg-surface-container-high p-6 md:col-span-6 lg:col-span-3">
            <h2 className="font-headline text-sm font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              Quick Updates
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border-l-4 border-primary bg-white p-3 shadow-sm">
                <MaterialIcon name="request_quote" className="mt-0.5 text-xl text-primary" />
                <p className="text-xs font-semibold leading-snug">
                  New estimate ready for approval
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg border-l-4 border-cyan-400 bg-white p-3 shadow-sm">
                <MaterialIcon
                  name="directions_car"
                  className="mt-0.5 text-xl text-cyan-500"
                />
                <p className="text-xs font-semibold leading-snug">
                  Repair started on your vehicle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-headline font-bold tracking-tight">Repair Tracking</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Real-time status of your Tesla Model 3 service
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live Update
          </div>
        </div>

        <div className="shell-panel overflow-x-auto p-8">
          <div className="relative flex min-w-[800px] items-center justify-between px-4">
            <div className="absolute left-10 right-10 top-[22px] h-1 bg-surface-container-highest">
              <div className="h-full w-[75%] bg-primary" />
            </div>
            {[
              ['Booked', 'Oct 08, 10:30', 'check'],
              ['Diagnosed', 'Oct 09, 14:15', 'check'],
              ['Approved', 'Oct 09, 16:00', 'check'],
              ['In Repair', 'In Progress', 'settings'],
              ['Completed', 'Pending', 'flag'],
            ].map(([title, time, icon], index) => (
              <div key={title} className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={[
                    'flex h-12 w-12 items-center justify-center rounded-full',
                    index < 3 && 'bg-primary text-on-primary shadow-shell',
                    index === 3 && 'border-4 border-primary bg-white text-primary shadow-md',
                    index === 4 && 'bg-surface-container-highest text-on-surface-variant/40',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <MaterialIcon
                    name={icon}
                    className={index === 3 ? 'animate-spin' : undefined}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-[10px] font-medium text-on-surface-variant">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
