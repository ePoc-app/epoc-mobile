<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonIcon, IonButton } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import BadgeComponent from './Badge.vue';
import type { Badge } from '@/types/epoc';
import type { Epoc } from '@epoc/epoc-types/dist/v1/epoc';
import type { Reading } from '@/types/reading';
import { ref, Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as jsonLogic from 'json-logic-js/logic';

const props = defineProps<{
    showModal: boolean;
    badge: Badge;
    epoc: Epoc;
    reading: Reading;
}>();

const emit = defineEmits<{
    (e: 'dismiss'): void;
}>();

const { t } = useI18n();

watch(
    () => [props.badge, props.reading],
    ([newBadge, newReading]) => {
        if (typeof newBadge.rule?.and === 'string') return;

        ruleList.value = newBadge.rule.and.map((rule) => {
            const ruleKey = Object.keys(rule)[0];
            const statement = rule[ruleKey][0].var;
            const value = rule[ruleKey][1];
            const split = statement.split('.');
            const type = split[0];
            const id = split[1];

            const verb = t(`BADGE.PASSIVE_VERBS.${split[2]}`, { [split[2]]: value });

            const entity = props.epoc[type !== 'pages' ? type : 'contents']?.[id];
            const entityType = t(`BADGE.ENTITY_TYPES.${type !== 'pages' ? entity?.type : 'page'}`);

            const title = entity?.title ?? entity?.type;

            const statements = newReading?.statements ?? {};

            const success = jsonLogic.apply(rule, statements);

            return {
                label: `${verb} ${entityType} "${title}"`,
                success,
            };
        });
    },
    { immediate: true, deep: true }
);

const ruleList: Ref<{ label: string; success: boolean }[]> = ref([]);
</script>

<template>
    <div v-if="showModal" class="badge-modal-container">
        <ion-card calass="badge-modal-success-card">
            <ion-card-header class="badge-modal-success-card-header">
                <div @click="emit('dismiss')" class="close">
                    <ion-icon :icon="closeOutline" />
                </div>

                <div class="badge-modal-img">
                    <ion-img class="badge-modal-bg" src="assets/icon/badge/bg.svg" />
                    <BadgeComponent nobg :icon="badge.icon" />
                </div>
            </ion-card-header>

            <ion-card-content class="badge-modal-success-card-content">
                <ion-card-title class="title">{{ badge.title }}</ion-card-title>
                <p class="text1">{{ badge.description }}</p>
                <div class="badge-rule-list">
                    <div v-for="rule of ruleList" :key="rule" class="badge-rule-item">
                        <span class="badge-rule-item-check">
                            <ion-icon v-if="rule.success" src="/assets/icon/check-round.svg" />
                            <ion-icon v-else src="/assets/icon/clock-round.svg" />
                        </span>
                        <span class="badge-rule-item-label">{{ $t(rule.label) }}</span>
                    </div>
                </div>

                <ion-button
                    size="large"
                    expand="block"
                    fill="outline"
                    color="outline-button"
                    @click="emit('dismiss')"
                    >{{ $t('CLOSE') }}</ion-button
                >
            </ion-card-content>
        </ion-card>
    </div>
</template>

<style scoped lang="scss">
:host {
    z-index: 60;
}

.badge-modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 60;

    .badge-modal-success-card {
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
            align-items: center;
        }

        &-content {
            padding-bottom: 30px;
        }

        .title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: var(--ion-color-text);
        }

        .text1 {
            color: var(--ion-color-text);
            margin-bottom: 1rem;
            font-size: 1rem;
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

        .badge-modal-img {
            display: inline-block;
            position: relative;
            width: 150px;

            .badge-modal-bg {
                display: block;
            }

            badge {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 60%;
                height: auto;
                transform: translate(-50%, -50%);
            }
        }
    }
}

.badge-rule {
    &-list {
        text-align: left;
        font-size: 0.875rem;
        color: var(--ion-color-text);
    }

    &-item {
        display: flex;
        margin-bottom: 5px;
        &-check {
            font-size: 20px;
            margin-right: 10px;
        }

        &-label {
        }

        &:last-child {
            margin-bottom: 1rem;
        }
    }
}
</style>
