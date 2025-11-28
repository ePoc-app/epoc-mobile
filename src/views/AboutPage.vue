<script setup lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-header mode="ios">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/" color="inria-icon"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t('ABOUT_PAGE.ABOUT') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="about-content-wrapper">
        <div aria-hidden="true" class="about-header">
          <div class="logo" slot="start">
            <div class="epoc-logo"></div>
          </div>
          <div class="logo" slot="end">
            <ion-img src="assets/img/logo-inria.png"></ion-img>
          </div>
        </div>
        <div class="about-text">
          <h4>{{ $t('ABOUT_PAGE.EPOC_APPLICATION') }}</h4>
          <p v-html="$t('ABOUT_PAGE.EPOC_DESCRIPTION')">
          </p>
        </div>
        <div class="about-data">
          <h4>{{ $t('ABOUT_PAGE.PERSONAL_DATA') }}</h4>
          <p>{{ $t('ABOUT_PAGE.PERSONAL_DATA_DESCRIPTION') }}</p>
          <h4>{{ $t('ABOUT_PAGE.ANALYTICS') }}</h4>
          <p>
            {{ $t('ABOUT_PAGE.ANALYTICS_DESCRIPTION_1') }}
          </p>
          <p>
            {{ $t('ABOUT_PAGE.ANALYTICS_DESCRIPTION_2') }}
          </p>
          <p v-html="$t('ABOUT_PAGE.ANALYTICS_DESCRIPTION_3')">
          </p>
          <p>
            {{ $t('ABOUT_PAGE.ANALYTICS_DESCRIPTION_4') }}
          </p>
        </div>
        <div class="about-contact">
          <h4>{{ $t('ABOUT_PAGE.CONTACT') }}</h4>
          <p>
            {{ $t('ABOUT_PAGE.CONTACT_ILL') }}<br />
            <a href="mailto:ill-epoc-contact@inria.fr" title="Contact Inria Learning Lab">ill-ePoc-contact@inria.fr</a>
          </p>
          <p>
            {{ $t('ABOUT_PAGE.CONTACT_DPO') }}<br />
            <a href="mailto:dpo@inria.fr" title="Contact Délégué à la protection des données">dpo@inria.fr</a>
          </p>
          <h4>{{ $t('ABOUT_PAGE.PRIVACY_POLICY') }}</h4>
          <p>
            {{ $t('ABOUT_PAGE.PRIVACY_POLICY_ABOUT') }}<br />
            <a href="https://epoc.inria.fr/privacy" title="Privacy policy link"
              target="_blank">https://epoc.inria.fr/privacy</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.about-header {
  display: flex;
  margin: 1em 0;

  .logo {
    width: 35%;
    max-width: 150px;
    margin: 0 1em;

    .epoc-logo {
      display: block;
      width: 100%;
      height: 100%;
      background: var(--epoc-logo) no-repeat;
    }
  }
}

.about-content-wrapper {
  padding: 1em;

  h4 {
    margin-top: 0;
    padding: .5em 0;
    font-size: 1rem;
    color: var(--ion-color-inria);
    border-bottom: 1px solid var(--ion-color-item);
  }
}

a {
  color: var(--ion-color-inria);
}
</style>