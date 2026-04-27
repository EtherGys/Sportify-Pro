<script setup lang="ts">
import CoachCalendar from '../../components/CoachCalendar.vue';
import AppLayout from '../../layouts/AppLayout.vue'
import type { Session } from '../../types/session';
import { useSessionStore } from '../../stores/session.store'
import { onMounted, ref } from 'vue'

const sessionStore = useSessionStore()
const selectedSession = ref<Session | null>(null)
const isModalOpen = ref(false)

function openModal(session: Session) {
  selectedSession.value = session
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedSession.value = null
}

async function fetch() {
  await sessionStore.fetchMine()
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50"
      @click.self="closeModal">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900">Détail de la séance</h2>
          <button class="text-slate-500 hover:text-slate-900" @click="closeModal">
            ✕
          </button>
        </div>
        <div v-if="selectedSession" class="mt-4 space-y-3">
          <div>
            <p class="text-xs text-slate-500">Titre</p>
            <p class="font-semibold text-slate-900">
              {{ selectedSession.title }}
            </p>
          </div>
          <div v-if="selectedSession.description">
            <p class="text-xs text-slate-500">Description</p>
            <p class="text-sm text-slate-700">
              {{ selectedSession.description }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Date</p>
            <p class="text-sm text-slate-700">
              {{ new Date(selectedSession.date).toLocaleString('fr-FR') }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Durée</p>
            <p class="text-sm text-slate-700">
              {{ selectedSession.duration ?? 0 }} min
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500">Participants max</p>
            <p class="text-sm text-slate-700">
              {{ selectedSession.maxParticipants }}
            </p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            @click="closeModal">
            Fermer
          </button>
        </div>
      </div>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Bienvenu sur le dashboard de votre compte Coach</h1>
      <p class="mt-2 text-sm text-slate-600">Gérer vos séances et consulter les participants.</p>
      <RouterLink class="mt-4 inline-block font-semibold text-indigo-600 hover:underline"
        :to="{ name: 'coach.manageSessions' }">
        Voir mes séances
      </RouterLink>
    </div>
    <CoachCalendar :sessions="sessionStore.items" @select="openModal" />
  </AppLayout>
</template>
