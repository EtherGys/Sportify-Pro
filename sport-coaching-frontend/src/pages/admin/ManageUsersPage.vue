<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import { useUserStore } from '../../stores/user.store'

const toast = useToast()
const userStore = useUserStore()

async function fetch() {
  try {
    await userStore.fetchAll()
  } catch {
    toast.error('Failed to load users')
  }
}

async function onDelete(id: number) {
  try {
    await userStore.remove(id)
    toast.success('Utilisateur supprimé')
  } catch {
    toast.error("Une erreur s'est produite lors de la suppression d'un utilisateur")
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Gestion des utilisateurs</h1>
      <p class="mt-2 text-sm text-slate-600">Gérer les comptes utilisateurs.</p>

      <div v-if="userStore.isLoading" class="mt-4 text-sm text-slate-600">En cours...</div>

      <div v-else class="mt-4 space-y-2">
        <div
          v-for="u in userStore.users"
          :key="u.id"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <div>
            <div class="font-semibold text-slate-900">{{ u.email }}</div>
            <div class="text-slate-600">Rôle : {{ u.role }}</div>
          </div>
          <button
            class="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
            type="button"
            @click="onDelete(u.id)"
          >
            Supprimer
          </button>
        </div>

        <div v-if="userStore.users.length === 0" class="text-sm text-slate-600">Pas encore d'utilisateurs.</div>
      </div>
    </div>
  </AppLayout>
</template>
