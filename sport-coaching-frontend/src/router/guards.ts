import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import type { RoleName } from '../types/role'
import { useAuthStore } from '../stores/auth.store'

export type Guard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => void

export const authGuard: Guard = (to, _from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isHydrated) {
    authStore.hydrateFromStorage()
  }

  const requiresAuth = Boolean(to.meta.requiresAuth)
  if (!requiresAuth) {
    return next()
  }

  if (!authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  return next()
}

export const roleGuard: Guard = (to, _from, next) => {
  const authStore = useAuthStore()
  const allowed = (to.meta.roles ?? []) as RoleName[]
  if (!to.meta.requiresAuth) {
    return next()
  }

  if (allowed.length === 0) {
    return next()
  }

  const role = authStore.role
  if (!role || !allowed.includes(role)) {
    return next({ name: 'dashboard' })
  }

  return next()
}

export const applyGlobalGuards: Guard = (to, from, next) => {
  authGuard(to, from, (authResult?: unknown) => {
    if (authResult) return next(authResult as never)
    roleGuard(to, from, next)
  })
}
