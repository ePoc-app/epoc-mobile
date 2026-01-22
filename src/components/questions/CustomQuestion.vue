<script setup lang="ts">
import { watch, computed } from 'vue';
import { CustomQuestion } from '@epoc/epoc-types/dist/v1/question';
import HtmlContent from '@/views/epoc/content/HtmlContent.vue';
import { usePlugin } from '@/composables';

const props = defineProps<{
  question: CustomQuestion;
  disabled: boolean;
}>();

const emit = defineEmits(['userHasResponded']);

const plugin = usePlugin();

watch(plugin.currentMessage, (message: any) => {
  if (message.event === 'user-responded') {
    userResponded(message.payload);
  }
})

const pluggedHtml = computed(() => {
  if (plugin.allPluginLoaded.value) {
    return plugin.createEmbeddedIframeFromTemplateName(
        props.question.template,
        props.question.data
    );
  }
  return '';
});

const userResponded = (answer: any) => {
  emit('userHasResponded', [answer]);
};
</script>

<template>
  <html-content :html="pluggedHtml"></html-content>
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