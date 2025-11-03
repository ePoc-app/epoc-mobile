import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@/composables/useStorage';
import { languages } from '@/utils/languages';
import type { Settings } from '@/types/settings';

export const useSettingsStore = defineStore('settings', () => {
    // --- State ---
    const storageService = useStorage();

    const defaultSettings: Settings = {
        debug: false,
        font: 'Inria Sans',
        fontSize: 16,
        lineHeight: 1.5,
        lang: languages.has(navigator.language.substring(0, 2))
            ? navigator.language.substring(0, 2)
            : 'en',
        theme: 'light',
        customLibrairies: [],
        devMode: false,
        isUserOptIn: true,
    };

    const settings = ref<Settings>({ ...defaultSettings });
    const settingsFetched = ref(false);

    // --- Getters ---
    const getSettings = computed(() => settings.value);
    const getSettingsFetched = computed(() => settingsFetched.value);

    // --- Actions ---
    async function fetchSettings() {
        const storedSettings = await storageService.getValue('settings');
        settings.value = storedSettings
            ? { ...defaultSettings, ...JSON.parse(storedSettings) }
            : { ...defaultSettings };
        settingsFetched.value = true;
    }

    async function saveSettings() {
        await storageService.setValue('settings', JSON.stringify(settings.value));
    }

    function resetSettings() {
        settings.value = { ...defaultSettings };
        saveSettings();
    }

    function updateSettings(newSettings: Partial<Settings>) {
        settings.value = { ...settings.value, ...newSettings };
        saveSettings();
    }

    // --- Initialization ---
    fetchSettings();

    return {
        // State
        settings,
        settingsFetched,
        // Getters
        getSettings,
        getSettingsFetched,
        // Actions
        fetchSettings,
        saveSettings,
        resetSettings,
        updateSettings,
    };
});
