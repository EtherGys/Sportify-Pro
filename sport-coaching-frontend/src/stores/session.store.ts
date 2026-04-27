import { defineStore } from 'pinia'
import type { PaginatedResponse, Session } from '../types/session'
import { sessionApi, type SessionInput, type SessionSearchParams } from '../services/sessionApi'

interface SessionState {
  items: Session[]
  pagination: PaginatedResponse<Session>['pagination'] | null
  isLoading: boolean
}

export const useSessionStore = defineStore('sessions', {
  state: (): SessionState => ({
    items: [],
    pagination: null,
    isLoading: false
  }),
  actions: {
    async fetch(params: SessionSearchParams) {
      this.isLoading = true
      try {
        const result = await sessionApi.list(params)
        this.items = result.items
        this.pagination = result.pagination
      } finally {
        this.isLoading = false
      }
    },
     async fetchMine() {
          this.isLoading = true
          try {
            this.items = await sessionApi.listMine()
          } finally {
            this.isLoading = false
          }
        },
    async create(payload: SessionInput) {
      const created = await sessionApi.create(payload)
      this.items = [created, ...this.items]
      return created
    },
    async update(id: number, payload: Partial<SessionInput>) {
      const updated = await sessionApi.update(id, payload)
      this.items = this.items.map((s) => (s.id === updated.id ? updated : s))
      return updated
    },
    async remove(id: number) {
      await sessionApi.remove(id)
      this.items = this.items.filter((s) => s.id !== id)
    }
  }
})
