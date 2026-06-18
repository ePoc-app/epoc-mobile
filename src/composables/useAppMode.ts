import { computed, type ComputedRef } from 'vue'

export type AppMode = 'preview' | 'production' | 'development' | string

export interface AppModeInfo {
    mode: ComputedRef<AppMode>
    isPreview: ComputedRef<boolean>
}

export function useAppMode(): AppModeInfo {
    const mode = computed<AppMode>(() => import.meta.env.VITE_APP_MODE)

    const isPreview = computed<boolean>(() => mode.value === 'preview')

    // future mode-derived flags go here, e.g.:
    // const isProduction = computed<boolean>(() => mode.value === 'production')

    return { mode, isPreview }
}