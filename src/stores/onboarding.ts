import { defineStore } from 'pinia';
import { ref } from 'vue';

// Types
export interface OnboardingLink {
  text: string;
  url: string;
}

export interface OnboardingItem {
  id: string;
  title: string;
  text: string;
  image?: string;
  link?: OnboardingLink;
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const onboarding = ref<OnboardingItem[]>([]);
  
  // Initialize onboarding items
  function initOnboarding() {
    try {
      const storedOnboarding = localStorage.getItem('onboarding');
      if (storedOnboarding) {
        onboarding.value = JSON.parse(storedOnboarding);
      } else {
        // Default onboarding items
        onboarding.value = [
          {
            id: 'welcome',
            title: 'Bienvenue sur ePoc',
            text: 'Découvrez des cours interactifs et enrichis.',
            image: '/assets/img/onboarding/welcome.jpg'
          }
        ];
        saveOnboarding();
      }
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      onboarding.value = [];
    }
  }
  
  // Save onboarding to localStorage
  function saveOnboarding() {
    try {
      localStorage.setItem('onboarding', JSON.stringify(onboarding.value));
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  }
  
  // Add an onboarding item
  function addItem(item: OnboardingItem) {
    onboarding.value.push(item);
    saveOnboarding();
  }
  
  // Remove an onboarding item by id
  function remove(id: string) {
    onboarding.value = onboarding.value.filter(item => item.id !== id);
    saveOnboarding();
  }
  
  // Clear all onboarding items
  function clearAll() {
    onboarding.value = [];
    saveOnboarding();
  }
  
  return {
    onboarding,
    initOnboarding,
    addItem,
    remove,
    clearAll
  };
});
