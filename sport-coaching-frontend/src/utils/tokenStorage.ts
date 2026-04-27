const TOKEN_KEY = 'sportCoaching.jwt'
const USER_KEY = 'sportCoaching.user'

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  },
  getRawUser(): string | null {
    return localStorage.getItem(USER_KEY)
  },
  setRawUser(userJson: string): void {
    localStorage.setItem(USER_KEY, userJson)
  },
  clearRawUser(): void {
    localStorage.removeItem(USER_KEY)
  },
  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}
