<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SessionInput } from '../services/sessionApi'

const props = defineProps<{
  initial?: Partial<SessionInput>
  showCoachId?: boolean
  submitLabel: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: SessionInput): void
}>()

const title = ref(props.initial?.title ?? '')
const description = ref(props.initial?.description ?? '')
const date = ref(props.initial?.date ?? new Date().toISOString().slice(0, 16))
const duration = ref<number | ''>(props.initial?.duration ?? 60)
const maxParticipants = ref<number | ''>(props.initial?.maxParticipants ?? 10)
const coachId = ref<number | ''>(props.initial?.coachId ?? '')

const canSubmit = computed(() => title.value.trim().length >= 3 && Boolean(date.value) && Number(maxParticipants.value) > 0)

function onSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim() ? description.value.trim() : undefined,
    date: new Date(date.value).toISOString(),
    duration: duration.value === '' ? undefined : Number(duration.value),
    maxParticipants: Number(maxParticipants.value),
    coachId: props.showCoachId && coachId.value !== '' ? Number(coachId.value) : undefined
  })
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <label class="block text-xs font-semibold text-slate-700">Nom</label>
      <input v-model="title" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700">Description</label>
      <textarea
        v-model="description"
        rows="3"
        class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700">Date</label>
        <input v-model="date" type="datetime-local" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700">Durée (min)</label>
        <input v-model="duration" type="number" min="1" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700">Max participants</label>
        <input
          v-model="maxParticipants"
          type="number"
          min="1"
          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
    </div>

    <div v-if="showCoachId">
      <label class="block text-xs font-semibold text-slate-700">Coach ID</label>
      <input v-model="coachId" type="number" min="1" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    </div>

    <button
      type="submit"
      class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="!canSubmit || isLoading"
    >
      {{ isLoading ? 'En cours...' : submitLabel }}
    </button>
  </form>
</template>
