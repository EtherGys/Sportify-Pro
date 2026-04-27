import type { RoleName } from './role'

export interface AuthUser {
  id: number
  email: string
  role: RoleName
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
