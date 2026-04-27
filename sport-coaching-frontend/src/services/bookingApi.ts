import type { Booking, BookingWithSession } from '../types/booking'
import { http } from './http'

export const bookingApi = {
  async listMine(): Promise<BookingWithSession[]> {
    const { data } = await http.get<BookingWithSession[]>('/bookings/me')
    return data
  },
  async book(sessionId: number): Promise<Booking> {
    const { data } = await http.post<Booking>(`/bookings/${sessionId}`)
    return data
  },
  async cancel(sessionId: number): Promise<void> {
    await http.delete(`/bookings/${sessionId}`)
  }
}
