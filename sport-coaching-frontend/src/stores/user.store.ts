import { defineStore } from 'pinia'
import type { User } from '../types/user'
import { userApi } from '../services/userApi'

interface UserState {
  users: User[]
  isLoading: boolean
}

export const useUserStore = defineStore('users', {
  state: (): UserState => ({
    users: [],
    isLoading: false
  }),
  actions: {
    async fetchAll() {
      this.isLoading = true
      try {
        this.users = await userApi.list()
      } finally {
        this.isLoading = false
      }
    },
    async remove(id: number) {
      await userApi.remove(id)
      this.users = this.users.filter((u) => u.id !== id)
    }
  }
})
