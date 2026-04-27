<script setup lang="ts">
defineProps<{
  isLoading?: boolean
  label: string
}>()
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="isLoading"
  >
    <span v-if="isLoading">En cours...</span>
    <span v-else>{{ label }}</span>
  </button>
</template>
