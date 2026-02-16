<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonBackButton,
    IonButton,
    onIonViewDidEnter,
} from '@ionic/vue';
import { RouterLink } from 'vue-router';
import {
    checkmarkOutline,
    menuOutline,
    arrowForwardOutline,
    timeOutline,
    chevronForwardOutline,
} from 'ionicons/icons';
import { useEpocStore } from '@/stores/epocStore';
import { denormalize } from '@/utils/pipes';
import { watch, Ref, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useReadingStore } from '@/stores/readingStore';
import { Reading } from '@/types/reading';
import { appService } from '@/utils/appService';
import type { Chapter } from '@/types/epoc';
import type { Content } from '@/types/contents/content';
import type { uid } from '@epoc/epoc-types/dist/v1';
import { CONTENT_TYPE_ICONS } from '@/types/content-icons';

const epocStore = useEpocStore();
const readingStore = useReadingStore();

const { epoc } = storeToRefs(epocStore);
const { readings } = storeToRefs(readingStore);

const reading: Ref<Reading | undefined> = ref();

onIonViewDidEnter(() => {
    if (reading.value) {
        setProgress();
    }

    if (appService.screenReaderDetected) {
        (document.querySelector('.toc-content') as HTMLElement).focus();
    }
});

watch(
    [epoc, readings],
    ([epocValue, readingsValue]) => {
        if (!epocValue || !readingsValue) return;
        reading.value = readingsValue.find((item) => item.epocId === epocValue.id);
        if (!reading.value) {
          readingStore.addReading(epocValue.id);
        }
        setProgress();
    },
    { immediate: true }
);

const displayMenu = () => {
    epocStore.epocMainMenu();
};

const toggleDetails = (chapter: any) => {
    chapter.opened = !chapter.opened;
};

function setProgress() {
    if (!reading.value || !epoc.value) return;

    for (const [chapterId, chapter] of Object.entries(epoc.value.chapters)) {
        updateChapterAssessmentStatus(chapter);
        updateChapterOpenedStatus(chapter, chapterId);

        if (chapter.chapterOpened) {
            updateChapterContentsProgress(chapter, chapterId);
            chapter.done = chapter.assessmentDone && chapter.chapterOpened && chapter.allViewed;
        }
    }
}

function updateChapterAssessmentStatus(chapter: Chapter) {
    chapter.assessmentDone =
        chapter.assessments?.every((uid) => {
            isAssessmentCompleted(uid);
        }) ?? false;
}

function updateChapterOpenedStatus(chapter: Chapter, chapterId: string) {
    const chapterIndex = findChapterProgressIndex(chapterId);
    chapter.chapterOpened = chapterIndex !== -1;

    return chapterIndex;
}

function updateChapterContentsProgress(chapter: Chapter, chapterId: string) {
    const chapterIndex = findChapterProgressIndex(chapterId);
    const readingChapter = reading.value!.chaptersProgress[chapterIndex];

    chapter.allViewed = true;
    let resumeLink: string | null = null;
    let prevContentId: string | null = null;

    chapter.initializedContents.forEach((content) => {
        content.viewed = isContentViewed(content, readingChapter);

        if (!content.viewed) {
            chapter.allViewed = false;

            if (!resumeLink) {
                resumeLink = buildResumeLink(chapterId, prevContentId);
                chapter.resumeLink = resumeLink;
            }
        }

        prevContentId = content.id;
    });
}

function isAssessmentCompleted(assessmentUid: string) {
    return reading.value!.assessments.some((assessment) => assessment.id === assessmentUid);
}

function findChapterProgressIndex(chapterId: string) {
    return reading.value!.chaptersProgress.findIndex((chapterProgress) => chapterProgress.id === chapterId);
}

function isContentViewed(content: Content, readingChapter: { id: uid; contents: uid[] }) {
    if (content.type === 'assessment' || content.type === 'simple-question') {
        return isAssessmentCompleted(content.id);
    }

    return readingChapter.contents.includes(content.id);
}

function buildResumeLink(chapterId: string, prevContentId: string | null) {
    const contentPath = prevContentId ? `content/${prevContentId}` : '';

    return `/epoc/play/${epoc.value!.id}/${chapterId}/${contentPath}`;
}

const initializedChapters = computed(() => {
    if (!epoc.value || !reading.value) return;
    const chapters : Chapter[] = denormalize(epoc.value.chapters);

    return chapters.map((chapter) => {
      if (chapter.rule) {
        chapter.locked = !readingStore.isUnlocked(reading.value!, chapter.rule);
      }

      chapter.initializedTocContents = denormalize(chapter.contents, epoc.value!.contents).reduce((initializedContents: Content[], content: Content) => {
        if (content.rule) {
          content.locked = !readingStore.isUnlocked(reading.value!, content.rule);
        }
        if (content.hidden) {
          return initializedContents;
        }

        initializedContents.push(content);
        return initializedContents;
      }, []);

      return chapter;
    });
});
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/library" color="inria-icon"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('TOC_PAGE.HEADER') }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button v-on:click="displayMenu()">
                        <ion-icon slot="icon-only" :icon="menuOutline" color="inria-icon"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <div v-if="epocStore.epoc" class="wrapper">
                <div class="toc-header">
                    <img
                        v-if="epocStore.epoc.image"
                        aria-hidden="true"
                        alt="ePoc Image"
                        :src="epocStore.rootFolder + epocStore.epoc.image"
                    />
                    <div class="toc-header-title">{{ epocStore.epoc.title }}</div>
                </div>
                <div class="toc-content" tabindex="-1">
                    <div class="toc-chapter" v-for="(chapter, index) of initializedChapters" :key="index">
                        <template v-if="chapter.locked">
                          <div class="toc-chapter-summary">
                            <div class="toc-chapter-progress">
                              <ion-icon aria-hidden="true" :icon="CONTENT_TYPE_ICONS['locked']"></ion-icon>
                            </div>
                            <div class="toc-chapter-info">
                                <div class="toc-chapter-info-label">{{ $t('PLAYER.LOCKED_CONTENT') }}</div>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="toc-chapter-summary">
                              <div class="toc-chapter-progress" :class="{ done: chapter.done }">
                                  <ion-icon aria-hidden="true" :icon="checkmarkOutline" v-if="chapter.done"></ion-icon>
                                  <ion-icon
                                      aria-hidden="true"
                                      :icon="arrowForwardOutline"
                                      v-if="!chapter.done && chapter.chapterOpened"
                                  ></ion-icon>
                                  <ion-icon
                                      aria-hidden="true"
                                      :icon="timeOutline"
                                      v-if="!chapter.done && !chapter.chapterOpened"
                                  ></ion-icon>
                              </div>
                              <div class="toc-chapter-info">
                                  <RouterLink :to="chapter.resumeLink" class="toc-chapter-info-title">
                                      <div class="toc-chapter-info-label">{{ chapter.title }}</div>
                                      {{ chapter.subtitle }}
                                  </RouterLink>
                                  <div class="toc-chapter-info-details" v-on:click="toggleDetails(chapter)">
                                      <template v-if="chapter.opened">{{ $t('TOC_PAGE.VIEW_LESS') }}</template>
                                      <template v-if="!chapter.opened">{{ $t('TOC_PAGE.VIEW_MORE') }}</template>
                                  </div>
                              </div>
                              <RouterLink
                                  :to="chapter.resumeLink"
                                  class="toc-chapter-open"
                                  :aria-label="$t('TOC_PAGE.NEXT_CHAPTER')"
                              >
                                  <ion-icon aria-hidden="true" :icon="chevronForwardOutline" color="inria"></ion-icon>
                              </RouterLink>
                          </div>
                          <div class="toc-chapter-details" v-if="chapter.opened">
                              <template
                                  v-for="content of chapter.initializedTocContents"
                                  :key="content.id"
                              >
                                  <RouterLink
                                      :to="{
                                          name: 'PlayerContent',
                                          params: {
                                              epoc_id: epocStore.epoc.id,
                                              chapter_id: chapter.id,
                                              content_id: content.id,
                                          },
                                      }"
                                      class="toc-chapter-details-item"
                                      :class="{ viewed: content.viewed }"
                                  >
                                    <template v-if="content.locked">
                                      <div aria-hidden="true" class="toc-chapter-details-item-icon">
                                        <ion-icon :icon="CONTENT_TYPE_ICONS['locked']" slot="start"></ion-icon>
                                      </div>
                                      <div>{{ $t('PLAYER.LOCKED_CONTENT') }}</div>
                                    </template>
                                    <template v-else>
                                      <div aria-hidden="true" class="toc-chapter-details-item-icon">
                                          <ion-icon :icon="CONTENT_TYPE_ICONS[content.type]" slot="start"></ion-icon>
                                      </div>
                                      <div>{{ content.title || $t('PLAYER.CONTENT_WITHOUT_TITLE') }}</div>
                                    </template>
                                  </RouterLink>
                              </template>
                          </div>
                        </template>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped lang="scss">
.wrapper {
    max-width: 600px;
    margin: auto;
    padding: 1rem;

    .toc-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        margin-bottom: 1em;

        img {
            height: 4rem;
            width: 4rem;
            margin-right: 1rem;
            object-fit: cover;
            box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.33), 0 3px 4px 0 rgba(0, 0, 0, 0.16);
            border-radius: 0.25rem;
        }

        .toc-header-title {
            font-size: 1.1rem;
            font-weight: bold;
        }
    }
}

.toc-chapter {
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: var(--ion-color-content);
    box-shadow: 0 6px 10px 0 var(--ion-color-shadow);
    border-radius: 0.5rem;

    &-summary {
        display: flex;
    }

    &-progress {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.75rem;
        border-radius: 1rem;
        color: var(--ion-color-inria-icon);
        background: var(--ion-color-contrast);

        &.done {
            color: var(--ion-color-inria-correct);
            background: var(--ion-color-correct-background);
        }
    }

    &-info {
        display: block;
        flex: 1;
        align-content: center;
        &-label {
            font-weight: bold;
            line-height: 1.2;
        }
        &-title {
            line-height: 1.2;
            text-decoration: none;
            color: var(--ion-color-text);
        }
        &-details {
            color: var(--ion-color-inria);
        }
    }

    &-open {
        align-self: center;

        ion-icon {
            display: block;
        }
    }

    &-details {
        border-top: 1px solid var(--ion-color-contrast);

        &-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            margin-top: 0.5rem;
            border-radius: 8px;
            background: var(--ion-color-contrast-2);
            text-decoration: none;
            color: var(--ion-color-text);

            &.viewed {
                background: var(--ion-color-correct-background);

                .toc-chapter-details-item-icon {
                    background: var(--ion-color-icon-correct-background);
                }
            }

            &-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                width: 2rem;
                height: 2rem;
                margin-right: 1rem;
                border-radius: 0.8rem;
                background: var(--ion-color-contrast);
            }
        }
    }
}
</style>
