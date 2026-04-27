<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import BookingButton from '../../components/BookingButton.vue'
import { useBookingStore } from '../../stores/booking.store'

const toast = useToast()
const bookingStore = useBookingStore()

async function fetch() {
  await bookingStore.fetchMine()
}

async function onCancel(sessionId: number) {
  try {
    await bookingStore.cancel(sessionId)
    toast.success('Booking canceled')
  } catch {
    toast.error('Cancel failed')
  }
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h1 class="text-xl font-bold text-slate-900">Mes réservations</h1>
        <p class="text-sm text-slate-600">Vos séances réservées.</p>
      </div>

      <div
        v-if="bookingStore.isLoading"
        class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm"
      >
        En cours...
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <div
          v-for="b in bookingStore.myBookings"
          :key="b.id"
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between"
        >
          <div>
            <div class="font-semibold text-slate-900">
              Séance {{ b.session.title }}
            </div>
                                 <div class="text-sm text-slate-600">{{ new Date(b.session.date).toLocaleString() }}</div>
        <div class="text-sm text-slate-600" v-if="b.session.duration">Durée : {{ b.session.duration }} min</div>
        <div class="text-sm text-slate-600">Nombre max de participants à la séance : {{ b.session.maxParticipants }}</div>
          </div>

          <BookingButton
            :is-loading="bookingStore.isLoading"
            label="Annuler"
            @click="onCancel(b.sessionId)"
          />
        </div>

        <div
          v-if="bookingStore.myBookings.length === 0"
          class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm"
        >
          Pas encore de réservations.
        </div>
      </div>
    </div>
  </AppLayout>
</template>