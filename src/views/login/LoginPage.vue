<template>
  <ion-page>
    <app-header 
      :title="$t('LOGIN_PAGE.TITLE')" 
      show-back-button
    />

    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="logo-container">
          <div class="epoc-logo"></div>
          <div class="by-inria"></div>
        </div>
        
        <form @submit.prevent="login" class="login-form">
          <ion-list>
            <ion-item>
              <ion-label position="floating">{{ $t('LOGIN_PAGE.USERNAME') }}</ion-label>
              <ion-input 
                v-model="username" 
                type="text" 
                required
                autocomplete="username"
              ></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="floating">{{ $t('LOGIN_PAGE.PASSWORD') }}</ion-label>
              <ion-input 
                v-model="password" 
                type="password" 
                required
                autocomplete="current-password"
              ></ion-input>
            </ion-item>
          </ion-list>
          
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          
          <ion-button 
            expand="block" 
            type="submit" 
            color="inria"
            :disabled="isLoading"
          >
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
            <span v-else>{{ $t('LOGIN_PAGE.LOGIN') }}</span>
          </ion-button>
          
          <div class="forgot-password">
            <ion-button fill="clear" size="small" color="medium">
              {{ $t('LOGIN_PAGE.FORGOT_PASSWORD') }}
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { 
  IonPage, 
  IonContent, 
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/vue';

// Components
import AppHeader from '@/components/layout/AppHeader.vue';

// i18n
const { t } = useI18n();

// Router
const router = useRouter();
const route = useRoute();

// State
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Check for error parameter in route
if (route.params.error) {
  errorMessage.value = t('LOGIN_PAGE.ERROR');
}

// Methods
const login = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Simulate login API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, accept any non-empty username/password
    if (username.value.trim() && password.value.trim()) {
      // Successful login
      router.replace('/library');
    } else {
      // Failed login
      errorMessage.value = t('LOGIN_PAGE.ERROR');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = t('LOGIN_PAGE.ERROR');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 1rem;
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
  width: 150px;
  height: 60px;
}

.by-inria {
  background-image: url('/assets/icon/by-inria.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  height: 30px;
  margin-top: 10px;
}

.login-form {
  ion-list {
    background: transparent;
    padding-bottom: 1rem;
  }
  
  ion-item {
    --background: transparent;
    --border-color: var(--ion-color-medium);
    margin-bottom: 1rem;
  }
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.forgot-password {
  text-align: center;
  margin-top: 1rem;
}
</style>
