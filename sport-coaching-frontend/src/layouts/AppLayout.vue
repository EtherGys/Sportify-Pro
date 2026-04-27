<script setup lang="ts">
import AppNavbar from '../components/AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen">
    <AppNavbar />
    <main class="mx-auto w-full max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>
