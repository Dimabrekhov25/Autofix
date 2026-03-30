function padMonth(value: number) {
  return String(value).padStart(2, '0')
}

export function getCurrentBookingMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${padMonth(now.getMonth() + 1)}`
}

export function parseBookingMonthKey(monthKey: string) {
  const [yearPart, monthPart] = monthKey.split('-')
  const year = Number.parseInt(yearPart ?? '', 10)
  const month = Number.parseInt(monthPart ?? '', 10)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    const fallback = new Date()
    return { year: fallback.getFullYear(), monthIndex: fallback.getMonth() }
  }

  return { year, monthIndex: month - 1 }
}

export function formatBookingMonthLabel(monthKey: string) {
  const { year, monthIndex } = parseBookingMonthKey(monthKey)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, monthIndex, 1))
}

export function formatBookingDateLabel(monthKey: string, day: number, timeLabel?: string) {
  const { year, monthIndex } = parseBookingMonthKey(monthKey)
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(year, monthIndex, day))

  return timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel
}

export function shiftBookingMonth(monthKey: string, offset: number) {
  const { year, monthIndex } = parseBookingMonthKey(monthKey)
  return `${new Date(year, monthIndex + offset, 1).getFullYear()}-${padMonth(
    new Date(year, monthIndex + offset, 1).getMonth() + 1
  )}`
}

export function getBookingMonthDayCount(monthKey: string) {
  const { year, monthIndex } = parseBookingMonthKey(monthKey)
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function clampBookingDay(monthKey: string, day: number) {
  return Math.min(Math.max(day, 1), getBookingMonthDayCount(monthKey))
}

export function getFirstAvailableBookingDay(monthKey: string, fromDay = 1) {
  const daysInMonth = getBookingMonthDayCount(monthKey)

  for (let day = Math.max(1, fromDay); day <= daysInMonth; day += 1) {
    if (isBookingDateAvailable(monthKey, day)) {
      return day
    }
  }

  for (let day = 1; day < Math.max(1, fromDay); day += 1) {
    if (isBookingDateAvailable(monthKey, day)) {
      return day
    }
  }

  return 1
}

export function isBookingDateAvailable(monthKey: string, day: number) {
  const { year, monthIndex } = parseBookingMonthKey(monthKey)
  const candidate = new Date(year, monthIndex, day)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekday = candidate.getDay()

  if (candidate < startOfToday) {
    return false
  }

  return weekday !== 0
}
