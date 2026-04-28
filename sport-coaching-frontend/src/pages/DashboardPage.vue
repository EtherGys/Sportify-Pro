<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth.store'
import { Role } from '../types/role'

const authStore = useAuthStore()

const role = computed(() => authStore.user?.role ?? null)
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p class="mt-2 text-slate-600">Vous êtes connecté en tant que <span class="font-semibold">{{ role }}</span>.</p>

      <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <RouterLink
          v-if="role === Role.CLIENT"
          :to="{ name: 'client.sessions' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Rechercher une séance</div>
          <div class="text-sm text-slate-600">Trouvez et réservez une séance de sport</div>
        </RouterLink>

        <RouterLink
          v-if="role === Role.CLIENT"
          :to="{ name: 'client.bookings' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Mes réservations</div>
          <div class="text-sm text-slate-600">Gérer vos séances réservées</div>
        </RouterLink>

        <RouterLink
          v-if="role === Role.COACH"
          :to="{ name: 'coach.dashboard' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Voir mon planning</div>
          <div class="text-sm text-slate-600">Consulter votre planning de la semaine et le détails des séances</div>
        </RouterLink>
        <RouterLink
          v-if="role === Role.COACH"
          :to="{ name: 'coach.manageSessions' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Gérer mes séances</div>
          <div class="text-sm text-slate-600">Créez ou mettez à jour une séance</div>
        </RouterLink>

        <RouterLink
          v-if="role === Role.ADMIN"
          :to="{ name: 'admin.users' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Gérer les utilisateurs</div>
          <div class="text-sm text-slate-600">Listez et gérer les différents utilisateurs</div>
        </RouterLink>

        <RouterLink
          v-if="role === Role.ADMIN"
          :to="{ name: 'admin.sessions' }"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
        >
          <div class="text-sm font-semibold text-slate-900">Gérer les séances proposées</div>
          <div class="text-sm text-slate-600">Créer, mettez à jour toutes les séances</div>
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>
