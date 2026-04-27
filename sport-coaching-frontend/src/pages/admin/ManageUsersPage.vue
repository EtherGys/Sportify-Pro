<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import AppLayout from '../../layouts/AppLayout.vue'
import { useUserStore } from '../../stores/user.store'
import { Role, type RoleName } from '../../types/role'
import { ref } from 'vue'

const isModalOpen = ref(false)
const selectedUser = ref<{ id: number; email: string; role: RoleName } | null>(null)
const roleName = ref<RoleName>(Role.CLIENT)
const formEmail = ref('')
const formRole = ref<RoleName>('CLIENT') // adapte selon ton enum
const toast = useToast()
const userStore = useUserStore()

async function fetch() {
  try {
    await userStore.fetchAll()
  } catch {
    toast.error('Failed to load users')
  }
}

async function onDelete(id: number) {
  try {
    await userStore.remove(id)
    toast.success('Utilisateur supprimé')
  } catch {
    toast.error("Une erreur s'est produite lors de la suppression d'un utilisateur")
  }
}

async function submitUpdate() {
  if (!selectedUser.value) return

  try {
    await userStore.update(selectedUser.value.id, formEmail.value, formRole.value)
    toast.success('Utilisateur modifié')
    isModalOpen.value = false
  } catch {
    toast.error("Erreur lors de la mise à jour")
  }
}

function openModal(user: any) {
  selectedUser.value = user
  formEmail.value = user.email
  formRole.value = user.role
  isModalOpen.value = true
}

onMounted(fetch)
</script>

<template>
  <AppLayout>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/50">
  <div class="bg-white p-6 rounded-xl w-96">
    <h2 class="text-lg font-bold mb-4">Modifier l'utilisateur</h2>
    <input
      v-model="formEmail"
      type="email"
      class="w-full mb-3 p-2 border rounded"
      placeholder="Email"
    />
    <label class="block text-xs font-semibold text-slate-700">Rôle</label>
        <select v-model="roleName" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option :value="Role.CLIENT">CLIENT</option>
          <option :value="Role.COACH">COACH</option>
          <option :value="Role.ADMIN">ADMIN</option>
        </select>
    <div class="flex justify-end gap-2 mt-4">
      <button
        class="px-3 py-2 bg-gray-300 rounded"
        @click="isModalOpen = false"
      >
        Annuler
      </button>
      <button
        class="px-3 py-2 bg-indigo-600 text-white rounded"
        @click="submitUpdate"
      >
        Valider
      </button>
    </div>
  </div>
</div>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-xl font-bold text-slate-900">Gestion des utilisateurs</h1>
      <p class="mt-2 text-sm text-slate-600">Gérer les comptes utilisateurs.</p>

      <div v-if="userStore.isLoading" class="mt-4 text-sm text-slate-600">En cours...</div>

      <div v-else class="mt-4 space-y-2">
        <div
          v-for="u in userStore.users"
          :key="u.id"
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <div>
            <div class="font-semibold text-slate-900">{{ u.email }}</div>
            <div class="text-slate-600">Rôle : {{ u.role }}</div>
          </div>
          <div>
            <button
            class="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 m-2"
            type="button"
           @click="openModal(u)"
            >
            Modifier
          </button>
          <button
          class="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
          type="button"
          @click="onDelete(u.id)"
          >
          Supprimer
        </button>
      </div>
        </div>

        <div v-if="userStore.users.length === 0" class="text-sm text-slate-600">Pas encore d'utilisateurs.</div>
      </div>
    </div>
  </AppLayout>
</template>
