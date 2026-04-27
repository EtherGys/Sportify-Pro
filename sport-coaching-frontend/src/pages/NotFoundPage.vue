<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900">Page not found</h1>
      <p class="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <RouterLink class="mt-4 inline-block font-semibold text-indigo-600 hover:underline" :to="{ name: 'dashboard' }">
        Go to dashboard
      </RouterLink>
    </div>
  </AppLayout>
</template>
