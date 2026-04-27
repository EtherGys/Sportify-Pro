<script setup lang="ts">
import AppLayout from '../../layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Admin dashboard</h1>
      <p class="mt-2 text-sm text-slate-600">Manage users and all sessions.</p>
      <div class="mt-4 flex gap-3">
        <RouterLink class="font-semibold text-indigo-600 hover:underline" :to="{ name: 'admin.users' }">Manage users</RouterLink>
        <RouterLink class="font-semibold text-indigo-600 hover:underline" :to="{ name: 'admin.sessions' }">Manage sessions</RouterLink>
      </div>
    </div>
  </AppLayout>
</template>
