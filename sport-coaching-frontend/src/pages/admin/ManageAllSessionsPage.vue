<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import SessionCard from '../../components/SessionCard.vue'
import { useSessionStore } from '../../stores/session.store'
import type { Session } from '../../types/session'

const toast = useToast()
const isModalOpen = ref(false)
const sessionStore = useSessionStore()
const selectedSession = ref<Session>()
const form = ref({
  title: '',
  description: '',
  date: '',
  duration: 0,
  maxParticipants: 0,
})

async function fetch() {
  await sessionStore.fetch({ page: 1, limit: 30 })
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
    <div class="grid grid-cols-1 gap-6 md:grid-cols-1">
      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Gestion des séances</h2>
          <p class="mt-1 text-sm text-slate-600">Vous pouvez modifier et consulter une séance de
            sport.</p>
        </div>
        <SessionCard v-for="s in sessionStore.items" :key="s.id" :session="s">
          <template #actions>
            <div class="text-xs text-slate-600">
              Coach : <span class="font-semibold">{{ s.coach.user.email }}</span>
            </div>
            <div class="text-xs text-slate-600">
              Nombre de participants actuels : <span class="font-semibold">{{ s.bookings.length }}</span>
            </div>
            <div>
              <button
                class="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 m-2"
                type="button" @click="openModal(s)">
                Modifier
              </button>
            </div>
          </template>
        </SessionCard>
      </div>
    </div>
  </AppLayout>
</template>
