<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '../stores/auth.store'
import { Role, type RoleName } from '../types/role'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const roleName = ref<RoleName>(Role.CLIENT)
const isLoading = ref(false)

async function onSubmit() {
  isLoading.value = true
  try {
    await authStore.register(email.value.trim(), password.value, roleName.value)
    toast.success('Votre compte est créé !')
    await router.push({ name: 'login' })
  } catch {
    toast.error('Une erreur est survenue lors de votre inscription')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mx-auto mt-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 class="text-xl font-bold text-slate-900">Inscription</h1>
    <p class="mt-1 text-sm text-slate-600">Créer un compte et choisissez votre rôle</p>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-xs font-semibold text-slate-700">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700">Mot de passe</label>
        <input v-model="password" type="password" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-700">Rôle</label>
        <select v-model="roleName" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option :value="Role.CLIENT">CLIENT</option>
          <option :value="Role.COACH">COACH</option>
          <option :value="Role.ADMIN">ADMIN</option>
        </select>
      </div>
      <button
        type="submit"
        class="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        :disabled="isLoading"
      >
        {{ isLoading ? 'En cours...' : 'Créer mon compte' }}
      </button>
    </form>

    <p class="mt-4 text-sm text-slate-600">
      Vous avez déjà un compte ?
      <RouterLink class="font-semibold text-indigo-600 hover:underline" :to="{ name: 'login' }">Connectez-vous</RouterLink>
    </p>
  </div>
</template>
