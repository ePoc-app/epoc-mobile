<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { removeSecableSpace } from '@/utils/transform';
import Card from '@/components/Card.vue';

defineProps({
  title: String,
  subtitle: String,
  icon: String,
})

</script>

<template>

<card>
  <div class="title-container">
    <div class="title-icon" v-if="icon">
      <ion-icon aria-hidden="true" :icon="icon" :src="icon.indexOf('assets') !== -1 ? icon : null"></ion-icon>
    </div>
    <h5 class="subtitle">{{removeSecableSpace(subtitle)}}</h5>
    <h4 class="title">{{removeSecableSpace(title)}}</h4>
  </div>
  <slot></slot>
</card>
</template>

<style>
:host{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  width:100%;
}

.title-container{
  margin-bottom: 1rem;
  text-align: center;

  .title-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width:3rem;
    height:3rem;
    margin: auto;
    font-size: 1.5rem;
    border-radius: 1rem;
  }

  .subtitle{
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--ion-color-inria);
    text-transform: uppercase;
  }

  .title{
    font-size: 1.3rem;
    font-weight: bold;
  }

  &:after{
    content:'';
    display: block;
    width: 80px;
    height:4px;
    margin: 10px auto;
    border-radius: 2px;
    background: var(--ion-color-inria);
  }
}
</style>
