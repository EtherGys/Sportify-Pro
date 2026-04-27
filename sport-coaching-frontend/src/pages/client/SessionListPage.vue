<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import SessionCard from '../../components/SessionCard.vue'
import BookingButton from '../../components/BookingButton.vue'
import { useSessionStore } from '../../stores/session.store'
import { useBookingStore } from '../../stores/booking.store'

const toast = useToast()
const sessionStore = useSessionStore()
const bookingStore = useBookingStore()

const page = ref(1)
const limit = ref(10)
const search = ref('')

const total = computed(() => sessionStore.pagination?.total ?? 0)
const bookedSessionIds = computed(() => new Set(bookingStore.myBookings.map((b) => b.sessionId)))

async function fetch() {
  await Promise.all([
    sessionStore.fetch({ page: page.value, limit: limit.value, search: search.value || undefined }),
    bookingStore.fetchMine()
  ])
}

async function onToggleBooking(sessionId: number) {
  try {
    if (bookedSessionIds.value.has(sessionId)) {
      await bookingStore.cancel(sessionId)
      toast.success('Réservation annulée')
    } else {
      await bookingStore.book(sessionId)
      toast.success('Séance réservée')
    }
  } catch {
    toast.error('Une erreur est survenue')
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Séances</h1>
          <p class="text-sm text-slate-600">Recherchez et réservez une séance.</p>
        </div>

        <div class="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            v-model="search"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm md:w-64"
            placeholder="Recherche (titre, description)"
            @keyup.enter="fetch"
          />
          <button class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" @click="fetch">
            Rechercher
          </button>
        </div>
      </div>

      <div v-if="sessionStore.isLoading" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Recherche en cours...
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <SessionCard v-for="s in sessionStore.items" :key="s.id" :session="s">
          <template #actions>
            <BookingButton
              :is-loading="bookingStore.isLoading"
              :label="bookedSessionIds.has(s.id) ? 'Annuler' : 'Réserver'"
              @click="onToggleBooking(s.id)"
            />
          </template>
        </SessionCard>
        <div v-if="sessionStore.items.length === 0" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Pas de résultats.
        </div>
      </div>

      <div class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
        <div>Nbr de résultats : {{ total }}</div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--; fetch()"
          >
            <
          </button>
          <div class="px-2">Page {{ page }}</div>
          <button
            class="rounded-xl border border-slate-200 px-3 py-2 disabled:opacity-50"
            :disabled="page * limit >= total"
            @click="page++; fetch()"
          >
            >
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
