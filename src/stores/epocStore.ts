import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { actionSheetController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { uid } from '@epoc/epoc-types/dist/v1';
import { Capacitor } from '@capacitor/core';
import { useI18n } from 'vue-i18n';
import { homeOutline, listCircleOutline, starOutline, receiptOutline, settingsOutline } from 'ionicons/icons';
import { readEpocContent } from '@/utils/epocService';
import { Epoc } from '@/types/epoc';

export const useEpocStore = defineStore('epoc', () => {
    const { t } = useI18n();

    // --- State ---
    const router = useRouter();
    const initialized = ref(false);
    const _epoc = ref<Epoc | null>(null);
    const _rootFolder = ref<string>('');

    // --- Getters ---
    const getEpoc = computed(() => _epoc.value);
    const getRootFolder = computed(() => _rootFolder.value);

    // --- Actions ---

    async function getEpocById(id: string): Promise<Epoc> {
        if (_epoc.value && _epoc.value.id === id) return _epoc.value;
        try {
            const epoc = await readEpocContent(id.startsWith('local-') ? 'local-epocs' : 'epocs', id);

            if (!epoc) {
                throw new Error('ePoc not found');
            }

            _epoc.value = initCourseContent(epoc);

            _rootFolder.value = `${epoc.dir}/`;

            console.log(epoc.dir);

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
                } else if (
                    currentContent.type === 'simple-question' &&
                    Number(epoc.questions[currentContent.question].score) > 0
                ) {
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

        // todo
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
                    return (
                        JSON.stringify(group.values.sort()) ===
                        JSON.stringify(userResponses[index].map((r: any) => r.value).sort())
                    );
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
                text: t('FLOATING_MENU.HOME'),
                icon: homeOutline,
                handler: () => {
                    router.push('/library');
                },
            },
            ...(!router.currentRoute.value.path.includes('/epoc/toc/' + _epoc.value!.id)
                ? [
                      {
                          text: t('FLOATING_MENU.TOC'),
                          icon: listCircleOutline,
                          handler: () => {
                              router.push('/epoc/toc/' + _epoc.value!.id);
                          },
                      },
                  ]
                : []),
            {
                text: t('FLOATING_MENU.SCORE_DETAILS'),
                icon: starOutline,
                handler: () => {
                    router.push('/epoc/score/' + _epoc.value!.id);
                },
            },
            {
                text: t('FLOATING_MENU.LICENSE'),
                icon: receiptOutline,
                handler: () => {
                    // Implement your license display logic
                },
            },
            {
                text: t('FLOATING_MENU.SETTINGS'),
                icon: settingsOutline,
                handler: () => {
                    router.push('/settings');
                },
            },
            {
                text: t('CLOSE'),
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
        document.documentElement.style.setProperty('--thumbnail-url', `url(${_rootFolder.value + _epoc.value!.image})`);
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
