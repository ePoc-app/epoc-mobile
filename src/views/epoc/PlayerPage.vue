<script setup lang="ts">
import {uid} from '@epoc/epoc-types/src/v1';
import { IonContent, IonIcon, IonPage, IonProgressBar, onIonViewWillLeave, IonSpinner, onIonViewDidEnter} from '@ionic/vue';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useEpocStore } from '@/stores/epocStore';
import { useReadingStore } from '@/stores/readingStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useRoute, useRouter } from 'vue-router';
import { onIonViewWillEnter } from '@ionic/vue';
import { storeToRefs } from 'pinia';
import { Chapter, Epoc } from '@/types/epoc';
import { Reading, UserAssessment } from '@/types/reading';
import { Settings } from '@/types/settings';
import { Assessment, SimpleQuestion } from '@epoc/epoc-types/dist/v2';
import { Content } from '@/types/contents/content';
import { srcConvert } from '@/utils/transform';
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
import { documentTextOutline, cubeOutline, playCircleOutline, micOutline, helpOutline, gitBranchOutline} from 'ionicons/icons'; 
import AssessmentContent from './content/AssessmentContent.vue';

  //Store
  const epocStore = useEpocStore()
  const readingStore = useReadingStore()
  const settingsStore = useSettingsStore()       
  const router = useRouter();
  const route = useRoute();

  // # Const
  const iconFromType = {
      html: documentTextOutline,
      assessment: cubeOutline,
      video: playCircleOutline,
      audio: micOutline,
      'simple-question': helpOutline,
      choice: gitBranchOutline
  };
  let readerSlides = ref<SwiperObject>() //undefined; // will be set only once on mounted 

  // # ref
  const { epoc } = storeToRefs(epocStore)
  const { settings } = storeToRefs(settingsStore)
  const { readings } = storeToRefs(readingStore)

  const epocId = ref<string>(route.params.epoc_id.toString())
  const chapterId = ref<string>(route.params.chapter_id.toString())
  const contentId = ref<string>(route.params.content_id?.toString())
  const next = ref<string>(route.params.next?.toString())

  const reading = ref<Reading>();
  const pagesCount = ref<number>(0);
  const dataInitialized = ref(false);
  const currentPage = ref(0);
  const progress = ref(0);
  const contentsFilteredConditional = ref<Content[]>();

  const assessmentData = ref();
  const certificateShown = ref(false);
  const showControls = ref(true);

  const nextChapterIndex = ref();
  const nextChapterId = ref<uid>();
  
  // # computed
  const chapterIndex = computed<number>(() => Object.keys(epoc.value?.chapters || []).indexOf(chapterId.value));
  const chapter = computed<Chapter>(() => epoc.value?.chapters[chapterId.value]);
  const nextChapter = computed<Chapter>(() => epoc.value?.chapters[nextChapterId.value])
  const assessments = computed(() => epoc.value?.assessments || [])
  const readerStyles = computed(() =>  (settings.value) ? 
    {
      'font-family': settings.value.font,
      'font-size': settings.value.fontSize + 'px',
      'line-height': settings.value.lineHeight
    } :
    {
      'font-family': 'Inria Sans',
      'font-size': '16px',
      'line-height': 1.4
    }
  );

  // # watcher
  watch(epoc, (newEpoc) => {
    initDataFromEpoc(newEpoc)
  });
  watch(() => chapterIndex,
    (newChapterIndex) => {
      nextChapterIndex.value = newChapterIndex.value + 1
      nextChapterId.value = (newChapterIndex.value <= Object.entries(epoc.value.chapters).length ) ? Object.keys(epoc.value.chapters)[newChapterIndex.value + 1] : undefined;      
  })
  watch(() => route.params.epoc_id,
    (newId) => { 
      epocId.value = newId.toString()
      epocStore.getEpocById(epocId.value)
  })  
  watch(() => route.params.chapter_id, (newId) => { chapterId.value = newId.toString()})
  watch(() => route.params.next, (newNext) => { next.value = newNext.toString()})

  // # Lifecycle

  onIonViewWillEnter(() => {
    epocStore.getEpocById(epocId.value).then((newEpoc) => initDataFromEpoc(newEpoc))
  });

  onIonViewDidEnter(() => {
    updateFocus()
  })

  onIonViewWillLeave(() => {
      stopAllMedia();
  })

  // # Methods

  const initDataFromEpoc = (epoc: Epoc) => {
    readingStore.saveStatement(epocId.value, 'chapters', chapterId.value, 'started', true);
    reading.value  = readings.value.find((item: Reading) => item.epocId === epocId.value);
    if (!reading.value) readingStore.addReading(epocId.value);
    contentsFilteredConditional.value = chapter.value?.initializedContents.filter((content) => { // filter out conditional content
      return !content.conditional || (content.conditional && reading.value?.flags.indexOf(content.id) !== -1);
    });
    readingStore.saveChapterProgress(epocId.value, chapterId.value);
    setAssessmentsData();
    dataInitialized.value = true;
  }


  // ## Swiper related : 

  // called only once, automatically done by the swiper event 
  const setSwiperRef = (swiper : SwiperObject) => {
    if (!readerSlides.value){
      readerSlides.value = swiper
    }
  }

  const prevPage = () => {
    readerSlides.value?.slidePrev();
  }

  const nextPage = () => {
    readerSlides.value?.slideNext();
  }

  const goTo = (contentId: uid, time?: number) => {
      // Go to the next content after contentId
      const pageIndex = contentsFilteredConditional.value?.findIndex(content => content.id === contentId) || 0;
      const index = next ? pageIndex + 2 : pageIndex + 1; // If next: go to the next content after id

      countPages();
      readerSlides.value?.slideTo(index, time);
      currentPage.value = index;
      progress.value = pageIndex / pagesCount.value;
  }

  const onSlideChange = () => {
    stopAllMedia();
    const index = readerSlides.value?.activeIndex || 0;
    currentPage.value = index;
    countPages();
    updateCurrentContent(index);
    progress.value = index / pagesCount.value;
  }

    // /!\ this event is binded from videplayer and dragable element
  const onDrag = (event: DragEvent) => {
      if (event === 'dragstart') {
          readerSlides.value?.disable()
      } else {
          readerSlides.value?.enable();
      }
  }

  const countPages = () => {
    pagesCount.value = (contentsFilteredConditional.value?.length || -1 ) + 1;
    readerSlides.value?.updateSlides();  
  }

  ///// ### Others methods 

  const hideControls = () => {
    if(!appService.screenReaderDetected) {
      showControls.value = false;
    }
  }

  const toggleControls = ($event: Event) => {
    if (['ion-icon', 'button', 'ion-button', 'ion-icon', 'ion-checkbox', 'ion-radio', 'span'].includes(
        ($event.target as HTMLElement).tagName.toLowerCase()
    )) return;
    if(!appService.screenReaderDetected) {
        showControls.value = !showControls.value;
    }
  }
  
  const updateCurrentContent = (index: number) => {
    const content = chapter.value?.initializedContents.filter(
        c => !c.conditional || ( c.conditional && reading.value?.flags.indexOf(c.id) !== -1 )
    )[index - 1]
    if (content) {
        router.push({ name: 'Player', params: { epocId: epocId.value, chapterId: chapterId.value, contentId: content.id } })
        readingStore.saveChapterProgress(epocId.value, chapterId.value, content.id);
        // tracker.trackPageView(); TODO Matomo Tracker
        readingStore.saveStatement(epocId.value, 'pages', content.id, 'viewed', true);
        if (content.type === 'html') {
            readingStore.saveStatement(epocId.value, 'contents', content.id, 'read', true);
        }
    }
  }

  const updateFocus = () => {
    if(appService.screenReaderDetected) {
        (document.querySelector('app-epoc-player.ion-page:not(.ion-page-hidden) .reader') as HTMLElement).focus();
    }
  }

  const displayMenu = () => {
      epocStore.epocMainMenu(chapterIndex.value, chapter.value);
  }

  const stopAllMedia = () => {
    const medias = Array.from(document.querySelectorAll('audio,video')) as HTMLMediaElement[];
    medias.forEach((media) => {
        media.pause();
    });
  }

  const setAssessmentsData = () => {
    if(epoc.value) {
      assessmentData.value = {
          totalUserScore: 0,
          totalScore: 0
      };

      assessments.value.forEach((assessment) => {
        const userAssessment = reading.value?.assessments.find( (a: UserAssessment) => assessment.id === a.id);
        const scoreTotal = epocStore.calcScoreTotal(epoc.value, assessment.questions);

        if (userAssessment && userAssessment.score > 0) {
            assessmentData.value.totalUserScore += userAssessment.score;
        }
        assessmentData.value.totalScore += scoreTotal;
      });

      if (assessmentData.value.totalUserScore >= epoc.value.certificateScore 
        && (reading.value?.badges.length || 0) >= epoc.value.certificateBadgeCount) {
          showCertificateCard();
      }
    }
  }

  const showCertificateCard = () => {
    if (!reading.value?.certificateShown) { 
        certificateShown.value = true;
        readingStore.updateCertificateShown(epoc.value.id, true);
    }
  }

  /*
                    <common-content :aria-hidden="index + 1 !== currentPage" :title="content.title" :subtitle="content.subtitle" :icon="iconFromType[content.type]" v-if="content.type !== 'simple-question'">
                    <audio-content v-if="content.type === 'audio'" [inputContent]="content" @timelineDragging="onDrag($event)"></audio-content>
                    <course-choice v-if="content.type === 'choice'" :epocId="epocId" :content="content" @chosen="nextPage()"></course-choice>
                  </common-content>
   */

</script>

<template>
  <ion-page>
    <ion-content> 
      <ion-spinner v-if="!dataInitialized"></ion-spinner>
      <template v-else="dataInitialized">
        <div class="reader" slot="fixed" :style="readerStyles" tabindex="-1">
          <swiper @swiper="setSwiperRef" 
            v-on:tap="toggleControls($event)" @slide-change-transition-end="updateFocus()" 
            @slider-move="hideControls()" @slide-change-transition-start="onSlideChange()" 
            class="reader-slider">
            <swiper-slide>
              <app-debug :epocId="epocId" :chapterId="chapterId" contentId="debut"></app-debug>
              <chapter-info :chapter="chapter"></chapter-info>
            </swiper-slide>
            <template v-for="(content, index) in chapter.initializedContents">
              <template v-if="!content.conditional || ( content.conditional && reading?.flags.indexOf(content.id) !== -1 )">
                <swiper-slide>
                  <app-debug :epocId="epocId" :chapterId="chapterId" :contentId="content.id"></app-debug>
                  {{content.type}}
                  <common-content :aria-hidden="index + 1 !== currentPage" :title="content.title" :subtitle="content.subtitle" :icon="iconFromType[content.type]" v-if="content.type !== 'simple-question'">
                    <html-content v-if="content.type === 'html'" :html="srcConvert(content.html, epocStore.rootFolder)" @go-to="goTo($event)"></html-content>
                    <video-content v-if="content.type === 'video'" :content="content" @timeline-dragging="onDrag($event)"></video-content>
                    <assessment-content v-if="content.type === 'assessment'" :content="content"></assessment-content>
                  </common-content>
                  <simple-question v-if="content.type === 'simple-question'" :aria-hidden="index + 1 !== currentPage" 
                    :epocId="epocId" :content="content" :question="epoc.questions[content.question]" @dragging="onDrag($event)">
                  </simple-question>
                </swiper-slide>
              </template>
            </template>
            <swiper-slide>
              <app-debug :epocId="epocId" :chapterId="chapterId" contentId="fin"></app-debug>
                <common-content :title="$t('PLAYER.MODULE_END.FINISH')" :subtitle="$t('PLAYER.MODULE_END.CONGRATS')" icon="assets/icon/modulecheck.svg">
                  <chapter-end :epoc="epoc" :chapter="chapter" :nextChapter="nextChapter"></chapter-end>
                </common-content>
            </swiper-slide>
          </swiper>
        </div>
        <div aria-hidden="true" class="reader-progress" slot="fixed">
          <ion-progress-bar color="inria" :value="progress"></ion-progress-bar>
        </div>
        <template slot="fixed" style="position:relative">
          <certificate-modal  :epocId="epocId" :certificateShown="certificateShown"></certificate-modal>
        </template>
        <div class="reader-actions" :class="{'showing': showControls}" slot="fixed">
          <div :aria-disabled="currentPage === 0" aria-label="Précédent" role="button" class="reader-action" :class="currentPage === 0 ? 'disabled':''" v-on:click="prevPage()">
            <ion-icon aria-hidden="true" src="/assets/icon/double-gauche.svg"></ion-icon>
          </div>
          <div aria-label="Menu" role="button" class="reader-action small" v-on:click="displayMenu()">
            <ion-icon aria-hidden="true" :icon="menu"></ion-icon>
          </div>
          <div :aria-disabled="currentPage > (contentsFilteredConditional?.length || -1)" aria-label="Suivant" role="button" class="reader-action" :class="currentPage > (contentsFilteredConditional?.length || -1) ? 'disabled':''" v-on:click="nextPage()">
            <ion-icon aria-hidden="true" src="/assets/icon/double-droite.svg"></ion-icon>
          </div>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.reader-progress{
  width: 100%;
  top: var(--ion-safe-area-top);
  z-index: 1;
}

 ion-spinner{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }

  .reader-slider{
    position: absolute;
    height:100%;
    width: 100%;
    overflow: hidden;
  }

.reader{
  position: absolute;
  top: var(--ion-safe-area-top);
  height: calc(100% - var(--ion-safe-area-top));
  width: 100%;
  opacity: 1;
  transition: opacity .3s ease;
  background: var(--ion-color-contrast-2);

  swiper-slide{
    flex-direction: column;
    background-color: var(--ion-color-contrast-2);
  }
}

.reader-actions{
  position: absolute;
  bottom: calc(.25rem + var(--ion-safe-area-bottom));
  left:50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(150px) translateX(-50%);
  transition: transform .3s;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  z-index: 50;

  &.showing{
    transform: translateY(0) translateX(-50%);;
  }

  .reader-action{
    display: flex;
    justify-content: center;
    align-items: center;
    width:3.5rem;
    height:3.5rem;
    margin: .2rem;
    background: var(--ion-color-contrast-3);
    box-shadow: -4px -4px 8px 0 var(--ion-color-reader-action-shadow-1), 4px 4px 8px 0 var(--ion-color-reader-action-shadow-2);
    border-radius: 4rem;
    font-size: 1.5rem;
    color:var(--ion-color-icon-2);

    &.disabled{
      color: var(--ion-color-reader-action-disabled);
    }

    &.small{
      width:2.5rem;
      height:2.5rem;
      font-size: 1.25rem;
      color:var(--ion-color-icon);
    }

    &.hidden{
      opacity: 0;
    }
  }
}

</style>
