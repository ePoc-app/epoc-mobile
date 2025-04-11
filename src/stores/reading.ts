import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Types
export interface Reading {
  epocId: string;
  lastChapterId: string;
  progress: number;
  score: number;
  answers: Record<string, any>;
  lastUpdate: string;
}

export const useReadingStore = defineStore('reading', () => {
  // State
  const readings = ref<Reading[]>([]);
  
  // Computed
  const getReadingByEpocId = computed(() => {
    return (epocId: string) => readings.value.find(reading => reading.epocId === epocId);
  });
  
  // Initialize readings from localStorage
  function initReadings() {
    try {
      const storedReadings = localStorage.getItem('readings');
      if (storedReadings) {
        readings.value = JSON.parse(storedReadings);
      }
    } catch (error) {
      console.error('Error initializing readings:', error);
      readings.value = [];
    }
  }
  
  // Save readings to localStorage
  function saveReadings() {
    try {
      localStorage.setItem('readings', JSON.stringify(readings.value));
    } catch (error) {
      console.error('Error saving readings:', error);
    }
  }
  
  // Add or update a reading
  function updateReading(reading: Reading) {
    const index = readings.value.findIndex(r => r.epocId === reading.epocId);
    
    if (index !== -1) {
      // Update existing reading
      readings.value[index] = {
        ...readings.value[index],
        ...reading,
        lastUpdate: new Date().toISOString()
      };
    } else {
      // Add new reading
      readings.value.push({
        ...reading,
        lastUpdate: new Date().toISOString()
      });
    }
    
    saveReadings();
  }
  
  // Remove a reading
  function removeReading(epocId: string) {
    readings.value = readings.value.filter(reading => reading.epocId !== epocId);
    saveReadings();
  }
  
  // Update chapter progress
  function updateChapterProgress(epocId: string, chapterId: string, progress: number) {
    const reading = getReadingByEpocId.value(epocId);
    
    if (reading) {
      updateReading({
        ...reading,
        lastChapterId: chapterId,
        progress: Math.max(reading.progress, progress)
      });
    } else {
      // Create new reading
      updateReading({
        epocId,
        lastChapterId: chapterId,
        progress,
        score: 0,
        answers: {},
        lastUpdate: new Date().toISOString()
      });
    }
  }
  
  // Update answer
  function updateAnswer(epocId: string, questionId: string, answer: any) {
    const reading = getReadingByEpocId.value(epocId);
    
    if (reading) {
      const updatedAnswers = {
        ...reading.answers,
        [questionId]: answer
      };
      
      updateReading({
        ...reading,
        answers: updatedAnswers
      });
    }
  }
  
  // Update score
  function updateScore(epocId: string, score: number) {
    const reading = getReadingByEpocId.value(epocId);
    
    if (reading) {
      updateReading({
        ...reading,
        score: Math.max(reading.score, score)
      });
    }
  }
  
  return {
    readings,
    getReadingByEpocId,
    initReadings,
    updateReading,
    removeReading,
    updateChapterProgress,
    updateAnswer,
    updateScore
  };
});
