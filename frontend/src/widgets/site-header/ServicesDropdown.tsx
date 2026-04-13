import { useState, type FocusEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { APP_ROUTES } from '../../shared/config/routes'
import { cn } from '../../shared/lib/cn'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'

interface ServicesDropdownProps {
  isActive: boolean
  to: string
  triggerClassName?: string
}

interface ServiceCategory {
  id: string
  label: string
  icon: string
  title: string
  description: string
  services: Array<{
    name: string
    description: string
    icon: string
    to: string
  }>
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'ac-system',
    label: 'A/C System',
    icon: 'ac_unit',
    title: 'A/C System Maintenance',
    description:
      'Ensure your driving comfort with precision diagnostics and high-performance refrigerant services.',
    services: [
      {
        name: 'AC Compressor',
        description: 'Inspection, leak testing, and replacement for high-duty compressor units.',
        icon: 'compress',
        to: '/#services',
      },
      {
        name: 'AC Recharge',
        description: 'Pressure evaluation and refrigerant top-up with UV dye leak tracing.',
        icon: 'ev_station',
        to: '/#services',
      },
      {
        name: 'Cabin Air Filter',
        description: 'HEPA-grade filter replacement to improve interior air quality.',
        icon: 'air_purifier_gen',
        to: '/#services',
      },
    ],
  },
  {
    id: 'battery-starting',
    label: 'Battery & Starting',
    icon: 'battery_charging_full',
    title: 'Battery and Starting Systems',
    description:
      'Keep electrical reliability high with charging diagnostics, battery support, and starter health checks.',
    services: [
      {
        name: 'Battery Health Scan',
        description: 'Load testing, voltage checks, and alternator output verification.',
        icon: 'battery_full_alt',
        to: '/#services',
      },
      {
        name: 'Starter Diagnosis',
        description: 'Crank performance analysis with wiring and relay inspection.',
        icon: 'power',
        to: '/#services',
      },
      {
        name: 'Terminal Service',
        description: 'Corrosion cleanup and contact restoration for stable starts.',
        icon: 'settings_input_hdmi',
        to: '/#services',
      },
    ],
  },
  {
    id: 'oil-maintenance',
    label: 'Oil Change',
    icon: 'oil_barrel',
    title: 'Oil Change and Lubrication',
    description:
      'Protect engine longevity with scheduled oil service, filter replacement, and fluid condition checks.',
    services: [
      {
        name: 'Synthetic Oil Change',
        description: 'Premium synthetic oil replacement matched to mileage and manufacturer spec.',
        icon: 'local_gas_station',
        to: APP_ROUTES.premiumOilChange,
        },
      {
        name: 'Oil Filter Replacement',
        description: 'Fresh filter installation with seal inspection and clean pressure flow support.',
        icon: 'filter_alt',
        to: '/#services',
      },
      {
        name: 'Engine Flush Service',
        description: 'Pre-change cleaning treatment to reduce sludge buildup in high-mileage engines.',
        icon: 'water',
        to: '/#services',
      },
    ],
  },
  {
    id: 'brakes',
    label: 'Brake Performance',
    icon: 'speed',
    title: 'Brake Performance Services',
    description:
      'Precision braking support focused on pad wear, fluid integrity, and confident stopping power.',
    services: [
      {
        name: 'Brake Pad Service',
        description: 'Pad replacement with rotor condition checks and bedding procedure.',
        icon: 'disc_full',
        to: '/#services',
      },
      {
        name: 'Rotor Inspection',
        description: 'Thickness measurement and heat spotting review for performance setups.',
        icon: 'donut_small',
        to: '/#services',
      },
      {
        name: 'Fluid Flush',
        description: 'Brake fluid exchange and pressure bleed for consistent pedal feel.',
        icon: 'water_drop',
        to: '/#services',
      },
    ],
  },
  {
    id: 'tires-wheels',
    label: 'Tires & Wheels',
    icon: 'tire_repair',
    title: 'Tire and Wheel Services',
    description:
      'Balance grip, alignment, and road feel with workshop-grade tire and wheel support.',
    services: [
      {
        name: 'Wheel Balancing',
        description: 'Dynamic balancing to reduce vibration at highway speeds.',
        icon: 'sync',
        to: '/#services',
      },
      {
        name: 'Alignment Check',
        description: 'Suspension geometry review for sharper response and tire life.',
        icon: 'compare_arrows',
        to: '/#services',
      },
      {
        name: 'Seasonal Tire Swap',
        description: 'Fast swap, torque verification, and pressure reset.',
        icon: 'autorenew',
        to: '/#services',
      },
    ],
  },
]

export function ServicesDropdown({ isActive, to, triggerClassName }: ServicesDropdownProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(serviceCategories[0].id)

  const selectedCategory =
    serviceCategories.find((category) => category.id === selectedCategoryId) ?? serviceCategories[0]

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget

    if (nextFocusedElement && event.currentTarget.contains(nextFocusedElement)) {
      return
    }

    setIsOpen(false)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          'flex items-center gap-1',
          triggerClassName,
          (isActive || isOpen) && 'border-b-2 border-primary/85 pb-1 text-primary',
        )}
      >
        <span>{t('common.services')}</span>
        <MaterialIcon
          name="keyboard_arrow_down"
          className={cn('text-[18px] transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'absolute left-1/2 top-full z-50 w-[min(64rem,calc(100vw-3rem))] -translate-x-1/2 pt-4 transition-all duration-200',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="grid overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 shadow-card backdrop-blur-xl lg:grid-cols-[18rem_minmax(0,1fr)]">
          <div className="bg-surface-container-low p-5">
            <p className="mb-4 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              {t('site.servicesDropdown.systemCategories')}
            </p>
            <div className="space-y-1">
              {serviceCategories.map((category) => {
                const isSelected = category.id === selectedCategory.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    onMouseEnter={() => setSelectedCategoryId(category.id)}
                    onFocus={() => setSelectedCategoryId(category.id)}
                    className={cn(
                      'group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all',
                      isSelected
                        ? 'bg-white text-cyan-600 shadow-panel'
                        : 'text-on-surface-variant hover:bg-surface-container-high',
                    )}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold">
                      <MaterialIcon name={category.icon} className="text-xl" />
                      <span>{category.label}</span>
                    </span>
                      <MaterialIcon
                        name="chevron_right"
                        className={cn(
                          'text-base transition-opacity',
                          isSelected ? 'opacity-100' : 'opacity-30 group-hover:opacity-100',
                        )}
                      />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white p-7">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-heading font-black tracking-tight text-on-background">
                  {selectedCategory.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  {selectedCategory.description}
                </p>
              </div>
              <Link
                to={to}
                className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary"
              >
                {t('site.servicesDropdown.serviceCount', {
                  count: selectedCategory.services.length,
                })}
              </Link>
            </div>

            <div className="grid gap-3">
              {selectedCategory.services.map((service) => (
                <Link
                  key={service.name}
                  to={service.to}
                  className="group flex items-center gap-5 rounded-2xl border border-transparent bg-surface-container-low p-5 transition-all hover:border-outline-variant/10 hover:bg-surface-container-lowest hover:shadow-panel"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-colors group-hover:bg-primary-container">
                    <MaterialIcon
                      name={service.icon}
                      className="text-3xl text-primary transition-colors group-hover:text-on-primary-container"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-lg font-bold text-on-background">
                      {service.name}
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                      {service.description}
                    </p>
                  </div>
                  <span className="hidden items-center gap-1 text-sm font-extrabold uppercase tracking-[0.12em] text-primary opacity-0 transition-opacity group-hover:flex group-hover:opacity-100 xl:flex">
                    {t('site.servicesDropdown.view')}
                    <MaterialIcon name="arrow_forward" className="text-base" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
