import { defineStore } from 'pinia'
import { bookingApi } from '../services/bookingApi'
import type { BookingWithSession } from '../types/booking'

interface BookingState {
  isLoading: boolean
  myBookings: BookingWithSession[]
}

export const useBookingStore = defineStore('bookings', {
  state: (): BookingState => ({
    isLoading: false,
    myBookings: []
  }),
  actions: {
    async fetchMine() {
      this.isLoading = true
      try {
        this.myBookings = await bookingApi.listMine()
      } finally {
        this.isLoading = false
      }
    },
    async book(sessionId: number) {
      this.isLoading = true
      try {
        const created = await bookingApi.book(sessionId)
        await this.fetchMine()
        return created
      } finally {
        this.isLoading = false
      }
    },
    async cancel(sessionId: number) {
      this.isLoading = true
      try {
        await bookingApi.cancel(sessionId)
        await this.fetchMine()
      } finally {
        this.isLoading = false
      }
    }
  }
})
