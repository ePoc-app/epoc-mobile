<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { CustomQuestion } from '@epoc/epoc-types/dist/v1/question';
import HtmlContent from '@/views/epoc/content/HtmlContent.vue';
import { usePlugin } from '@/composables';

// TODO : Test this question

const props = defineProps<{
  question: CustomQuestion;
  disabled: boolean;
}>();

const emit = defineEmits(['userResponse']);

const html = ref<string | null>(null);

const pluginService = usePlugin();

watch(() => pluginService.currentMessage, (message: any) => {
  if (message.event === 'user-responded') {
    userResponded(message.payload);
  }
})

onMounted(() => {
  // Generate the iframe HTML from the service
  html.value = pluginService.createEmbeddedIframeFromTemplateName(
      props.question.template,
      props.question.data
  );
});

const userResponded = (answer: any) => {
  // Emitting as an array to maintain consistency with the original component logic
  emit('userResponse', [answer]);
};
</script>

<template>
  <html-content v-if="html" :html="html"></html-content>
</template>

<style scoped lang="scss">
ion-radio-group {
  display: block;
  margin-top: 2rem;
}

ion-item {
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  --min-height: 3.2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

ion-radio {
  --color: var(--ion-color-inria-lightgrey);
  --color-checked: var(--ion-color-inria-spe);
  background: white;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1.5rem;

  & + ion-label {
    padding-top: 0.2em;
    color: var(--ion-color-text);
  }
}
</style>