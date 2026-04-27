import type { RoleName } from './role'

export interface User {
  id: number
  email: string
  role: RoleName
  createdAt: string
}
