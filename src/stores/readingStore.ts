import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { toastController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useStorage } from '@/composables/useStorage';
import { usePlugin } from '@/composables/usePlugin';
import { useEpocStore } from './epocStore';
// @ts-ignore
import * as jsonLogic from 'json-logic-js';
import type { Reading, EntityTypes, Verb } from '@/types/reading';
import type { Badge } from '@/types/epoc';
import { uid } from '@epoc/epoc-types/dist/v1';
import { trackEvent } from '@/utils/matomo';
import { Rule } from '@epoc/epoc-types/src/v1/rule';
import { closeOutline, openOutline } from 'ionicons/icons';

export const useReadingStore = defineStore('reading', () => {
    const storageService = useStorage();
    const epocService = useEpocStore();
    const pluginService = usePlugin();
    // --- State ---
    const router = useRouter();

    const readings = ref<Reading[]>([]);

    // --- Getters ---
    const getReadings = computed(() => readings.value);

    // --- Actions ---
    async function fetchReadings() {
        const storedReadings = await storageService.getValue('readings');
        readings.value = storedReadings ? JSON.parse(storedReadings) : [];
    }

    async function saveReadings() {
        await storageService.setValue('readings', JSON.stringify(readings.value));
    }

    function addReading(epocId: string) {
        if (readings.value.findIndex((reading) => reading.epocId === epocId) === -1) {
            readings.value = [
                ...readings.value,
                {
                    epocId,
                    progress: 0,
                    chaptersProgress: [],
                    assessments: [],
                    bookmarks: [],
                    choices: [],
                    flags: [],
                    certificateShown: false,
                    statements: {
                        global: {},
                        chapters: {},
                        pages: {},
                        contents: {},
                        questions: {},
                    },
                    badges: [],
                },
            ];
            saveReadings();
        }
    }

    function duplicateReading(epocId: string, newName: string) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index !== -1) {
            readings.value = [
                ...readings.value,
                {
                    ...readings.value[index],
                    epocId: newName,
                }
            ];
            saveReadings();
        }
    }

    function updateProgress(epocId: string, progress: number) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index !== -1) {
            readings.value[index].progress = progress;
            saveReadings();
        }
    }

    function saveResponses(epocId: string, assessmentId: string, score: number, responses: string[]) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index === -1) return;
        const assessmentIndex = readings.value[index].assessments.findIndex(
            (assessment) => assessment.id === assessmentId
        );
        if (assessmentIndex !== -1) {
            readings.value[index].assessments[assessmentIndex] = {
                id: assessmentId,
                score,
                responses,
            };
        } else {
            readings.value[index].assessments.push({
                id: assessmentId,
                score,
                responses,
            });
        }
        saveReadings();
    }

    function saveChapterProgress(epocId: string, chapterId: string, contentId?: string) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index === -1) return;
        const chapterIndex = readings.value[index].chaptersProgress.findIndex((chapter) => chapter.id === chapterId);
        if (chapterIndex !== -1) {
            if (contentId && !readings.value[index].chaptersProgress[chapterIndex].contents.includes(contentId)) {
                readings.value[index].chaptersProgress[chapterIndex].contents.push(contentId);
            }
        } else {
            readings.value[index].chaptersProgress.push({
                id: chapterId,
                contents: contentId ? [contentId] : [],
            });
        }
        saveReadings();
    }

    function saveChoices(epocId: string, choiceId: string, responses: any, flags: string[], flagsToRemove: string[]) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index === -1) return;
        const choiceIndex = readings.value[index].choices.findIndex((choice) => choice.id === choiceId);
        if (choiceIndex !== -1) {
            readings.value[index].choices[choiceIndex] = {
                id: choiceId,
                responses,
            };
        } else {
            readings.value[index].choices.push({
                id: choiceId,
                responses,
            });
        }
        readings.value[index].flags = readings.value[index].flags.filter((flag) => !flagsToRemove.includes(flag));
        readings.value[index].flags = [...readings.value[index].flags, ...flags];
        saveReadings();
    }

    function resetResponses(epocId: string, assessmentId: string) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index === -1) return;
        const assessmentIndex = readings.value[index].assessments.findIndex(
            (assessment) => assessment.id === assessmentId
        );
        if (assessmentIndex !== -1) {
            readings.value[index].assessments.splice(assessmentIndex, 1);
            saveReadings();
        }
    }

    function saveStatement(
        epocId: string,
        entityType: EntityTypes,
        entityId: uid,
        verb: Verb,
        value: string | number | boolean
    ) {
        const reading = readings.value.find((r) => r.epocId === epocId);
        if (!reading) return;

        if (!reading.statements) {
            reading.statements = {
                global: {},
                chapters: {},
                pages: {},
                contents: {},
                questions: {},
            };
        }

        if (entityType === 'global') {
            reading.statements.global[verb] = value;
        } else {
            if (!reading.statements[entityType][entityId]) {
                reading.statements[entityType][entityId] = {};
            }

            reading.statements[entityType][entityId][verb] = value;
        }

        if (!reading.badges) reading.badges = [];

        checkBadges(reading);
        saveReadings();

        pluginService.broadcastMessage({
            event: 'statement',
            statement: {
                epocId,
                entityType,
                entityId,
                verb,
                value,
            },
        });
    }

    function checkBadges(reading: Reading) {
        const epoc = epocService.epoc;
        if (!epoc || !epoc.badges) return;
        for (const [badgeId, badge] of Object.entries(epoc.badges)) {
            if (jsonLogic.apply(badge.rule, reading.statements) && !reading.badges.includes(badgeId)) {
                presentBadge(badge as Badge);
                reading.badges.push(badgeId);
                trackEvent(epoc.id, `${epoc.id} / Badge unlocked ${badgeId} ${badge.title}`);
            }
        }
    }

    async function presentBadge(badge: Badge) {
        const toast = await toastController.create({
            header: 'Nouveau badge débloqué',
            message: badge.title,
            icon: badge.icon.endsWith('.svg')
                ? epocService.rootFolder + badge.icon
                : `/assets/icon/badge/${badge.icon}.svg`,
            cssClass: 'badge-toast',
            position: 'top',
            buttons: [
                {
                    icon: openOutline,
                    handler: () => {
                        router.push(`/epoc/score/${epocService.epoc?.id}`);
                    },
                },
                {
                    icon: closeOutline,
                    handler: () => {
                        console.log('Dismiss clicked');
                    },
                },
            ],
        });
        await toast.present();
    }

    function removeReading(id: string) {
        readings.value = readings.value.filter((reading) => reading.epocId !== id);
        saveReadings();
    }

    function resetAll() {
        readings.value = [];
        saveReadings();
    }

    function toggleBookmark(epocId: string, index: number) {
        const readingIndex = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (readingIndex === -1) return;
        const bookmarkIndex = readings.value[readingIndex].bookmarks.indexOf(index);
        if (bookmarkIndex === -1) {
            readings.value[readingIndex].bookmarks.push(index);
        } else {
            readings.value[readingIndex].bookmarks.splice(bookmarkIndex, 1);
        }
        saveReadings();
    }

    function removeBookmark(epocId: string, index: number) {
        const readingIndex = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (readingIndex === -1) return;
        readings.value[readingIndex].bookmarks.splice(index, 1);
        saveReadings();
    }

    function updateCertificateShown(epocId: string, value: boolean) {
        const index = readings.value.findIndex((reading) => reading.epocId === epocId);
        if (index !== -1) {
            readings.value[index].certificateShown = value;
            saveReadings();
        }
    }

    function isUnlocked(reading: Reading, rule: Rule) {
        return jsonLogic.apply(rule, reading.statements);
    }

    // --- Initialization ---
    fetchReadings();

    return {
        // State
        readings,
        // Getters
        getReadings,
        // Actions
        fetchReadings,
        saveReadings,
        addReading,
        duplicateReading,
        updateProgress,
        saveResponses,
        saveChapterProgress,
        saveChoices,
        resetResponses,
        saveStatement,
        checkBadges,
        presentBadge,
        removeReading,
        resetAll,
        toggleBookmark,
        removeBookmark,
        updateCertificateShown,
        isUnlocked,
    };
});
