<template>
  <ion-page>
    <app-header 
      :title="$t('ABOUT_PAGE.TITLE')" 
      show-back-button
    />

    <ion-content class="ion-padding">
      <div class="about-container">
        <div class="logo-container">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        
        <h2 class="app-version">{{ $t('ABOUT_PAGE.VERSION') }} 1.0.0</h2>
        
        <p class="app-description">
          {{ $t('ABOUT_PAGE.DESCRIPTION') }}
        </p>
        
        <div class="divider"></div>
        
        <h3>{{ $t('ABOUT_PAGE.DEVELOPED_BY') }}</h3>
        
        <div class="team-container">
          <img src="/assets/team/inria-learning-lab.png" alt="Inria Learning Lab" class="team-logo" />
        </div>
        
        <div class="links-container">
          <ion-button expand="block" fill="outline" href="https://learninglab.inria.fr/" target="_blank">
            <ion-icon name="globe-outline" slot="start"></ion-icon>
            Website
          </ion-button>
          
          <ion-button expand="block" fill="outline" href="https://github.com/inria/epoc-mobile" target="_blank">
            <ion-icon name="logo-github" slot="start"></ion-icon>
            GitHub
          </ion-button>
          
          <ion-button expand="block" fill="outline" href="mailto:contact@epoc.inria.fr" target="_blank">
            <ion-icon name="mail-outline" slot="start"></ion-icon>
            Contact
          </ion-button>
        </div>
        
        <div class="divider"></div>
        
        <div class="legal-links">
          <ion-button fill="clear" size="small" color="medium" router-link="/privacy">
            {{ $t('SETTINGS_PAGE.PRIVACY_POLICY') }}
          </ion-button>
          
          <ion-button fill="clear" size="small" color="medium" router-link="/terms">
            {{ $t('SETTINGS_PAGE.TERMS_OF_SERVICE') }}
          </ion-button>
        </div>
        
        <p class="copyright">
          {{ $t('ABOUT_PAGE.COPYRIGHT') }}
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { 
  IonPage, 
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/vue';

// Components
import AppHeader from '@/components/layout/AppHeader.vue';

// i18n
const { t } = useI18n();
</script>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.epoc-logo {
  background-image: url('/assets/icon/epoc-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 80px;
}

.by-inria {
  background-image: url('/assets/icon/by-inria.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 120px;
  height: 40px;
  margin-top: 10px;
}

.app-version {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--ion-color-medium);
}

.app-description {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ion-color-medium);
  margin-bottom: 2rem;
}

.divider {
  height: 1px;
  background-color: var(--ion-color-light);
  margin: 2rem 0;
}

.team-container {
  margin: 1.5rem 0;
}

.team-logo {
  max-width: 200px;
  height: auto;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.legal-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.copyright {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}
</style>
