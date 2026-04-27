import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { applyGlobalGuards } from './guards'
import { Role, type RoleName } from '../types/role'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'dashboard' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/DashboardPage.vue'),
    meta: { requiresAuth: true, roles: [Role.ADMIN, Role.COACH, Role.CLIENT] satisfies RoleName[] }
  },
  {
    path: '/client/sessions',
    name: 'client.sessions',
    component: () => import('../pages/client/SessionListPage.vue'),
    meta: { requiresAuth: true, roles: [Role.CLIENT] satisfies RoleName[] }
  },
  {
    path: '/client/bookings',
    name: 'client.bookings',
    component: () => import('../pages/client/MyBookingsPage.vue'),
    meta: { requiresAuth: true, roles: [Role.CLIENT] satisfies RoleName[] }
  },
  {
    path: '/coach',
    name: 'coach.dashboard',
    component: () => import('../pages/coach/CoachDashboardPage.vue'),
    meta: { requiresAuth: true, roles: [Role.COACH] satisfies RoleName[] }
  },
  {
    path: '/coach/sessions',
    name: 'coach.manageSessions',
    component: () => import('../pages/coach/ManageSessionsPage.vue'),
    meta: { requiresAuth: true, roles: [Role.COACH] satisfies RoleName[] }
  },
  {
    path: '/coach/sessions/:id/participants',
    name: 'coach.participants',
    component: () => import('../pages/coach/SessionParticipantsPage.vue'),
    meta: { requiresAuth: true, roles: [Role.COACH] satisfies RoleName[] }
  },
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('../pages/admin/AdminDashboardPage.vue'),
    meta: { requiresAuth: true, roles: [Role.ADMIN] satisfies RoleName[] }
  },
  {
    path: '/admin/users',
    name: 'admin.users',
    component: () => import('../pages/admin/ManageUsersPage.vue'),
    meta: { requiresAuth: true, roles: [Role.ADMIN] satisfies RoleName[] }
  },
  {
    path: '/admin/sessions',
    name: 'admin.sessions',
    component: () => import('../pages/admin/ManageAllSessionsPage.vue'),
    meta: { requiresAuth: true, roles: [Role.ADMIN] satisfies RoleName[] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../pages/NotFoundPage.vue'),
    meta: { requiresAuth: false }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(applyGlobalGuards)

export default router
