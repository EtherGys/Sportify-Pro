<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import { sessionApi } from '../../services/sessionApi'

const route = useRoute()
const toast = useToast()

const participants = ref<Array<{ bookingId: number; userId: number; email: string }>>([])
const isLoading = ref(false)

async function fetch() {
  isLoading.value = true
  try {
    const sessionId = Number(route.params.id)
    participants.value = await sessionApi.participants(sessionId)
  } catch {
    toast.error('Failed to load participants')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Participants</h1>
      <p class="mt-2 text-sm text-slate-600">Voici tous les participants pour cette session :</p>

      <div v-if="isLoading" class="mt-4 text-sm text-slate-600">Loading...</div>

      <ul v-else class="mt-4 space-y-2">
        <li
          v-for="p in participants"
          :key="p.bookingId"
          class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <div class="font-semibold text-slate-900">{{ p.email }}</div>
          <div class="text-slate-600">User ID: {{ p.userId }}</div>
        </li>
        <li v-if="participants.length === 0" class="text-sm text-slate-600">No participants yet.</li>
      </ul>
    </div>
  </AppLayout>
</template>
