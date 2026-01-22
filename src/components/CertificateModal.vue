<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon, IonImg, IonButton } from '@ionic/vue';
import { useVModel } from '@vueuse/core';
import { closeOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const props = defineProps({
    epocId: String,
    open: Boolean,
});

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const isOpen = useVModel(props, 'open', emit);

const router = useRouter();

function goToCertificate() {
    dismissCertificate();
    router.push(`/epoc/score/${props.epocId}`);
}

function dismissCertificate() {
    isOpen.value = false;
}
</script>

<template>
    <div v-if="isOpen" class="certificate-container">
        <IonCard class="certificate-success-card">
            <IonCardHeader class="certificate-success-card-header">
                <div class="close" @click="dismissCertificate">
                    <IonIcon :icon="closeOutline" />
                </div>

                <div>
                    <IonImg class="certificate-img light" src="assets/img/certificate.svg" />
                    <IonImg class="certificate-img dark" src="assets/img/certificate-dark.svg" />
                </div>
            </IonCardHeader>

            <IonCardContent class="certificate-success-card-content">
                <IonCardTitle class="title"> {{ $t('CERTIFICATE_MODAL.HEADER') }}</IonCardTitle>
                <h3 class="text1">{{ $t('CERTIFICATE_MODAL.SCORE_REACHED') }}</h3>
                <p class="text2">{{ $t('CERTIFICATE_MODAL.MSG') }}</p>

                <IonButton size="large" expand="block" color="inria-certificate" @click="goToCertificate">
                    {{ $t('CERTIFICATE_MODAL.GET') }}
                </IonButton>
                <IonButton
                    size="large"
                    expand="block"
                    fill="outline"
                    color="outline-button"
                    @click="dismissCertificate"
                >
                    {{ $t('CERTIFICATE_MODAL.CONTINUE') }}
                </IonButton>
            </IonCardContent>
        </IonCard>
    </div>
</template>

<style scoped lang="scss">
:host {
    z-index: 60;
}

.certificate-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 60;

    .certificate-success-card {
        position: absolute;
        top: 45%;
        left: 50%;
        width: 90%;
        margin: 0;
        max-width: 500px;
        text-align: center;
        transform: translate(-50%, -50%);
        border-radius: 16px;

        &-header {
            padding: 30px 20px 10px 20px;
        }

        &-content {
            padding-bottom: 30px;
        }

        .title {
            font-family: 'Inria Sans';
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--ion-color-text);
        }

        .text1 {
            color: var(--ion-color-text);
            margin-bottom: 10px;
            font-family: 'Inria Sans';
            font-size: 1rem;
            font-weight: bold;
            padding: 0 5vh 0 5vh;
        }

        .text2 {
            color: var(--ion-color-text-2);
            font-size: 0.8rem;
            padding: 0 3vh 0 3vh;
            margin-bottom: 15px;
        }

        .close {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 1.8rem;
            height: 1.8rem;
            z-index: 10;
            background: var(--ion-color-contrast);
            border-radius: 2rem;
            --ionicon-stroke-width: 64px;
            color: var(--ion-color-text-button);
            font-size: 18px;
        }

        .certificate-img {
            padding: 0 4vh 0 4vh;
        }
    }
}
</style>
