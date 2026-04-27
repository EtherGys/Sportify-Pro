import type { Booking } from "./booking"
import type { User } from "./user"

export interface Session {
  id: number
  title: string
  description?: string | null
  date: string
  duration?: number | null
  maxParticipants: number
  coachId: number,
  coach: Coach,
  bookings : Booking[]
}

export interface Coach {
  id: number
  user: User
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}
