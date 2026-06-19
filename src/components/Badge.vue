<script setup lang="ts">
import { useEpocStore } from '@/stores/epocStore';
import { computed } from 'vue';
import { safe } from '@/utils/pipes';
import shapeSvg from '@/assets/icon/badge/shape.svg?url';
import shapeGreySvg from '@/assets/icon/badge/shape-grey.svg?url';
import shadowSvg from '@/assets/icon/badge/shadow.svg?url';
import shadowGreySvg from '@/assets/icon/badge/shadow-grey.svg?url';
import lockedSvg from '@/assets/icon/badge/locked.svg?url';

const badgeIcons = import.meta.glob('../assets/icon/badge/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

const props = defineProps<{
    title?: string;
    icon: string;
    grey?: boolean;
    locked?: boolean;
    nobg?: boolean;
}>();

const epocStore = useEpocStore();

const shape = computed(() => props.grey ? shapeGreySvg : shapeSvg);
const shadow = computed(() => props.grey ? shadowGreySvg : shadowSvg);

const iconSrc = computed(() => {
    if (props.icon.endsWith('.svg')) {
        return safe(epocStore.rootFolder + props.icon, 'url');
    }
    const name = props.icon || 'check';
    const url = badgeIcons[`../assets/icon/badge/${name}.svg`];
    return safe(url || `/assets/icon/badge/${name}.svg`, 'url');
});
</script>

<template>
    <div class="badge" :class="{ nobg, locked }">
        <div class="badge-background">
            <div v-if="!locked" class="badge-image">
                <img :src="shape" class="image-shape" alt="badge" />
                <img :src="iconSrc" class="image-icon" alt="badge icon" />
                <img :src="shadow" class="image-shadow" alt="badge shadow" />
            </div>
            <div v-else class="badge-image">
                <img :src="lockedSvg" alt="badge locked" />
            </div>
        </div>

        <div v-if="title" class="badge-title">{{ title }}</div>
    </div>
</template>

<style scoped lang="scss">
:host {
    display: block;
}

.badge {
    display: flex;
    flex-direction: column;

    .badge-background {
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        background: var(--ion-color-inria-base-button);
        border-radius: 8px;
    }

    .badge-image {
        position: absolute;
        width: 70%;
        height: 100%;
        top: 0;
        left: 15%;

        img {
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: auto;
            transform: translate(-50%, -50%);
        }

        .image-icon {
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
        }
    }

    .badge-title {
        margin-top: 10px;
        width: 100%;
        line-height: 1.2;
        font-size: 0.875rem;
        font-weight: bold;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    &.locked {
        .badge-title {
            color: var(--ion-color-text-2);
            opacity: 0.7;
        }
    }

    &.nobg {
        .badge-background {
            background: none;
        }
        .badge-image {
            width: 100%;
            left: 0;
        }
    }
}
</style>
