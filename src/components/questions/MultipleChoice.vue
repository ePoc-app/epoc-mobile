<script setup lang="ts">
// TO DO
</script>

<template>
<ion-list>
  <ion-item *ngFor="let response of question.responses" lines="none">
    <ion-checkbox mode="md" slot="start" [value]="response.value" (ionChange)="selectAnswer($event)"
                  [checked]="this.selectedAnswers.indexOf(response.value) !== -1" [disabled]="disabled">
    </ion-checkbox>
    <ion-label class="ion-text-wrap">{{response.label}}</ion-label>
  </ion-item>
</ion-list>
</template>

<style scoped lang="scss">
ion-list{
  display: block;
  margin-top: 2rem;
  background: var(--ion-color-content);
}

ion-item{
  margin-bottom: .5rem;
  border-radius: .5rem;
  --min-height: 3.2rem;
  --background: var(--ion-color-contrast);
  &:last-child{
    margin-bottom: 0;
  }
}

ion-checkbox{
  --border-color: white;
  --border-color-checked: white;
  --background: white;
  --background-checked: var(--ion-color-inria-spe);
  --border-radius: .375rem;
  --border-width: .25rem;
  --checkmark-color: transparent;
  background: white;
  width: 1.5rem;
  height: 1.5rem;
  border:1px solid var(--ion-color-unique-1);
  border-radius: .375rem;

  & + ion-label{
    padding-top: .2em;
    color: var(--ion-color-text);
  }
}
</style>
