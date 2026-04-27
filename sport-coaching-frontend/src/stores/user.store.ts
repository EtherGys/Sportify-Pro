import { defineStore } from 'pinia'
import type { User } from '../types/user'
import { userApi } from '../services/userApi'
import type { RoleName } from '../types/role'

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
    },
    async update(id: number, email: string, roleName: RoleName) {
     await userApi.update({id,  email, roleName })
    }
  }
})
