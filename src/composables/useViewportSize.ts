import {ref, computed, onMounted, onUnmounted, type Ref} from 'vue'

export interface ViewportSize {
    width: Ref<number>
    height: Ref<number>
    maxEpocsToDisplay: Ref<number>
}

export function useViewportSize(): ViewportSize {
    const width = ref<number>(window.innerWidth)
    const height = ref<number>(window.innerHeight)
    const maxEpocsToDisplay = computed<number>(() => {
        if (width.value < 900) return 4
        return Math.max(8, Math.floor(width.value / 250))
    })

    function handleResize(): void {
        width.value = window.innerWidth
        height.value = window.innerHeight
    }

    onMounted(() => window.addEventListener('resize', handleResize))
    onUnmounted(() => window.removeEventListener('resize', handleResize))

    return { width, height, maxEpocsToDisplay }
}