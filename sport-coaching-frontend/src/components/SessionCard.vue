<script setup lang="ts">
import type { Session } from '../types/session'

defineProps<{
  session: Session
}>()
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-base font-semibold text-slate-900">{{ session.title }}</h3>
        <p v-if="session.description" class="mt-1 text-sm text-slate-600">
          {{ session.description }}
        </p>
      </div>
      <div class="text-right text-xs text-slate-500">
        <div>{{ new Date(session.date).toLocaleString() }}</div>
        <div v-if="session.duration">{{ session.duration }} min</div>
        <div>Max : {{ session.maxParticipants }}</div>
      </div>
    </div>

    <div class="mt-4">
      <slot name="actions" />
    </div>
  </article>
</template>
