<script setup lang="ts">
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonBackButton,
    IonButton,
} from '@ionic/vue';
import { ref, reactive, onBeforeMount, computed } from 'vue';
import { useEpocStore } from '@/stores/epocStore';
import ScoreProgress from '@/components/ScoreProgress.vue';
import { useRoute } from 'vue-router';
import { chevronForwardOutline, downloadOutline, starOutline } from 'ionicons/icons';
import Badge from '@/components/Badge.vue';

const epocStore = useEpocStore();
const route = useRoute();

onBeforeMount(async () => {
    const id = route.params.epoc_id.toString();
    await epocStore.getEpocById(id);
});

const badgeMode = computed(() => (epocStore.epoc.badges ? Object.keys(epocStore.epoc.badges).length > 0 : false));
const certificateUnlocked = computed(() => assessmentData.totalUserScore >= epocStore.epoc.certificateScore);
// TODO
const unlockedBadges = ref([]);

// TODO
const assessmentData = reactive({
    successStore: 0,
    attemptedScore: 0,
    todoScore: 0,
    totalUserScore: 5,
    totalScore: 20,
});

// TODO
async function getCertificate() {}

// TODO
function showBadgeDetail(badge: any) {}
</script>

<template>
    <ion-page>
        <ion-header translucent>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/library" color="inria-icon" />
                </ion-buttons>
                <ion-title>{{ $t('PLAYER.SCORE.HEADER') }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div class="wrapper" v-if="epocStore.epoc && !badgeMode && assessmentData">
                <div class="title-container">
                    <div class="title-icon">
                        <ion-icon :icon="starOutline" />
                    </div>
                    <h5 class="title">{{ $t('PLAYER.SCORE.TOTAL_SCORE') }}</h5>
                </div>

                <div class="score">
                    <div class="score-points">{{ assessmentData.totalUserScore }} {{ $t('PLAYER.SCORE.PTS') }}</div>
                    <div class="score-chart">
                        <ScoreProgress
                            :progress="(assessmentData.totalUserScore / assessmentData.totalScore) * 100"
                            :delta="(assessmentData.userScore / assessmentData.totalScore) * 100"
                            :threshold="(epocStore.epoc.certificateScore / assessmentData.totalScore) * 100"
                            :min-label="0"
                            :max-label="assessmentData.totalScore"
                        />
                    </div>
                </div>

                <template v-if="!epocStore.epoc.certificateDisabled">
                    <div class="certificate">
                        <h5>{{ $t('PLAYER.SCORE.CONTINUE') }}</h5>
                        <p>
                            {{
                                $t('PLAYER.SCORE.REMAINING', {
                                    remaining: epocStore.epoc.certificateScore - assessmentData.totalUserScore,
                                })
                            }}
                        </p>
                        <ion-button size="default" expand="block" color="medium" fill="outline" @click="getCertificate">
                            <ion-icon :icon="downloadOutline" slot="start" />
                            <span>{{ $t('PLAYER.SCORE.GET_CERTIFICATE') }}</span>
                        </ion-button>
                    </div>
                </template>

                <div class="short-access">
                    <h4 class="short-access-label">{{ $t('PLAYER.SCORE.PTS_RECAP') }}</h4>
                    <div
                        class="short-access-item"
                        :router-link="`/epoc/play/${epocStore.epoc.id}/${assessment.chapterId}/content/${assessment.id}`"
                        v-for="(assessment, index) of epocStore.epoc.assessments"
                        :key="index"
                    >
                        <ion-label>
                            {{ assessment.title }}
                            <span>{{ epocStore.epoc.chapters[assessment.chapterId!].title }}</span>
                        </ion-label>
                        <ion-note
                            :color="
                                assessment?.score !== null && assessment?.score !== undefined
                                    ? (assessment.score ?? 0) < (assessment?.scoreTotal ?? 0)
                                        ? 'inria-certificate'
                                        : 'inria-correct'
                                    : 'inria-icon'
                            "
                            v-if="assessment?.scoreTotal && assessment.scoreTotal > 0"
                        >
                            {{ assessment.score ? assessment.score : 0 }}/{{ assessment.scoreTotal }}
                        </ion-note>
                        <ion-icon :icon="chevronForwardOutline" />
                    </div>
                </div>
            </div>
            <div v-if="epocStore.epoc && badgeMode" class="wrapper">
                <div v-if="!certificateUnlocked" class="certificate flex">
                    <div class="certificate-text">
                        <h6>{{ $t('PLAYER.SCORE.CONTINUE') }}</h6>
                        <p>
                            {{
                                $t('PLAYER.SCORE.BADGE_REMAINING', {
                                    remaining: epocStore.epoc.certificateBadgeCount - unlockedBadges.length,
                                })
                            }}
                        </p>
                    </div>
                    <div class="certificate-badge">
                        <Badge icon="cert-grey" grey nobg />
                    </div>
                </div>

                <div v-else class="certificate flex success">
                    <div class="certificate-text">
                        <h6>{{ $t('PLAYER.SCORE.CONGRATS') }}</h6>
                        <p>{{ $t('PLAYER.SCORE.CERTIFICATE_WIN') }}</p>
                    </div>
                    <div class="certificate-badge">
                        <Badge icon="cert" nobg />
                    </div>
                    <ion-button expand="block" @click="getCertificate">
                        <ion-icon :icon="downloadOutline" slot="start" />
                        <span>{{ $t('PLAYER.SCORE.GET_CERTIFICATE') }}</span>
                    </ion-button>
                </div>
                <!-- <div class="badge-list">
                    <div
                        v-for="(badge, index) of epocStore.epoc.badges"
                        :key="index"
                        class="badge-item"
                        :class="{ unlocked: unlockedBadges.includes(badge.id) }"
                        @click="showBadgeDetail(badge)"
                    >
                        <Badge :title="badge.title" :icon="badge.icon" :locked="!unlockedBadges.includes(badge.id)" />
                    </div>
                </div> -->
            </div>
        </ion-content>
        <!-- <BadgeModal v-if="badgeModal" :show-modal="showBadgeModal" :badge="badgeModal" :epoc="epoc" /> -->
    </ion-page>
</template>

<style scoped lang="scss">
.wrapper {
    max-width: 600px;
    margin: auto;
    padding: 1rem;
}

.title-container {
    margin-bottom: 1rem;
    text-align: center;

    .title-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3rem;
        height: 3rem;
        margin: 0 auto 1rem auto;
        font-size: 1.5rem;
        border-radius: 1rem;
    }

    .title {
        font-size: 1.5rem;
        font-weight: bold;
    }

    &:after {
        content: '';
        display: block;
        width: 80px;
        height: 4px;
        margin: 10px auto;
        border-radius: 2px;
        background: var(--ion-color-inria);
    }
}

.score {
    text-align: center;

    &-points {
        font-size: 2rem;
        font-weight: bold;
    }
}

.certificate {
    position: relative;
    margin: 1rem 0;
    padding: 1rem;
    background: var(--ion-color-contrast);
    border-radius: 0.5rem;

    &.flex {
        display: flex;
        flex-wrap: wrap;
    }

    &-text {
        width: calc(100% - 1rem - 75px);
        margin-right: 1rem;
    }

    &-badge {
        width: 75px;
        flex-shrink: 0;
    }

    ion-button {
        margin-top: 1rem;
    }

    &.success {
        color: white;
        background: var(--ion-color-inria-certificate);

        ion-button {
            width: 100%;
            flex-shrink: 0;
            --background: white;
            --background-activated: var(--ion-color-light);
            --background-focused: var(--ion-color-light);
            ion-icon,
            span {
                color: var(--ion-color-inria-certificate);
            }
        }
    }

    .badge {
        position: absolute;
        top: 1rem;
        right: 0.5rem;
        font-size: 4rem;
    }

    h5 {
        font-size: 2rem;
        font-weight: bold;
    }

    h6 {
        font-size: 1.4rem;
        font-weight: bold;
        margin: 0 0 5px 0;
    }

    p {
        margin: 0;
    }
}

.badge-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;
}

.badge-item {
    width: calc(33.333% - 10px);
    margin: 0 5px 20px 5px;
}

.short-access {
    &-label {
        margin-top: 0;
        padding: 0.5em 0 0.25em 0;
        font-size: 1rem;
        font-weight: bold;
        text-transform: uppercase;
        color: var(--ion-color-inria);
        border-bottom: 1px solid var(--ion-color-item);
    }

    &-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        background: var(--ion-color-item);
        span {
            display: block;
            max-width: 100%;
            font-weight: normal;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        &:last-child {
            margin-bottom: 0;
        }

        ion-label {
            padding-top: 0.3rem;
            flex-grow: 1;
            max-width: calc(100% - 2.5rem);
        }

        ion-note {
            padding-top: 0.3rem;
            margin: 0 0.5rem;
        }
    }
}
</style>
