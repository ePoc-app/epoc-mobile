<script setup lang="ts">
import { DragAndDropquestion } from '@/types/contents/assessment';
import { removeSecableSpace } from '@/utils/transform';
import { Response } from '@epoc/epoc-types/src/v1/question';
import { createGesture } from '@ionic/vue';
import { ref, onMounted, useTemplateRef } from 'vue';
import { IonIcon, IonRange } from '@ionic/vue';
import { useTemplateRefsList } from '@vueuse/core';
import { chevronForwardOutline, close } from 'ionicons/icons';

const props = defineProps<{
    question: DragAndDropquestion;
    disabled: boolean;
    userPreviousResponse: string[];
}>();

const emit = defineEmits<{
    (e: 'dragging', value: 'dragstart' | 'dragend'): void;
    (e: 'userHasResponded', userResponses: any[]): void;
}>();

interface Zone {
    label: string;
    isOpen: boolean;
}

const responses = ref<Response[]>([]);
const answer = ref();
const dropZones = ref<Zone[]>([]);
const isDragging = ref(false);

const dropItem = useTemplateRef('drop-item');
const dropZonesElems = useTemplateRefsList();

function initialize() {
    dropZones.value = props.question.correctResponse.map((zone) => {
        return { label: zone.label, isOpen: false };
    });

    if (props.userPreviousResponse?.length) {
        answer.value = props.userPreviousResponse;
    } else {
        answer.value = props.question.correctResponse.map(() => {
            return [];
        });
        console.log('answer initialized', answer.value);
    }

    if (!props.disabled) {
        responses.value = shuffleResponses(props.question.responses);
    }
}

initialize();

function shuffleResponses(arr: Response[]) {
    return arr
        .map((a) => [Math.random(), a] as [number, Response])
        .sort((a, b) => a[0] - b[0])
        .map((a) => a[1]);
}

let interval: NodeJS.Timeout;
onMounted(() => {
    if (!dropItem.value) return;

    const drag = createGesture({
        el: dropItem.value,
        threshold: 0,
        gestureName: 'drag',
        onStart: () => {
            console.log('starting');
            isDragging.value = true;
            emit('dragging', 'dragstart');
        },
        onMove: (event) => {
            const scrollArea = dropItem.value!.closest('.app-card') as HTMLElement;
            if (!scrollArea) return;

            const currentY = getRelativeYPosition(dropItem.value!, scrollArea);

            clearInterval(interval);

            let scrollTo = scrollArea.scrollTop;
            if (currentY < 0) {
                scrollTo -= 10;
                scrollArea.scrollTo({ top: scrollTo });

                interval = setInterval(() => {
                    scrollTo -= 10;
                    scrollArea.scrollTo({ top: scrollTo });
                    dropItem.value!.style.transform = `translate(${event.deltaX}px, ${
                        event.deltaY + scrollArea.scrollTop
                    }px)`;
                }, 50);
            } else if (currentY > scrollArea.offsetHeight - dropItem.value!.offsetHeight) {
                scrollTo += 10;
                scrollArea.scrollTo({ top: scrollTo });
                interval = setInterval(() => {
                    scrollTo += 10;
                    scrollArea.scrollTo({ top: scrollTo });
                    dropItem.value!.style.transform = `translate(${event.deltaX}px, ${
                        event.deltaY + scrollArea.scrollTop
                    }px)`;
                }, 50);
            }

            dropItem.value!.style.transform = `translate(${event.deltaX}px, ${event.deltaY + scrollArea.scrollTop}px)`;
            dropItem.value!.style.zIndex = '10';

            const zoneIndex = hoveringZone(event.currentX, event.currentY);
            if (zoneIndex !== -1) {
                (dropZonesElems.value[zoneIndex] as HTMLElement).style.borderColor = 'var(--ion-color-inria-spe)';
            }
        },
        onEnd: (event) => {
            dropItem.value!.style.transform = 'translate(0,0)';
            isDragging.value = false;

            clearInterval(interval);
            emit('dragging', 'dragend');

            const zoneIndex = hoveringZone(event.currentX, event.currentY);
            if (zoneIndex !== -1) {
                (dropZonesElems.value[zoneIndex] as HTMLElement).style.borderColor = '';
                addResponse(zoneIndex);
            }
        },
    });

    drag.enable();
});

function hoveringZone(x: number, y: number): number {
    let hoveringZoneIndex = -1;

    dropZonesElems.value.forEach((zone, index) => {
        const rect = zone.getBoundingClientRect();
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            (zone as HTMLElement).style.borderColor = '';

            return;
        }

        hoveringZoneIndex = index;
    });

    return hoveringZoneIndex;
}

function addResponse(index: number) {
    console.log('adding response');
    if (responses.value.length > 0) {
        answer.value[index].push(responses.value.shift());

        if (responses.value.length === 0) {
            emit('userHasResponded', answer.value);
        }
    }
}

function removeResponse(event: Event, zoneIndex: number, responseIndex: number) {
    event.stopPropagation();

    const response = answer.value[zoneIndex].splice(responseIndex, 1);
    responses.value.unshift(...response);
}

function openZone(event: Event, zone: Zone) {
    event.stopPropagation();

    zone.isOpen = !zone.isOpen;
}

function getRelativeYPosition(node1: HTMLElement, node2: HTMLElement) {
    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();

    return rect1.top - rect2.top;
}
</script>

<template>
    <div class="drop-zones">
        <div v-if="!disabled" class="drop-zones-instruction">
            <template v-if="question.statement">
                <span :innerHTML="removeSecableSpace(question.statement)" class="custom" />
            </template>

            <template v-else>
                <IonIcon src="/assets/icon/glisser2.svg" />
                <div :innerHTML="$t('QUESTION.DRAG_DROP_INSTRUCTION')" />
            </template>

            <IonRange
                class="progress-indicator"
                disabled
                mode="md"
                :step="1"
                :min="0"
                :max="question.responses.length"
                :value="question.responses.length - responses.length"
                :snaps="true"
            />

            <div v-if="responses.length" class="responses" :class="{ dragging: isDragging }">
                <div ref="drop-item" class="response-item">
                    <span>{{ responses[0].label }}</span>
                    <IonIcon src="/assets/icon/slider.svg" />
                    <div style="position: absolute; inset: 0; touch-action: none" />
                </div>
            </div>

            <div
                v-for="(zone, zoneIndex) of dropZones"
                :key="zoneIndex"
                :ref="dropZonesElems.set"
                class="drop-zone"
                :class="{ open: zone.isOpen && answer[zoneIndex].length > 0 }"
                @click="addResponse(zoneIndex)"
            >
                <div class="zone-header">
                    <div class="zone-label">{{ zone.label }}</div>
                    <div class="zone-count" :class="{ active: answer[zoneIndex]?.length > 0 }">
                        {{ answer[zoneIndex]?.length }}
                    </div>
                    <IonIcon :icon="chevronForwardOutline" @click="openZone($event, zone)" />
                </div>

                <div class="zone">
                    <div
                        v-for="(response, responseIndex) of answer[zoneIndex]"
                        :key="responseIndex"
                        class="response-item sorted"
                    >
                        {{ response.label }}
                        <IonIcon :icon="close" @click="removeResponse($event, zoneIndex, responseIndex as number)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped style="scss">
.responses {
    position: relative;
    margin-bottom: 1em;
    border: 2px dashed var(--ion-color-content);

    &.dragging {
        border: 2px dashed var(--ion-color-unique-2);
        border-radius: 10px;
    }
}

.response-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--ion-color-contrast-3);
    border-radius: 0.5rem;
    box-shadow: 0 1px 7px 0 var(--ion-color-drag-drop-shadow);
    color: var(--ion-color-inria-spe);

    ion-icon {
        color: var(--ion-color-text-2);
    }

    span {
        padding-left: 0.5rem;
    }

    &.sorted {
        margin-top: 0.5rem;
        background: var(--ion-color-contrast);
        box-shadow: none;

        ion-icon {
            flex-shrink: 0;
            margin-left: 0.5rem;
        }
    }

    &.selected {
        box-shadow: 0 0 3px rgba(56, 128, 255, 0.12), 0 0 3px rgba(56, 128, 255, 0.24);
    }
}

.drop-zones {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;

    ion-range {
        margin: 0 1rem;
    }

    &-instruction {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0 1rem;
        color: var(--ion-color-text-2);

        ion-icon {
            flex-shrink: 0;
            margin-right: 1rem;
        }

        div {
            font-size: 0.875rem;

            :deep(.label) {
                display: inline-block;
                padding: 0.1rem 0.2rem;
                margin: 0 0.2rem;
                background: var(--ion-color-contrast-3);
                border-radius: 0.2rem;
                box-shadow: 0 1px 3px 0 var(--ion-color-drag-drop-shadow);
                color: var(--ion-color-inria-spe);
            }

            :deep(.cat) {
                display: inline-block;
                padding: 0.1rem 0.2rem;
                margin: 0 0.2rem;
                border: 1px dashed var(--ion-color-unique-1);
                border-radius: 0.2rem;
            }
        }

        .custom {
            display: block;
            text-align: center;
        }
    }

    .statement {
        color: var(--ion-color-inria-grey);
        font-size: 0.875rem;
    }

    .drop-zone {
        padding: 1rem;
        margin-bottom: 1em;
        border: 2px dashed var(--ion-color-unique-1);
        border-radius: 10px;

        &:last-child {
            margin-bottom: 0;
        }

        .zone-header {
            display: flex;
            align-items: center;
        }

        .zone-label {
            flex-grow: 1;
            padding-top: 0.25em;
            font-size: 0.875rem;
            font-weight: bold;
            text-transform: uppercase;
            color: var(--ion-color-text);
        }

        .zone-count {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 0.25em;
            height: 2rem;
            width: 2rem;
            margin: 0 0.5rem;
            color: var(--ion-color-inria-lightgrey-shade);
            background: var(--ion-color-contrast);
            border-radius: 2rem;

            &.active {
                background: var(--ion-color-inria-spe);
                color: white;
            }
        }

        .zone {
            max-height: 0;
            overflow: hidden;
        }

        &.open {
            .zone {
                max-height: none;
            }
            .zone-header ion-icon {
                transform: rotate(90deg);
            }
        }
    }
}
</style>
