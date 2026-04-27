import type { AuthResponse } from '../types/auth'
import type { RoleName } from '../types/role'
import { http } from './http'

export interface RegisterPayload {
  email: string
  password: string
  roleName: RoleName
}

export interface LoginPayload {
  email: string
  password: string
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/register', payload)
    return data
  },
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/login', payload)
    return data
  }
}
