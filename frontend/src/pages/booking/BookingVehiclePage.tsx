import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  createVehicleRequest,
  decodeVinRequest,
  ensureCurrentCustomerRequest,
  getBookingErrorMessage,
  getServiceCatalogItemsRequest,
  getVehiclesRequest,
  type CustomerDto,
  type ServiceCatalogItemDto,
  type VehicleDto,
} from '../../apis/bookingApi'
import { useAuth } from '../../features/auth/useAuth'
import { BookingMobileStepNav } from '../../features/booking/components/BookingMobileStepNav'
import { BookingProgressHeader } from '../../features/booking/components/BookingProgressHeader'
import { BookingSelectionSummary } from '../../features/booking/components/BookingSelectionSummary'
import {
  buildVehicleDetailsLabel,
  buildVehicleLabel,
  formatBookingDuration,
  formatStartingPrice,
  getSelectedCatalogItemIds,
  mapServiceTotal,
  resolveBookingOptionIcon,
} from '../../features/booking/lib/booking-api-helpers'
import {
  createBookingSearchParams,
  resolveBookingFlowState,
} from '../../features/booking/lib/booking-flow'
import { APP_ROUTES } from '../../shared/config/routes'
import { MaterialIcon } from '../../shared/ui/MaterialIcon'
import { SelectField } from '../../shared/ui/SelectField'
import { TextField } from '../../shared/ui/TextField'
import { DashboardShell } from '../../widgets/dashboard-shell/DashboardShell'

const vehicleYearOptions = Array.from({ length: 25 }, (_, index) => String(2026 - index))

function buildVehicleState(vehicle: VehicleDto) {
  return {
    selectedVehicleId: vehicle.id,
    vehicleVin: vehicle.vin,
    vehicleLicensePlate: vehicle.licensePlate,
    vehicleMake: vehicle.make,
    vehicleModel: vehicle.model,
    vehicleYear: String(vehicle.year),
    vehicleTrim: vehicle.trim ?? '',
    vehicleEngine: vehicle.engine ?? '',
  }
}

export function BookingVehiclePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { tokens, user } = useAuth()
  const accessToken = tokens?.accessToken
  const bookingState = useMemo(() => resolveBookingFlowState(searchParams), [searchParams])
  const [customer, setCustomer] = useState<CustomerDto | null>(null)
  const [vehicles, setVehicles] = useState<VehicleDto[]>([])
  const [catalogItems, setCatalogItems] = useState<ServiceCatalogItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDecodingVin, setIsDecodingVin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const selectedCatalogItemIdsKey =
    bookingState.kind === 'diagnostic'
      ? bookingState.selectedDiagnosticId
      : bookingState.selectedServiceIds.join(',')
  const selectedCatalogItemIds = useMemo(
    () => getSelectedCatalogItemIds(bookingState),
    [bookingState.kind, selectedCatalogItemIdsKey],
  )

  useEffect(() => {
    let isMounted = true

    async function loadPageData() {
      if (!user) {
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const currentCustomer = await ensureCurrentCustomerRequest(
          {
            userId: user.id,
            fullName: user.fullName,
            email: user.email,
          },
          accessToken,
        )
        const [vehiclesResult, services, diagnostics] = await Promise.all([
          getVehiclesRequest({ ownerCustomerId: currentCustomer.id }, accessToken),
          getServiceCatalogItemsRequest({ category: 0, isActive: true }, accessToken),
          getServiceCatalogItemsRequest({ category: 1, isActive: true }, accessToken),
        ])

        if (!isMounted) {
          return
        }

        setCustomer(currentCustomer)
        setVehicles(vehiclesResult.items)
        setCatalogItems([...services, ...diagnostics])

        const hasSelectedVehicle = bookingState.selectedVehicleId
          && vehiclesResult.items.some((vehicle) => vehicle.id === bookingState.selectedVehicleId)

        if (!hasSelectedVehicle && bookingState.selectedVehicleId) {
          updateManualVehicleState({
            vehicleVin: '',
            vehicleLicensePlate: '',
            vehicleMake: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleTrim: '',
            vehicleEngine: '',
          })
          setErrorMessage('The previously selected vehicle belongs to a different customer. Please choose or add a vehicle for this account.')
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getBookingErrorMessage(error, 'Unable to load your vehicles right now.'),
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPageData()

    return () => {
      isMounted = false
    }
  }, [accessToken, user])

  const selectedOptions = useMemo(
    () => catalogItems.filter((item) => selectedCatalogItemIds.includes(item.id)),
    [catalogItems, selectedCatalogItemIds],
  )
  const startingLaborFrom = selectedOptions.reduce((sum, option) => sum + mapServiceTotal(option), 0)
  const scheduledFor = bookingState.selectedSlotStartAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(bookingState.selectedSlotStartAt))
    : 'Select schedule first'
  const vehicleQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: bookingState.scheduleVisited,
  }).toString()
  const scheduleQuery = createBookingSearchParams(bookingState, {
    includeScheduleState: true,
  }).toString()
  const stepLinks = {
    services: `${APP_ROUTES.booking}?${vehicleQuery}`,
    schedule: `${APP_ROUTES.bookingSchedule}?${scheduleQuery}`,
    vehicle: `${APP_ROUTES.bookingVehicle}?${scheduleQuery}`,
    summary: `${APP_ROUTES.bookingSummary}?${scheduleQuery}`,
  }
  const summaryCardLinks = {
    service: stepLinks.services,
    'date-time': stepLinks.schedule,
    vehicle: stepLinks.vehicle,
    estimate: stepLinks.summary,
  }
  const selectedVehicleLabel =
    bookingState.vehicleMake || bookingState.vehicleModel
      ? `${bookingState.vehicleYear ? `${bookingState.vehicleYear} ` : ''}${bookingState.vehicleMake} ${bookingState.vehicleModel}`.trim()
      : undefined

  const updateBookingState = (
    partial: Partial<typeof bookingState>,
    includeScheduleState = bookingState.scheduleVisited,
  ) => {
    setSearchParams(
      createBookingSearchParams({ ...bookingState, ...partial }, { includeScheduleState }),
      { replace: true },
    )
  }

  const updateManualVehicleState = (partial: Partial<typeof bookingState>) => {
    updateBookingState({ ...partial, selectedVehicleId: '' })
  }

  const handleDecodeVin = async () => {
    const normalizedVin = bookingState.vehicleVin.trim().toUpperCase()

    if (!normalizedVin) {
      setErrorMessage('Enter a VIN before decoding.')
      return
    }

    setIsDecodingVin(true)
    setErrorMessage(null)

    try {
      const decoded = await decodeVinRequest(normalizedVin, accessToken)

      updateManualVehicleState({
        vehicleVin: decoded.vin,
        vehicleMake: decoded.make ?? bookingState.vehicleMake,
        vehicleModel: decoded.model ?? bookingState.vehicleModel,
        vehicleYear: decoded.year ? String(decoded.year) : bookingState.vehicleYear,
        vehicleTrim: decoded.trim ?? bookingState.vehicleTrim,
        vehicleEngine: decoded.engine ?? bookingState.vehicleEngine,
      })
    } catch (error) {
      setErrorMessage(getBookingErrorMessage(error, 'Unable to decode this VIN.'))
    } finally {
      setIsDecodingVin(false)
    }
  }

  const handleContinue = async () => {
    if (bookingState.selectedVehicleId) {
      navigate(stepLinks.summary)
      return
    }

    if (!customer) {
      setErrorMessage('Customer profile was not resolved for this account.')
      return
    }

    const normalizedVin = bookingState.vehicleVin.trim().toUpperCase()
    const normalizedPlate = bookingState.vehicleLicensePlate.trim().toUpperCase()
    const normalizedMake = bookingState.vehicleMake.trim()
    const normalizedModel = bookingState.vehicleModel.trim()
    const parsedYear = Number.parseInt(bookingState.vehicleYear, 10)

    if (!normalizedPlate || !normalizedVin || !normalizedMake || !normalizedModel || !Number.isFinite(parsedYear)) {
      setErrorMessage('License plate, VIN, make, model, and year are required.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const createdVehicle = await createVehicleRequest(
        {
          ownerCustomerId: customer.id,
          licensePlate: normalizedPlate,
          vin: normalizedVin,
          make: normalizedMake,
          model: normalizedModel,
          year: parsedYear,
          trim: bookingState.vehicleTrim.trim() || null,
          engine: bookingState.vehicleEngine.trim() || null,
          isDrivable: true,
        },
        accessToken,
      )

      setVehicles((current) => [createdVehicle, ...current])

      navigate(
        `${APP_ROUTES.bookingSummary}?${createBookingSearchParams(
          {
            ...bookingState,
            ...buildVehicleState(createdVehicle),
          },
          { includeScheduleState: true },
        ).toString()}`,
      )
    } catch (error) {
      setErrorMessage(
        getBookingErrorMessage(error, 'Unable to save the vehicle right now.'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell searchPlaceholder="Search service...">
      <div className="mx-auto max-w-7xl pb-24 pt-12">
        <BookingProgressHeader
          currentStep="vehicle"
          title="Vehicle Details"
          description="Select one of your vehicles or create a new one for this booking."
          stepLinks={stepLinks}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="space-y-8 rounded-xl bg-surface-container-lowest p-8 shadow-panel">
              {errorMessage ? (
                <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 text-sm text-error">
                  {errorMessage}
                </div>
              ) : null}

              <div className="relative">
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Saved Vehicles
                </label>
                {isLoading ? (
                  <div className="rounded-xl bg-surface-container-low px-5 py-4 text-sm text-on-surface-variant">
                    Loading your vehicles...
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="rounded-xl bg-surface-container-low px-5 py-4 text-sm text-on-surface-variant">
                    No saved vehicles found for this customer. Enter one manually below.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {vehicles.map((vehicle) => {
                      const isSelected = vehicle.id === bookingState.selectedVehicleId

                      return (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => updateBookingState(buildVehicleState(vehicle))}
                          className={[
                            'flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-all',
                            isSelected
                              ? 'bg-primary/10 ring-2 ring-primary/20'
                              : 'bg-surface-container-low hover:bg-surface-container',
                          ].join(' ')}
                        >
                          <div className="flex items-center gap-4">
                            <MaterialIcon name="directions_car" className="text-primary" />
                            <div>
                              <p className="font-bold leading-none text-slate-900">
                                {buildVehicleLabel(vehicle)}
                              </p>
                              <p className="mt-1 text-xs text-on-surface-variant">
                                {vehicle.licensePlate} | {vehicle.vin}
                              </p>
                              {buildVehicleDetailsLabel(vehicle) ? (
                                <p className="mt-1 text-xs text-on-surface-variant">
                                  {buildVehicleDetailsLabel(vehicle)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {isSelected ? (
                            <MaterialIcon name="check_circle" className="text-primary" />
                          ) : (
                            <MaterialIcon name="chevron_right" className="text-on-surface-variant" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-surface-container" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline-variant">
                  or enter manually
                </span>
                <div className="h-px flex-1 bg-surface-container" />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="vehicle-vin"
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  Vehicle VIN
                </label>
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <input
                      id="vehicle-vin"
                      type="text"
                      placeholder="17-digit VIN number"
                      value={bookingState.vehicleVin}
                      onChange={(event) =>
                        updateManualVehicleState({ vehicleVin: event.target.value.toUpperCase() })
                      }
                      className="w-full rounded-xl border border-transparent bg-surface-container-low px-5 py-4 pr-12 font-mono tracking-wider text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary/20 focus:bg-white focus:ring-2 focus:ring-primary/15"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center text-outline-variant">
                      <MaterialIcon name="qr_code_scanner" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDecodeVin()}
                    disabled={isDecodingVin}
                    className="rounded-xl bg-surface-container-highest px-8 py-4 font-bold text-primary transition-all hover:bg-primary-container hover:text-on-primary-container active:scale-95 disabled:opacity-60"
                  >
                    {isDecodingVin ? 'Decoding...' : 'Decode'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TextField
                  label="License Plate"
                  placeholder="e.g. AB1234"
                  value={bookingState.vehicleLicensePlate}
                  onChange={(event) =>
                    updateManualVehicleState({
                      vehicleLicensePlate: event.target.value.toUpperCase(),
                    })
                  }
                  inputClassName="px-5 py-4"
                />
                <TextField
                  label="Make"
                  placeholder="e.g. Tesla"
                  value={bookingState.vehicleMake}
                  onChange={(event) =>
                    updateManualVehicleState({ vehicleMake: event.target.value })
                  }
                  inputClassName="px-5 py-4"
                />
                <TextField
                  label="Model"
                  placeholder="e.g. Model 3"
                  value={bookingState.vehicleModel}
                  onChange={(event) =>
                    updateManualVehicleState({ vehicleModel: event.target.value })
                  }
                  inputClassName="px-5 py-4"
                />

                <label className="flex flex-col gap-1.5">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Year
                  </span>
                  <SelectField
                    value={bookingState.vehicleYear}
                    onChange={(event) =>
                      updateManualVehicleState({ vehicleYear: event.target.value })
                    }
                    className="px-5 py-4"
                  >
                    <option value="">Select Year</option>
                    {vehicleYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </SelectField>
                </label>

                <TextField
                  label="Trim"
                  placeholder="e.g. Performance"
                  value={bookingState.vehicleTrim}
                  onChange={(event) =>
                    updateManualVehicleState({ vehicleTrim: event.target.value })
                  }
                  inputClassName="px-5 py-4"
                />
                <TextField
                  label="Engine"
                  placeholder="e.g. Dual Motor"
                  value={bookingState.vehicleEngine}
                  onChange={(event) =>
                    updateManualVehicleState({ vehicleEngine: event.target.value })
                  }
                  inputClassName="px-5 py-4"
                />
              </div>

              <div className="relative mt-10 h-48 overflow-hidden rounded-xl">
                <img
                  alt="Detailed engine compartment"
                  className="h-full w-full object-cover grayscale contrast-125 opacity-20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCij54XDVkZxmC2GcSeiggqcdB_a45sR-jW9w5-F0-rMIZ3TxNa7vIskjPc9HViP2dhtRBeUQ20CTbjPXE1kzOYajdqZnefz7P3Exi9IxBOodPPsoDTpp2sqAcIysXOeMEF85nYw2-PN40Al_x1pKf48dI_2YWS6wxwCv8KLkJxb2Q-QZNFvRKoOHYzmdLZ9g0RWeQXu5v1vJXXzRmhcJZ63FqV-cVcZ1kQ7uC1VYZnvF9xC78OoUbbilMHEzavgQeKBMMbIZlTdM0D"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MaterialIcon name="verified_user" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">VIN Verification</p>
                    <p className="text-xs text-on-surface-variant">
                      Vehicle data is now resolved against the backend decode endpoint.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-xl border border-white bg-surface-container-lowest shadow-xl shadow-slate-200/50">
                <div className="bg-slate-900 p-6 text-white">
                  <h3 className="font-headline text-lg font-bold">Booking Summary</h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                    Live estimate before quote
                  </p>
                </div>

                <div className="space-y-6 p-6">
                  <div className="space-y-4">
                    {selectedOptions.map((option) => (
                      <div key={option.id} className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <MaterialIcon
                            name={resolveBookingOptionIcon(option.name, option.category)}
                            className="text-xl text-primary"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{option.name}</p>
                            <p className="text-xs text-on-surface-variant">
                              {formatBookingDuration(option.estimatedDuration)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">
                          {formatStartingPrice(mapServiceTotal(option))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-surface-container" />

                  <div className="flex items-center gap-4 rounded-lg bg-surface-container-low p-4">
                    <div className="rounded-lg bg-white p-2 shadow-sm">
                      <MaterialIcon name="calendar_today" className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Scheduled For
                      </p>
                      <p className="font-bold text-slate-900">{scheduledFor}</p>
                    </div>
                  </div>

                  <hr className="border-surface-container" />

                  <div className="space-y-3">
                    <div className="rounded-xl bg-surface-container-low px-4 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Starting labor from
                      </p>
                      <p className="mt-2 text-2xl font-black leading-none text-primary">
                        {formatStartingPrice(startingLaborFrom)}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-on-surface-variant">
                      This is the service-only starting price. Parts are not included here and will be added later by the mechanic after inspection.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleContinue()}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-5 text-lg font-extrabold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] hover:bg-primary-dim disabled:opacity-60"
                  >
                    {isSubmitting ? 'Saving vehicle...' : 'Continue to Summary'}
                    <MaterialIcon name="arrow_forward" />
                  </button>

                  <p className="text-center text-[10px] leading-relaxed text-on-surface-variant">
                    This is a starting labor view only. Final repair scope and parts are approved later from the dashboard.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4 rounded-xl border border-surface-container p-4">
                <MaterialIcon name="support_agent" className="text-on-surface-variant" />
                <div>
                  <p className="text-sm font-bold">Need assistance?</p>
                  <p className="text-xs text-on-surface-variant">Speak with a service advisor</p>
                </div>
                <button type="button" className="ml-auto text-sm font-bold text-primary">
                  Chat
                </button>
              </div>
            </div>
          </aside>
        </div>

        <BookingSelectionSummary
          selectedDate={bookingState.selectedDate}
          selectedDateLabel={scheduledFor}
          selectedSlotId={bookingState.selectedSlotId}
          selectedServiceLabel={
            selectedOptions.length <= 1
              ? selectedOptions[0]?.name
              : `${selectedOptions[0]?.name ?? 'Service'} +${selectedOptions.length - 1} more`
          }
          selectedVehicleLabel={selectedVehicleLabel}
          activeCardId="vehicle"
          cardLinks={summaryCardLinks}
        />
      </div>

      <BookingMobileStepNav currentStep="vehicle" stepLinks={stepLinks} />
    </DashboardShell>
  )
}
