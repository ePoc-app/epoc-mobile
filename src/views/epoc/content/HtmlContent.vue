<script setup lang="ts">
import renderMathInElement from 'katex/contrib/auto-render';
import mermaid from 'mermaid';
import GLightbox from 'glightbox';
import { computed, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PluginService } from '@/services/pluginService';
import { onIonViewDidEnter, onIonViewDidLeave } from '@ionic/vue';

const props = defineProps({
  html: {
    type : String,
    required: true
  },
})

const emit = defineEmits<{
  goTo: [contentId: string]
}>()

const router = useRouter()
const route = useRoute()
const content = useTemplateRef('content')
const pluginService = new PluginService()
const epocId = ref<string>(route.params.epoc_id.toString())
const chapterId = ref<string>(route.params.chapter_id.toString())

const pluggedHtml = computed(() => pluginService.embed(props.html));


onIonViewDidEnter( async () => {
  renderMath()
  await renderMermaid()
});

onIonViewDidLeave(() => {
  /* TODO Why ??
    if (event.target && event.target.nodeName === 'A' && event.target.hasAttribute('linkto')) {
      const [chapterId, content, contentId] = event.target.getAttribute('linkto').split('/')
      if (chapterId === chapterId && contentId) {
        emit('goTo', contentId)
      } else {cs
        router.push(`/epoc/play/${epocId}/${event.target.getAttribute('linkto')}`);
      }
    } */
});


const handleClick = (event: Event) => {
    if ((event.target as HTMLElement).tagName === 'IMG') {
        const imgSrc = (event.target as HTMLImageElement).src;
        openLightBox(imgSrc);
    }
}

const openLightBox = (imageUrl: string) => {
  const elements = [{
    href: imageUrl,
    type: 'image',
    alt: 'image text alternatives'
  }]
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: false,
        zoomable: true,
        draggable: true,
        elements: elements,
    });
    lightbox.open();
}

const renderMath = () => {
  if (content.value) {
    renderMathInElement(content.value, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
        output: 'html'
    });
  }
}

const renderMermaid = async () => {
  mermaid.initialize({ startOnLoad: false });
  const mermaidDiagram = content.value?.querySelector('.mermaid');
  if(mermaidDiagram) {
      const { svg } = await mermaid.render('mermaid-svg', mermaidDiagram.innerHTML);
      mermaidDiagram.innerHTML = svg;
  }
}
</script>

<template>
  <div ref="content" class="html-content" v-html="pluggedHtml" @click="handleClick($event)"/>
</template>

<style lang="scss">
@use "sass:color";

.html-content{
  $inria-red : #e63312;
  $inria-red-bg : color.adjust($inria-red, $lightness: 48%);
  $inria-blue : #40455a;
  $inria-blue-border : color.adjust($inria-blue, $lightness: 50%);
  $inria-blue-bg : color.adjust($inria-blue, $lightness: 64%);
  $inria-grey : #eeeff3;

  user-select: text;

  @function pow($number, $exponent) {
    $value: 1;

    @if $exponent > 0 {
      @for $i from 1 through $exponent {
        $value: $value * $number;
      }
    }

    @return $value;
  }

  @for $i from 1 through 6 {
    h#{7 - $i} {
      font-size: pow(1.125, $i) * 16px;
      font-weight: 700;
      line-height: 1;
      color: var(--ion-color-text);
      margin: 0 0 .5em 0;
      padding: 0;
      text-transform: unset;
    }

    * + h#{7 - $i} {
      margin-top: 1em;
    }
  }

  .ill-icon{
    font-style: normal!important;
  }

  .ill-alert{
    display: flex;
    align-items: center;
    margin: 1em 0;
    background: var(--ion-color-inria);

    .ill-icon{
      min-width: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 20px;
      color:white;
    }

    p, ul, ol, div{
      padding: 1em;
      margin: 0;
      font-size: 16px;
      color:white;
    }

    .ill-icon + p, .ill-icon + *{
      padding:5px;
    }

    &.alert-blue{
      background: var(--ion-color-inria-blue);
    }

    &.alert-grey{
      background: var(--ion-color-contrast);

      div, p, ul, ol, .ill-icon, .ill-icon + * {
        color: var(--ion-color-text);
      }
    }
  }

  .accordion{
    position: relative;
    margin: 1em 0;
    color: var(--ion-color-text);

    i{
      display: inline-block;
      margin-right: 5px;
      transition: transform .25s;
      color: var(--ion-color-inria);
      height: 1em;
    }

    .accordion-header{
      position: relative;
      display: flex;
      align-items: center;
      padding: 7px 5px 5px 5px;
      border: 1px solid var(--ion-color-border);
      border-radius: 3px;
      color: var(--ion-color-text);
      cursor: pointer;

      span {
        flex-grow: 1;
        color: var(--ion-color-text)!important;
      }
    }

    .accordion-body {
      padding: 0;
      max-height: 0;
      overflow: hidden;

      & *:first-child{
        margin-top: 0;
      }

      & *:last-child{
        margin-bottom: 0;
      }
    }

    input:checked ~ .accordion-body{
      max-height: 150rem;
      padding: .5rem;
      border: 1px solid var(--ion-color-border);
      border-top: none;
      border-radius: 0 0 3px 3px;
    }

    input:checked ~ .accordion-header{
      border-radius: 3px 3px 0 0;
      i{
        transform: rotate(90deg);
      }
    }
  }

  .btn {
    width: 100%;
    margin-top: 1em;
    padding: .7em 1em 0.5em 1em;
    background: var(--ion-color-background);
    font-weight: bold;
    color: var(--ion-color-text);
    border-radius: 4px;
    border: 1px solid var(--ion-color-text);
    cursor: pointer;
  }

  .katex-display {
    display: inline;

    .katex {
      display: inline;

      .katex-html {
        display: inline;
      }
    }
  }

}
</style>
