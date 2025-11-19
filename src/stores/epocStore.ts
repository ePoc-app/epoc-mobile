import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { actionSheetController, alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import type { Epoc, Chapter, Content } from '@/types/epoc/v1';
import { uid } from '@epoc/epoc-types/dist/v1';

export const useEpocStore = defineStore('epoc', () => {
    // --- State ---
    const router = useRouter();
    const initialized = ref(false);
    const _epoc = ref<Epoc | null>(null);

    // --- Getters ---
    const getEpoc = computed(() => _epoc.value);
    const getRootFolder = computed(() => `/${Directory.LibraryNoCloud}/epocs/${_epoc.value.id}/`);

    // --- Actions ---

    async function getEpocById(id: string): Promise<Epoc> {
        if (_epoc.value && _epoc.value.id === id) return _epoc.value;
        try {
            const result = await Filesystem.readFile({
                path: `epocs/${id}/content.json`,
                directory: Directory.LibraryNoCloud,
                encoding: Encoding.UTF8,
            });
            let epoc: Epoc = JSON.parse(atob(result.data as string));
            if (epoc.id !== id) epoc.id = id; // Fix id when local epocs are imported
            _epoc.value = initCourseContent(epoc);
            return _epoc.value;
        } catch (error) {
            console.log('Error reading ePoc content:', error);
        }
    }

    /**
     * Initialize ePoc runtime properties
     */
    function initCourseContent(epoc: Epoc): Epoc {
        initialized.value = true;
        epoc.assessments = [];
        // backward compatibility before epoc parameters existed
        epoc.parameters = epoc.parameters ? epoc.parameters : {};
        for (const [chapterId, chapter] of Object.entries(epoc.chapters)) {
            chapter.resumeLink = `/epoc/play/${epoc.id}/${chapterId}`;
            chapter.time = 0;
            chapter.mediaCount = 0;
            chapter.assessments = [];
            chapter.initializedContents = chapter.contents.map((id) => {
                const currentContent: Content = epoc.contents[id];
                currentContent.id = id;
                if (currentContent.type === 'assessment') {
                    currentContent.scoreTotal = calcScoreTotal(epoc, currentContent.questions);
                    currentContent.chapterId = chapterId;
                    chapter.time += currentContent.questions.length;
                    chapter.assessments.push(id);
                    if (currentContent.scoreTotal > 0) {
                        epoc.assessments.push(currentContent);
                    }
                } else if (currentContent.type === 'simple-question' &&
                    Number(epoc.questions[currentContent.question].score) > 0) {
                    currentContent.scoreTotal = calcScoreTotal(epoc, [currentContent.question]);
                    currentContent.questions = [currentContent.question];
                    currentContent.chapterId = chapterId;
                    chapter.assessments.push(id);
                    epoc.assessments.push(currentContent);
                } else if (currentContent.type === 'video' || currentContent.type === 'audio') {
                    chapter.mediaCount++;
                    chapter.time += 3;
                }
                return currentContent;
            });
            chapter.time = chapter.duration ? chapter.duration : chapter.time;
            chapter.assessmentCount = chapter.assessments.length;
        }

        console.log('Initialized ePoc:', epoc);
        // If you have a pluginService, call it here
        // pluginService.init(this.rootFolder, epoc);
        return epoc;
    }

    /**
     * Calculate the total score for a set of questions
     */
    function calcScoreTotal(epoc: Epoc, questions: uid[]): number {
        return questions.reduce((total, questionId) => total + Number(epoc.questions[questionId].score), 0);
    }

    /**
     * Calculate the score for a question based on user responses
     */
    function calcScore(scoreMax: number, correction: any, userResponses: any): number {
        return isUserResponsesCorrect(correction, userResponses) ? +scoreMax : 0;
    }

    /**
     * Check if the learner's responses are correct
     */
    function isUserResponsesCorrect(correction: any, userResponses: any): boolean {
        if (typeof correction === 'string') {
            return userResponses.join('') === correction;
        } else {
            correction = correction as Array<any>;
            if (correction.length > 0 && correction[0].values) {
                return correction.every((group, index) => {
                    return JSON.stringify(group.values.sort()) === JSON.stringify(userResponses[index].map((r: any) => r.value).sort());
                });
            } else {
                return JSON.stringify(correction.sort()) === JSON.stringify(userResponses.sort());
            }
        }
    }

    async function epocMainMenu(chapterIndex?: number, chapter?: Chapter) {
        if (!_epoc.value) return;

        const buttons = [
            {
                text: 'Accueil',
                icon: 'home-outline',
                handler: () => {
                    router.push('/home/' + _epoc.value!.id);
                },
            },
            ...(!router.currentRoute.value.path.includes('/epoc/toc/' + _epoc.value!.id)
                ? [
                    {
                        text: 'Table des matières',
                        icon: 'list-circle-outline',
                        handler: () => {
                            router.push('/epoc/toc/' + _epoc.value!.id);
                        },
                    },
                ]
                : []),
            {
                text: 'Détails du score',
                icon: 'star-outline',
                handler: () => {
                    router.push('/epoc/score/' + _epoc.value!.id);
                },
            },
            {
                text: 'Licence',
                icon: 'receipt-outline',
                handler: () => {
                    // Implement your license display logic
                },
            },
            {
                text: 'Paramètres',
                icon: 'settings-outline',
                handler: () => {
                    router.push('/settings');
                },
            },
            {
                text: 'Fermer',
                role: 'cancel',
            },
        ];
        const actionSheet = await actionSheetController.create({
            cssClass: 'custom-action-sheet',
            mode: 'ios',
            header: _epoc.value!.title,
            subHeader: chapter && chapter.title ? chapter.title : 'Menu principal',
            buttons,
        });
        document.documentElement.style.setProperty('--thumbnail-url', `url(${rootFolder.value + _epoc.value!.image})`);
        await actionSheet.present();
    }

    return {
        // State
        initialized,
        epoc: getEpoc,
        rootFolder: getRootFolder,
        // Actions
        getEpocById,
        initCourseContent,
        calcScoreTotal,
        calcScore,
        isUserResponsesCorrect,
        epocMainMenu,
    };
});
