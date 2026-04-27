import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../stores/auth.store'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api',
  timeout: 15_000
})

http.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const authStore = useAuthStore()
    if (error.response?.status === 401) {
      authStore.logout()
    }
    return Promise.reject(error)
  }
)
