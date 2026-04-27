import type { PaginatedResponse, Session } from '../types/session'
import { http } from './http'

export interface SessionSearchParams {
  page: number
  limit: number
  search?: string
}

export interface SessionInput {
  title: string
  description?: string
  date: string
  duration?: number
  maxParticipants: number
  coachId?: number
}

export const sessionApi = {
  async list(params: SessionSearchParams): Promise<PaginatedResponse<Session>> {
    const { data } = await http.get<PaginatedResponse<Session>>('/sessions', { params })
    return data
  },
  async create(payload: SessionInput): Promise<Session> {
    const { data } = await http.post<Session>('/sessions', payload)
    return data
  },
  async update(id: number, payload: Partial<SessionInput>): Promise<Session> {
    const { data } = await http.patch<Session>(`/sessions/${id}`, payload)
    return data
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/sessions/${id}`)
  },
  async participants(id: number): Promise<Array<{ bookingId: number; userId: number; email: string }>> {
    const { data } = await http.get<Array<{ bookingId: number; userId: number; email: string }>>(
      `/sessions/${id}/participants`
    )
    return data
  },
  async assignCoach(id: number, coachId: number): Promise<Session> {
    const { data } = await http.patch<Session>(`/sessions/${id}/assign-coach`, { coachId })
    return data
  },
   async listMine(): Promise<Session[]> {
      const { data } = await http.get<Session[]>('/sessions/mine')
      return data
    },
}
