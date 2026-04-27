<script setup lang="ts">
import AppLayout from '../../layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Bienvenu sur le dashboard de votre compte Coach</h1>
      <p class="mt-2 text-sm text-slate-600">Gérer vos séances et consulter les participants.</p>
      <RouterLink class="mt-4 inline-block font-semibold text-indigo-600 hover:underline" :to="{ name: 'coach.manageSessions' }">
        Voir mes séances
      </RouterLink>
    </div>
  </AppLayout>
</template>
