import type { User } from '../types/user'
import { http } from './http'

export const userApi = {
  async list(): Promise<User[]> {
    const { data } = await http.get<User[]>('/users')
    return data
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/users/${id}`)
  }
}
