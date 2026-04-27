export interface Booking {
  id: number
  userId: number
  sessionId: number
  createdAt: string
}

export interface BookingWithSession extends Booking {
  session: {
    id: number
    title: string
    description?: string | null
    date: string
    duration?: number | null
    maxParticipants: number
    coachId: number
  }
}
