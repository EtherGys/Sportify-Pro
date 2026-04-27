<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { Role } from '../types/role'

const authStore = useAuthStore()
const router = useRouter()

const role = computed(() => authStore.user?.role ?? null)

const links = computed(() => {
  if (!authStore.isAuthenticated) {
    return [
      { name: 'Connexion', to: { name: 'login' } },
      { name: 'Inscription', to: { name: 'register' } }
    ]
  }

  if (role.value === Role.CLIENT) {
    return [
      { name: 'Dashboard', to: { name: 'dashboard' } },
      { name: 'Séances', to: { name: 'client.sessions' } },
      { name: 'Mes réservations', to: { name: 'client.bookings' } }
    ]
  }

  if (role.value === Role.COACH) {
    return [
      { name: 'Dashboard', to: { name: 'coach.dashboard' } },
      { name: 'Gérer mes séances', to: { name: 'coach.manageSessions' } }
    ]
  }

  return [
    { name: 'Dashboard', to: { name: 'admin.dashboard' } },
    { name: 'Utilisateurs', to: { name: 'admin.users' } },
    { name: 'Séances', to: { name: 'admin.sessions' } }
  ]
})

async function onLogout() {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-indigo-600 m-auto text-center pt-1 text-white">S</div>
        <div class="leading-tight">
          <div class="text-sm font-semibold text-slate-900">Sportify Pro</div>
          <div class="text-xs text-slate-500" v-if="authStore.user">
            {{ authStore.user.email }} · {{ authStore.user.role }}
          </div>
        </div>
      </div>

      <nav class="flex items-center gap-2">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {{ link.name }}
        </RouterLink>

        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          @click="onLogout"
        >
          Déconnexion
        </button>
      </nav>
    </div>
  </header>
</template>
