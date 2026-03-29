import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

export function ServicesPage() {
  const services = [
    ['Precision Diagnostic', 'Sensor scans, root-cause tracing, and technician briefing.', 'From $180'],
    ['Brake Performance', 'Pads, rotors, fluid, and calibration with approval checkpoints.', 'From $330'],
    ['Atelier Detailing', 'Interior restoration and premium exterior correction.', 'From $290'],
  ]

  return (
    <DashboardShell searchPlaceholder="Search service packages...">
      <section className="mb-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-slate-950 p-8 text-white shadow-card sm:p-10">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-cyan-200/80">
            Atelier Programs
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-headline font-extrabold tracking-tight sm:text-5xl">
            Premium service catalog built on the same AUTOFIX workflow.
          </h1>
        </div>

        <div className="grid gap-4">
          {services.map(([title, description, price], index) => (
            <article
              key={title}
              className={`rounded-xl p-6 shadow-panel ${
                index === 0
                  ? 'bg-primary text-on-primary'
                  : index === 1
                    ? 'bg-surface-container-lowest text-on-background'
                    : 'bg-surface-container-high text-on-background'
              }`}
            >
              <h2 className="text-xl font-headline font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 opacity-80">{description}</p>
              <div className="mt-5 inline-flex rounded-full bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                {price}
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}
