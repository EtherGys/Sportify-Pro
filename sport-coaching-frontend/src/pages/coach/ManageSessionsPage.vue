<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import SessionCard from '../../components/SessionCard.vue'
import SessionForm from '../../components/SessionForm.vue'
import { useSessionStore } from '../../stores/session.store'

const toast = useToast()
const sessionStore = useSessionStore()

const isCreating = ref(false)

async function fetch() {
  await sessionStore.fetchMine()
}

async function onCreate(payload: {
  title: string
  description?: string
  date: string
  duration?: number
  maxParticipants: number
}) {
  isCreating.value = true
  try {
    await sessionStore.create(payload)
    toast.success('Séance créée')
  } catch {
    toast.error('Erreur lors de la création de la séance')
  } finally {
    isCreating.value = false
  }
}

async function onDelete(id: number) {
  try {
    await sessionStore.remove(id)
    toast.success('Séance supprimée')
  } catch {
    toast.error('Erreur lors de la suppression de la séance')
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-xl font-bold text-slate-900">Créer une séance</h1>
        <p class="mt-1 text-sm text-slate-600">Vous pouvez créer une séance de laquelle vous serez le coach.</p>
        <div class="mt-4">
          <SessionForm submit-label="Créer" :is-loading="isCreating" @submit="onCreate" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Mes séances</h2>
          <p class="mt-1 text-sm text-slate-600">
            Toutes mes séances
          </p>
        </div>

        <SessionCard v-for="s in sessionStore.items" :key="s.id" :session="s">
          <template #actions>
            <div class="flex flex-wrap gap-2">
              <RouterLink
                class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                :to="{ name: 'coach.participants', params: { id: s.id } }"
              >
                Participants
              </RouterLink>
              <button
                type="button"
                class="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                @click="onDelete(s.id)"
              >
                Supprimer
              </button>
            </div>
          </template>
        </SessionCard>

        <div v-if="sessionStore.items.length === 0" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Pas encore de séances à afficher.
        </div>
      </div>
    </div>
  </AppLayout>
</template>
