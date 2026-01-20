<script setup lang="ts">
import { uid } from '@epoc/epoc-types/src/v1';
import {
    IonContent,
    IonIcon,
    IonPage,
    IonProgressBar,
    onIonViewWillLeave,
    IonSpinner,
    onIonViewDidEnter,
} from '@ionic/vue';
import { computed, ref, watch } from 'vue';
import { useEpocStore } from '@/stores/epocStore';
import { useReadingStore } from '@/stores/readingStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMediaPlayerStore } from '@/stores/mediaPlayerStore';
import { useRoute } from 'vue-router';
import { onIonViewWillEnter } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { Chapter } from '@/types/epoc';
import { Reading, UserAssessment } from '@/types/reading';
import { Content } from '@/types/contents/content';
import { srcConvert } from '@/utils/pipes';
import { menu } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperObject } from 'swiper/types';
import ChapterInfo from '@/views/epoc/content/ChapterInfo.vue';
import ChapterEnd from './content/ChapterEnd.vue';
import AppDebug from './content/AppDebug.vue';
import CommonContent from './content/CommonContent.vue';
import CertificateModal from '@/components/CertificateModal.vue';
import { appService } from '@/utils/appService';
import HtmlContent from './content/HtmlContent.vue';
import VideoContent from './content/VideoContent.vue';
import AudioContent from '@/views/epoc/content/AudioContent.vue';
import AssessmentContent from './content/AssessmentContent.vue';
import SimpleQuestion from './content/SimpleQuestion.vue';

import {
    documentTextOutline,
    cubeOutline,
    playCircleOutline,
    micOutline,
    helpOutline,
    gitBranchOutline,
} from 'ionicons/icons';
import { until } from '@vueuse/core';

const CONTENT_TYPE_ICONS = {
    html: documentTextOutline,
    assessment: cubeOutline,
    video: playCircleOutline,
    audio: micOutline,
    'simple-question': helpOutline,
    choice: gitBranchOutline,
} as const;

const INTERACTIVE_ELEMENTS = ['ion-icon', 'button', 'ion-button', 'ion-checkbox', 'ion-radio', 'span'];

const epocStore = useEpocStore();
const readingStore = useReadingStore();
const settingsStore = useSettingsStore();
const mediaPlayerStore = useMediaPlayerStore();
const route = useRoute();

const { epoc } = storeToRefs(epocStore);
const { settings } = storeToRefs(settingsStore);
const { readings } = storeToRefs(readingStore);

const epocId = computed(() => route.params.epoc_id.toString());
const chapterId = computed(() => route.params.chapter_id?.toString());
const contentId = computed(() => route.params.content_id?.toString());
const shouldNavigateToNext = computed(() => route.params.next?.toString());

const swiperInstance = ref<SwiperObject>();
const reading = ref<Reading>();
const pagesCount = ref(0);
const dataInitialized = ref(false);
const currentPage = ref(0);
const certificateShown = ref(false);
const showControls = ref(true);

const chapterIndex = computed(() => Object.keys(epoc.value?.chapters || []).indexOf(chapterId.value));
const chapter = computed<Chapter | undefined>(() => epoc.value?.chapters[chapterId.value]);

const nextChapterId = computed<uid | undefined>(() => {
    const keys = Object.keys(epoc.value?.chapters || {});
    const hasNextChapter = chapterIndex.value >= 0 && chapterIndex.value < keys.length - 1;

    return hasNextChapter ? keys[chapterIndex.value + 1] : undefined;
});
const nextChapter = computed(() => {
    if (!nextChapterId.value || !epoc.value?.chapters) return undefined;
    const chapterData = epoc.value.chapters[nextChapterId.value];
    return chapterData ? { ...chapterData, id: nextChapterId.value } : undefined;
});

const filteredContents = computed<Content[]>(() => {
    return (
        chapter.value?.initializedContents.filter((content) => {
            if (!content.conditional) return true;
            return reading.value?.flags.includes(content.id);
        }) || []
    );
});

const progress = computed(() => (pagesCount.value > 0 ? currentPage.value / pagesCount.value : 0));

const assessments = computed(() => epoc.value?.assessments || []);

const assessmentData = computed(() => {
    if (!epoc.value || !reading.value) {
        return { totalUserScore: 0, totalScore: 0 };
    }

    let totalUserScore = 0;
    let totalScore = 0;

    assessments.value.forEach((assessment) => {
        if (!assessment.questions) return;

        const userAssessment = reading.value?.assessments.find((a: UserAssessment) => assessment.id === a.id);
        const scoreTotal = epocStore.calcScoreTotal(epoc.value!, assessment.questions);

        if (userAssessment && userAssessment.score > 0) {
            totalUserScore += userAssessment.score;
        }
        totalScore += scoreTotal;
    });

    return { totalUserScore, totalScore };
});

const readerStyles = computed(() => {
    const defaultStyles = {
        'font-family': 'Inria Sans',
        'font-size': '16px',
        'line-height': 1.4,
    };

    if (!settings.value) return defaultStyles;

    return {
        'font-family': settings.value.font,
        'font-size': `${settings.value.fontSize}px`,
        'line-height': settings.value.lineHeight,
    };
});

const canNavigatePrevious = computed(() => currentPage.value > 0);
const canNavigateNext = computed(() => currentPage.value <= filteredContents.value.length);

watch(epoc, (newEpoc) => {
    if (newEpoc) initializeData();
});

watch(
    () => route.params.epoc_id,
    (newId) => {
        if (newId) {
            epocStore.getEpocById(newId.toString());
        }
    }
);

watch(
    () => mediaPlayerStore.isTimelineDragging,
    (isDragging) => {
        if (isDragging) {
            swiperInstance.value?.disable();
        } else {
            swiperInstance.value?.enable();
        }
    }
);

onIonViewWillEnter(async () => {
    const newEpoc = await epocStore.getEpocById(epocId.value);
    if (newEpoc) initializeData();

    if (contentId.value) {
        await until(dataInitialized).toBeTruthy();
        navigateToContent(contentId.value, 0);
    }
});

onIonViewDidEnter(async () => {
    updateScreenReaderFocus();
});

onIonViewWillLeave(() => {
    stopAllMedia();
});

function initializeData() {
    readingStore.saveStatement(epocId.value, 'chapters', chapterId.value, 'started', true);

    reading.value = readings.value.find((item) => item.epocId === epocId.value);
    if (!reading.value) {
        readingStore.addReading(epocId.value);
    }

    readingStore.saveChapterProgress(epocId.value, chapterId.value);
    checkForCertificate();
    dataInitialized.value = true;
}

function checkForCertificate() {
    if (!epoc.value || !reading.value) return;

    const meetsScoreRequirements = assessmentData.value.totalUserScore >= epoc.value.certificateScore;
    const meetsBadgeRequirement = (reading.value.badges.length || 0) >= epoc.value.certificateBadgeCount;

    if (meetsScoreRequirements && meetsBadgeRequirement && !reading.value.certificateShown) {
        certificateShown.value = true;
        readingStore.updateCertificateShown(epoc.value.id, true);
    }
}

function navigatePrevious() {
    if (!canNavigatePrevious.value) return;
    swiperInstance.value?.slidePrev();
}

function navigateNext() {
    if (!canNavigateNext.value) return;
    swiperInstance.value?.slideNext();
}

function navigateToContent(targetContentId: uid, duration?: number) {
    const pageIndex = filteredContents.value.findIndex((content) => content.id === targetContentId);

    if (pageIndex === -1) return;

    // add 1 for the chapter info slide, add 1 more if navigating to next content
    const targetIndex = shouldNavigateToNext.value ? pageIndex + 2 : pageIndex + 1;

    updatePagesCount();
    swiperInstance.value?.slideTo(targetIndex, duration);
    currentPage.value = targetIndex;
}

function handleSlideChange() {
    stopAllMedia();

    const newIndex = swiperInstance.value?.activeIndex || 0;
    currentPage.value = newIndex;

    updatePagesCount();
    updateCurrentContent(newIndex);
}

function updateCurrentContent(index: number) {
    const contentIndex = index - 1;
    const content = filteredContents.value[contentIndex];

    if (!content) return;

    // Update url without triggering navigation
    const newUrl = `/epoc/play/${epocId.value}/${chapterId.value}/content/${content.id}`;
    window.history.replaceState({}, '', newUrl);

    readingStore.saveChapterProgress(epocId.value, chapterId.value, content.id);
    readingStore.saveStatement(epocId.value, 'pages', content.id, 'viewed', true);

    if (content.type === 'html') {
        readingStore.saveStatement(epocId.value, 'contents', content.id, 'read', true);
    }
}

function updatePagesCount() {
    pagesCount.value = filteredContents.value.length + 1;
    swiperInstance.value?.updateSlides();
}

function handleSwiper(swiper: SwiperObject) {
    swiperInstance.value = swiper;
}

function toggleControls(_swiper: SwiperObject, event: Event) {
    const target = event.target as HTMLElement;
    const isInteractiveElement = INTERACTIVE_ELEMENTS.includes(target.tagName.toLowerCase());

    if (isInteractiveElement || appService.screenReaderDetected) return;

    showControls.value = !showControls.value;
}

function hideControls() {
    if (!appService.screenReaderDetected) {
        showControls.value = false;
    }
}

function handleDragEvent(event: DragEvent) {
    if (event === 'dragstart') {
        swiperInstance.value?.disable();
    } else {
        swiperInstance.value?.enable();
    }
}

function displayMenu() {
    epocStore.epocMainMenu(chapterIndex.value, chapter.value);
}

function updateScreenReaderFocus() {
    if (!appService.screenReaderDetected) return;

    const readerElement = document.querySelector(
        'app-epoc-player.ion-page:not(.ion-page-hidden) .reader'
    ) as HTMLElement;

    readerElement?.focus();
}

function stopAllMedia() {
    const mediaElements = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
    mediaElements.forEach((media) => media.pause());
}

function shouldDisplayContent(content: Content): boolean {
    if (!content.conditional) return true;
    return reading.value?.flags.includes(content.id) || false;
}
/* TODO
    <common-content :aria-hidden="index + 1 !== currentPage" :title="content.title" :subtitle="content.subtitle" :icon="iconFromType[content.type]" v-if="content.type !== 'simple-question'">
        <audio-content v-if="content.type === 'audio'" [inputContent]="content" @timelineDragging="onDrag($event)"></audio-content>
        <course-choice v-if="content.type === 'choice'" :epocId="epocId" :content="content" @chosen="nextPage()"></course-choice>
    </common-content>
*/
</script>

<template>
    <ion-page>
        <ion-content>
            <ion-spinner v-if="!dataInitialized || !chapter || !epoc" />

            <template v-else>
                <div class="reader" slot="fixed" :style="readerStyles" tabindex="-1">
                    <swiper
                        class="reader-slider"
                        @swiper="handleSwiper"
                        @tap="toggleControls"
                        @slide-change-transition-end="updateScreenReaderFocus"
                        @slider-move="hideControls"
                        @slide-change-transition-start="handleSlideChange"
                    >
                        <swiper-slide>
                            <app-debug :epocId="epocId" :chapterId="chapterId" contentId="debut" />
                            <chapter-info :chapter="chapter" />
                        </swiper-slide>

                        <swiper-slide
                            v-for="(content, index) in chapter.initializedContents"
                            v-show="shouldDisplayContent"
                            :key="content.id"
                        >
                            <app-debug :epocId="epocId" :chapterId="chapterId" :contentId="content.id" />

                            <common-content
                                v-if="content.type !== 'simple-question'"
                                :aria-hidden="index + 1 !== currentPage"
                                :title="content.title"
                                :subtitle="content.subtitle || ''"
                                :icon="CONTENT_TYPE_ICONS[content.type]"
                            >
                                <html-content
                                    v-if="content.type === 'html'"
                                    :html="srcConvert(content.html, epocStore.rootFolder)"
                                    @go-to="navigateToContent"
                                />
                                <video-content v-else-if="content.type === 'video'" :content="content" />
                                <audio-content v-else-if="content.type === 'audio'" :content="content" />
                                <assessment-content v-else-if="content.type === 'assessment'" :content="content" />
                            </common-content>

                            <simple-question
                                v-else
                                :aria-hidden="index + 1 !== currentPage"
                                :epocId="epocId"
                                :content="content"
                                :question="epoc.questions[content.question]"
                                @dragging="handleDragEvent"
                            />
                        </swiper-slide>

                        <swiper-slide>
                            <app-debug :epocId="epocId" :chapterId="chapterId" contentId="fin" />
                            <common-content
                                :title="$t('PLAYER.MODULE_END.FINISH')"
                                :subtitle="$t('PLAYER.MODULE_END.CONGRATS')"
                                icon="assets/icon/modulecheck.svg"
                            >
                                <chapter-end :epoc="epoc" :chapter="chapter" :next-chapter="nextChapter!" />
                            </common-content>
                        </swiper-slide>
                    </swiper>
                </div>

                <div aria-hidden="true" class="reader-progress" slot="fixed">
                    <ion-progress-bar color="inria" :value="progress" />
                </div>

                <certificate-modal slot="fixed" :epocId="epocId" :certificateShown="certificateShown" />

                <div class="reader-actions" :class="{ showing: showControls }" slot="fixed">
                    <div
                        :aria-disabled="!canNavigatePrevious"
                        aria-label="Précédent"
                        role="button"
                        class="reader-action"
                        :class="{ disabled: !canNavigatePrevious }"
                        @click="navigatePrevious"
                    >
                        <ion-icon aria-hidden="true" src="/assets/icon/double-gauche.svg" />
                    </div>

                    <div aria-label="Menu" role="button" class="reader-action small" @click="displayMenu()">
                        <ion-icon aria-hidden="true" :icon="menu" />
                    </div>

                    <div
                        :aria-disabled="!canNavigateNext"
                        aria-label="Suivant"
                        role="button"
                        class="reader-action"
                        :class="{ disabled: !canNavigateNext }"
                        @click="navigateNext"
                    >
                        <ion-icon aria-hidden="true" src="/assets/icon/double-droite.svg" />
                    </div>
                </div>
            </template>
        </ion-content>
    </ion-page>
</template>

<style scoped lang="scss">
.reader-progress {
    width: 100%;
    top: var(--ion-safe-area-top);
    z-index: 1;
}

ion-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.reader-slider {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.reader {
    position: absolute;
    top: var(--ion-safe-area-top);
    height: calc(100% - var(--ion-safe-area-top));
    width: 100%;
    opacity: 1;
    transition: opacity 0.3s ease;
    background: var(--ion-color-contrast-2);

    swiper-slide {
        flex-direction: column;
        background-color: var(--ion-color-contrast-2);
    }
}

.reader-actions {
    position: absolute;
    bottom: calc(0.25rem + var(--ion-safe-area-bottom));
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateY(150px) translateX(-50%);
    transition: transform 0.3s;
    transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
    z-index: 50;

    &.showing {
        transform: translateY(0) translateX(-50%);
    }

    .reader-action {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3.5rem;
        height: 3.5rem;
        margin: 0.2rem;
        background: var(--ion-color-contrast-3);
        box-shadow: -4px -4px 8px 0 var(--ion-color-reader-action-shadow-1),
            4px 4px 8px 0 var(--ion-color-reader-action-shadow-2);
        border-radius: 4rem;
        font-size: 1.5rem;
        color: var(--ion-color-icon-2);

        &.disabled {
            color: var(--ion-color-reader-action-disabled);
        }

        &.small {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.25rem;
            color: var(--ion-color-icon);
        }

        &.hidden {
            opacity: 0;
        }
    }
}
</style>
