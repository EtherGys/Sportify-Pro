<script setup lang="ts">
import { ref } from 'vue'
import { Role, type RoleName } from '../types/role'

const emit = defineEmits<{
  (e: 'submit', payload: { email: string; password: string; roleName: RoleName }): void
}>()

const email = ref('')
const password = ref('')
const roleName = ref<RoleName>(Role.CLIENT)

function onSubmit() {
  emit('submit', { email: email.value.trim(), password: password.value, roleName: roleName.value })
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <label class="block text-xs font-semibold text-slate-700">Email</label>
      <input v-model="email" type="email" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    </div>
    <div>
      <label class="block text-xs font-semibold text-slate-700">Password</label>
      <input v-model="password" type="password" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
    </div>
    <div>
      <label class="block text-xs font-semibold text-slate-700">Role</label>
      <select v-model="roleName" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
        <option :value="Role.CLIENT">CLIENT</option>
        <option :value="Role.COACH">COACH</option>
        <option :value="Role.ADMIN">ADMIN</option>
      </select>
    </div>
    <button class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" type="submit">
      Create
    </button>
  </form>
</template>
