import { defineStore } from 'pinia'
import type { AuthUser } from '../types/auth'
import { authApi } from '../services/authApi'
import { tokenStorage } from '../utils/tokenStorage'
import type { RoleName } from '../types/role'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isHydrated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    isHydrated: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    role: (state) => state.user?.role ?? null
  },
  actions: {
    hydrateFromStorage() {
      const token = tokenStorage.getToken()
      const rawUser = tokenStorage.getRawUser()
      if (token && rawUser) {
        try {
          this.token = token
          this.user = JSON.parse(rawUser) as AuthUser
        } catch {
          tokenStorage.clearAll()
          this.token = null
          this.user = null
        }
      }
      this.isHydrated = true
    },
    async login(email: string, password: string) {
      const result = await authApi.login({ email, password })
      this.token = result.token
      this.user = result.user
      tokenStorage.setToken(result.token)
      tokenStorage.setRawUser(JSON.stringify(result.user))
    },
    async register(email: string, password: string, roleName: RoleName) {
      const result = await authApi.register({ email, password, roleName })
      this.token = result.token
      this.user = result.user
      tokenStorage.setToken(result.token)
      tokenStorage.setRawUser(JSON.stringify(result.user))
    },
    logout() {
      tokenStorage.clearAll()
      this.token = null
      this.user = null
    }
  }
})
