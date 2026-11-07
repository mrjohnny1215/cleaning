export type BookingStatus = 'new' | 'contacted' | 'completed' | 'cancelled'

export type BookingItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

export type Booking = {
  id: string
  createdAt: string
  name: string
  phone: string
  region: string
  visitDate: string | null
  items: BookingItem[]
  estimatedTotal: number
  status: BookingStatus
}

const STORAGE_KEY = 'care-home-bookings-v1'

function canUseStorage() {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage)
  } catch {
    return false
  }
}

export function getBookings(): Booking[] {
  if (!canUseStorage()) return []
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? (parsed as Booking[]).filter((item) => item && typeof item.id === 'string') : []
  } catch {
    return []
  }
}

export function saveBooking(input: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking {
  const booking: Booking = {
    ...input,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  }
  const bookings = getBookings()
  bookings.unshift(booking)
  if (!canUseStorage()) throw new Error('브라우저 저장소를 사용할 수 없습니다.')
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  return booking
}

export function setBookingStatus(id: string, status: BookingStatus): Booking[] {
  const updated = getBookings().map((booking) => booking.id === id ? { ...booking, status } : booking)
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function removeBooking(id: string): Booking[] {
  const updated = getBookings().filter((booking) => booking.id !== id)
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
