import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMediaPlayerStore = defineStore('mediaPlayer', () => {
    // État global
    const players = ref<Map<string, { duration: number; isPlaying: boolean; currentTime: number }>>(new Map());
    const activePlayerId = ref<string | null>(null);
    const isTimelineDragging = ref<boolean>(false);

    // Actions
    const registerPlayer = (id: string, duration: number) => {
        players.value.set(id, { duration, isPlaying: false, currentTime: 0 });
    };

    const unregisterPlayer = (id: string) => {
        players.value.delete(id);
        if (activePlayerId.value === id) {
            activePlayerId.value = null;
        }
    };

    const setPlayerState = (id: string, state: { isPlaying: boolean; currentTime: number }) => {
        const player = players.value.get(id);
        if (player) {
            player.isPlaying = state.isPlaying;
            player.currentTime = state.currentTime;
        }
    };

    const setActivePlayer = (id: string) => {
        activePlayerId.value = id;
    };

    // Getters
    const getPlayerState = computed(() => (id: string) => {
        return players.value.get(id);
    });

    const getActivePlayerState = computed(() => {
        if (!activePlayerId.value) return null;
        return players.value.get(activePlayerId.value);
    });

    return {
        players,
        activePlayerId,
        isTimelineDragging,
        registerPlayer,
        unregisterPlayer,
        setPlayerState,
        setActivePlayer,
        getPlayerState,
        getActivePlayerState,
    };
});
