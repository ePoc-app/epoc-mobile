<script setup lang="ts">

import { Assessment } from '@/types/contents/assessment';
import { useReadingStore } from '@/stores/readingStore';
import { useEpocStore } from '@/stores/epocStore';
import { computed, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { school, help } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

const epocStore = useEpocStore()
const readingStore = useReadingStore()
const {t} = useI18n()
// PROPS
const props = defineProps({
  content: {
    type : Object as PropType<(Assessment)>,
    required: true
  },
})

const { epoc } = storeToRefs(epocStore)
const { readings } = storeToRefs(readingStore)

const reading = computed(() => readings.value.find(question => question.epocId === epoc.value.id))
const userAssessment = computed(() => reading.value?.assessments.find(assessment => assessment.id === props.content.id ))
const isGraded = computed(() => (props.content.scoreTotal || -1) > 0)
const questionNumber = computed(() => props.content.questions?.length || 0)

</script>

<template>
  <div class="assessment-specs">
  <div class="assessment-spec">
    <div class="assessment-spec-icon"><ion-icon aria-hidden="true" :icon="school"></ion-icon></div>
    <div class="assessment-spec-value" v-if="isGraded">{{$t('PLAYER.ASSESSMENT_COMPONENT.GRADED')}}</div>
    <div class="assessment-spec-value" v-if="!isGraded">{{$t('PLAYER.ASSESSMENT_COMPONENT.NOT_GRADED')}}</div>
  </div>
  <div class="assessment-spec">
    <div class="assessment-spec-icon"><ion-icon aria-hidden="true" :icon="help"></ion-icon></div>
    <div class="assessment-spec-value">{{t('MISSING.QUESTION', questionNumber, { named: { nb: questionNumber } } )}}</div>
  </div>
</div>
<p>{{content.summary}}</p>
<div>
  <ion-button expand="block" size="large" fill="outline" color="outline-button" router-link="['/epoc/assessment', epocId, content.id]">
    <span v-if="!userAssessment">
      {{t('PLAYER.ASSESSMENT_COMPONENT.START')}}
    </span>
    <span v-if="userAssessment">
      {{t('PLAYER.ASSESSMENT_COMPONENT.REDO')}}
    </span>
  </ion-button>
</div>

</template>

<style>
.assessment-specs{
  display: flex;
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--ion-color-specs);
  text-align: center;
  align-items: center;
  justify-content: center;

  .assessment-spec{
    padding: 0 1.5rem;
  }

  .assessment-spec:nth-child(2){
    border-left: 1px solid var(--ion-color-unique-2);
  }

  ion-icon{
    font-size: 1.5rem;
  }
}
</style>
