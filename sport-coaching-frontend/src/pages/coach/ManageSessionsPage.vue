<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import SessionCard from '../../components/SessionCard.vue'
import SessionForm from '../../components/SessionForm.vue'
import { useSessionStore } from '../../stores/session.store'
import type { Session } from '../../types/session'

const toast = useToast()
const sessionStore = useSessionStore()
const isModalOpen = ref(false)

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
const selectedSession = ref<Session>()
const form = ref({
  title: '',
  description: '',
  date: '',
  duration: 0,
  maxParticipants: 0,
})

async function onDelete(id: number) {
  try {
    await sessionStore.remove(id)
    toast.success('Séance supprimée')
  } catch {
    toast.error('Erreur lors de la suppression de la séance')
  }
}

async function submitUpdate() {
  if (!selectedSession.value) return

  try {

    const payload = {
      ...form.value,
      date: new Date(form.value.date).toISOString(),
    }
    await sessionStore.update(selectedSession.value.id, payload)

    toast.success('Session modifiée')
    isModalOpen.value = false
  } catch {
    toast.error("Erreur lors de la mise à jour")
  }
}

function openModal(session: Session) {
  selectedSession.value = session

  form.value = {
    title: session.title,
    description: session.description ?? '',
    date: session.date,
    duration: session.duration ?? 0,
    maxParticipants: session.maxParticipants,
  }

  isModalOpen.value = true
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded-xl w-96">
        <h2 class="text-lg font-bold mb-4">Modifier la session</h2>
        <label class="block text-xs font-semibold text-slate-700">Nom</label>
        <input v-model="form.title" class="w-full mb-2 p-2 border rounded" placeholder="Titre" />
        <label class="block text-xs font-semibold text-slate-700">Description</label>
        <textarea v-model="form.description" class="w-full mb-2 p-2 border rounded" placeholder="Description" />

        <label class="block text-xs font-semibold text-slate-700">Date</label>
        <input v-model="form.date" type="datetime-local" class="w-full mb-2 p-2 border rounded" />

        <label class="block text-xs font-semibold text-slate-700">Durée</label>
        <input v-model="form.duration" type="number" class="w-full mb-2 p-2 border rounded" placeholder="Durée (min)" />

        <label class="block text-xs font-semibold text-slate-700">Nbr max de participants</label>
        <input v-model="form.maxParticipants" type="number" class="w-full mb-2 p-2 border rounded"
          placeholder="Max participants" />
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-3 py-2 bg-gray-300 rounded" @click="isModalOpen = false">
            Annuler
          </button>
          <button class="px-3 py-2 bg-indigo-600 text-white rounded" @click="submitUpdate">
            Valider
          </button>
        </div>
      </div>
    </div>
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
              <button type="button"
                class="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                @click="openModal(s)">
                Modifier
              </button>
              <button type="button"
                class="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                @click="onDelete(s.id)">
                Supprimer
              </button>
              <RouterLink class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                :to="{ name: 'coach.participants', params: { id: s.id } }">
                Voir les participants
              </RouterLink>
            </div>
          </template>
        </SessionCard>
        <div v-if="sessionStore.items.length === 0"
          class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Pas encore de séances à afficher.
        </div>
      </div>
    </div>
  </AppLayout>
</template>
