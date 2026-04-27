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
  await sessionStore.fetch({ page: 1, limit: 30 })
}

async function onCreate(payload: {
  title: string
  description?: string
  date: string
  duration?: number
  maxParticipants: number
  coachId?: number
}) {
  isCreating.value = true
  try {
    await sessionStore.create(payload)
    toast.success('Session created')
  } catch {
    toast.error('Create failed')
  } finally {
    isCreating.value = false
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-xl font-bold text-slate-900">Créer une séance</h1>
        <p class="mt-1 text-sm text-slate-600">Un administrateur peut créer une séance et lui assigner un coach.</p>
        <div class="mt-4">
          <SessionForm submit-label="Créer" :is-loading="isCreating" show-coach-id @submit="onCreate" />
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-slate-900">Gestion des séances</h2>
          <p class="mt-1 text-sm text-slate-600">Vous pouvez modifier, supprimer ou réassigner le coach d'une séance de sport.</p>
        </div>

        <SessionCard v-for="s in sessionStore.items" :key="s.id" :session="s">
          <template #actions>
            <div class="text-xs text-slate-600">
              Coach : <span class="font-semibold">{{ s.coach.user.email }}</span>
            </div>
            <div class="text-xs text-slate-600">
              Nombre de participants actuels : <span class="font-semibold">{{ s.bookings.length }}</span>
            </div>
          </template>
        </SessionCard>
      </div>
    </div>
  </AppLayout>
</template>
