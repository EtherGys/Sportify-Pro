<script setup lang="ts">
import { computed } from 'vue'
import type { Session } from '../types/session'

type Props = {
    sessions: Session[]
}
const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'select', session: Session): void
}>()


const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function getDayIndex(date: Date) {
    // JS: 0 = dimanche → on décale
    const day = date.getDay()
    return day === 0 ? 6 : day - 1
}

// groupe sessions par jour de semaine
const grouped = computed(() => {
    const result: Record<number, Session[]> = {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    }

    for (const s of props.sessions) {
        const date = new Date(s.date)
        const idx = getDayIndex(date)
        result[idx].push(s)
    }

    // tri par heure
    Object.keys(result).forEach((k) => {
        result[+k].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    })

    return result
})

function formatHour(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

<template>
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900">Planning de la semaine</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            <div v-for="(day, index) in weekDays" :key="index" class="border rounded-xl p-2 min-h-[140px] bg-slate-50">
                <div class="text-xs font-bold text-slate-700 mb-2">
                    {{ day }}
                </div>
                <div class="space-y-2">
                    <div v-for="s in grouped[index]" :key="s.id"
                        class="bg-white border rounded-lg p-2 cursor-pointer hover:shadow-sm transition"
                        @click="emit('select', s)">
                        <div class="text-xs font-semibold text-indigo-600">
                            {{ formatHour(s.date) }}
                        </div>
                        <div class="text-sm font-medium text-slate-900 line-clamp-1">
                            {{ s.title }}
                        </div>
                        <div class="text-xs text-slate-500">
                            {{ s.bookings?.length ?? 0 }} / {{ s.maxParticipants }} réservations
                        </div>
                    </div>
                    <div v-if="grouped[index].length === 0" class="text-xs text-slate-400">
                        Rien pour ce jour
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>