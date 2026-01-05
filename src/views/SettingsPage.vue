<script setup lang="ts">
import {
    IonAlert,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonPage,
    IonRange,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTitle,
    IonToggle,
    IonToolbar,
} from '@ionic/vue';
import {
    addCircle,
    bugOutline,
    closeCircle,
    createOutline,
    logOutOutline,
    mailOutline,
    trashOutline,
} from 'ionicons/icons';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { App, type AppInfo } from '@capacitor/app';
import { languages } from '@/utils/languages';

const libraryStore = useLibraryStore();
const settingsStore = useSettingsStore();
const { t } = useI18n();

const settings = computed(() => settingsStore.settings);
const langs = languages;

const devModeCount = ref(0);

// TODO
const info = ref<AppInfo>({
    id: 'fr.inria.epoc',
    name: 'epoc',
    version: '0.0.0',
    build: 'dev',
});

App.getInfo()
    .then((appInfo) => {
        info.value = appInfo;
    })
    .catch(() => {});

// TODO
const user = ref({
    email: '',
    firstname: '',
    lastname: '',
    username: '',
});

function resetDevModeCount() {
    devModeCount.value = 0;
}

function settingsChanged() {
    settingsStore.saveSettings();
}

function throwError() {
    throw new Error(`Test Thrown Error`);
}

function getStyle() {
    return {
        'font-family': settings.value.font,
        'font-size': settings.value.fontSize + 'px',
        'line-height': settings.value.lineHeight,
    };
}

// TODO
function logout() {
    console.log('logout');
}

// TODO
function setUser() {
    console.log('setUser');
}

// TODO
function resetUser() {
    console.log('resetUser');
}

// TODO
function setDevMode(event: Event) {
    event.stopPropagation();
    devModeCount.value++;
    if (devModeCount.value >= 10) {
        console.log('Dev mode');
        resetDevModeCount();
    }
}

function disableDevMode(event: any) {
    if (event.detail.checked) return;
    settingsChanged();
}

// TODO
function deleteCollection(event: any, key: string) {
    console.log('deleteCollection', event, key);
}

// TODO
function deleteData() {
    console.log('deleteData');
}

// TODO
const libraryPromptButtons = [
    {
        text: t('CANCEL'),
        role: 'cancel',
        cssClass: 'secondary',
    },
    {
        text: t('CONFIRM'),
        handler: (data: any) => {
            console.log('Library prompt data:', data);
        },
    },
];

const libraryPromptInputs = [
    {
        placeholder: 'URL',
    },
];
</script>

<template>
    <ion-page>
        <ion-header mode="ios">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" default-href="/" color="inria-icon"></ion-back-button>
                </ion-buttons>
                <ion-title>{{ $t('SETTINGS_PAGE.SETTINGS') }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <div class="wrapper" @click="resetDevModeCount()">
                <ion-list>
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.DISPLAY') }}
                    </ion-list-header>
                    <ion-item>
                        <ion-toggle aria-label="Debug" v-model="settings.debug" @ionChange="settingsChanged()">
                            {{ $t('SETTINGS_PAGE.DEBUG') }}
                        </ion-toggle>
                    </ion-item>
                    <ion-item v-if="settings.debug">
                        <ion-label>{{ $t('SETTINGS_PAGE.DEBUG_ERROR') }}</ion-label>
                        <ion-button slot="end" color="inria-grey" @click="throwError()">
                            <ion-icon slot="icon-only" :icon="bugOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                    <ion-item>
                        <ion-select
                            :label="$t('SETTINGS_PAGE.LANGUAGE')"
                            v-model="settings.lang"
                            @ionChange="settingsChanged()"
                        >
                            <ion-select-option v-for="[code, name] in langs" :key="code" :value="code">{{
                                name
                            }}</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-select
                            :label="$t('SETTINGS_PAGE.THEME')"
                            v-model="settings.theme"
                            @ionChange="settingsChanged()"
                        >
                            <ion-select-option value="auto">{{ $t('SETTINGS_PAGE.THEME_AUTO') }}</ion-select-option>
                            <ion-select-option value="light">{{ $t('SETTINGS_PAGE.THEME_LIGHT') }}</ion-select-option>
                            <ion-select-option value="dark">{{ $t('SETTINGS_PAGE.THEME_DARK') }}</ion-select-option>
                        </ion-select>
                    </ion-item>
                    <template v-if="false">
                        <ion-item>
                            <ion-select
                                :label="$t('SETTINGS_PAGE.FONT')"
                                v-model="settings.font"
                                @ionChange="settingsChanged()"
                            >
                                <ion-select-option value="Inria Sans">Sans serif</ion-select-option>
                                <ion-select-option value="Inria Serif">Serif</ion-select-option>
                                <ion-select-option value="open-dyslexic">Open Dyslexic</ion-select-option>
                            </ion-select>
                        </ion-item>
                        <ion-item>
                            <ion-range
                                :min="12"
                                :max="20"
                                :step="4"
                                v-model="settings.fontSize"
                                @ionChange="settingsChanged()"
                                snaps
                            >
                                <ion-icon slot="start" size="small" src="assets/icon/text-size.svg"></ion-icon>
                                <ion-icon slot="end" src="assets/icon/text-size.svg"></ion-icon>
                                <div slot="label">{{ $t('SETTINGS_PAGE.SIZE') }}</div>
                            </ion-range>
                        </ion-item>
                        <ion-item>
                            <ion-range
                                :min="1"
                                :max="2"
                                :step="0.5"
                                v-model="settings.lineHeight"
                                @ionChange="settingsChanged()"
                                snaps
                            >
                                <ion-icon slot="start" size="small" src="assets/icon/height.svg"></ion-icon>
                                <ion-icon slot="end" src="assets/icon/height.svg"></ion-icon>
                                <div slot="label">{{ $t('SETTINGS_PAGE.INTERLINE') }}</div>
                            </ion-range>
                        </ion-item>
                        <ion-list-header class="preview">
                            {{ $t('SETTINGS_PAGE.PREVIEW') }}
                        </ion-list-header>
                        <ion-item>
                            <ion-text class="preview-settings" :style="getStyle()">
                                <h4>{{ $t('SETTINGS_PAGE.PREVIEW_TITLE') }}</h4>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias consequatur,
                                    cumque iusto modi molestiae nihil quibusdam temporibus voluptatem?
                                </p>
                            </ion-text>
                        </ion-item>
                    </template>
                </ion-list>
                <ion-list>
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.USER') }}
                    </ion-list-header>
                    <template v-if="user && user.firstname">
                        <ion-item v-if="user.email">
                            <ion-label>{{ $t('SETTINGS_PAGE.USER') }} : {{ user.email }}</ion-label>
                            <ion-icon color="inria-icon" slot="end" :icon="logOutOutline" @click="logout()"></ion-icon>
                        </ion-item>
                        <ion-item>
                            <ion-label>{{ $t('SETTINGS_PAGE.NAME') }} : {{ user.lastname }}</ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label>{{ $t('SETTINGS_PAGE.FIRSTNAME') }} : {{ user.firstname }}</ion-label>
                        </ion-item>
                        <ion-item v-if="user.username">
                            <ion-label>{{ $t('SETTINGS_PAGE.USERNAME') }} : {{ user.username }}</ion-label>
                        </ion-item>
                    </template>
                    <template v-if="!user || !user.firstname">
                        <ion-item @click="setUser()" detail>
                            <ion-label role="button">{{ $t('SETTINGS_PAGE.DEFINE_USER') }}</ion-label>
                        </ion-item>
                    </template>
                    <div role="button" class="big-button" @click="resetUser()">
                        <div class="big-button-label">
                            <ion-icon aria-hidden="true" :icon="createOutline"></ion-icon
                            >{{ $t('SETTINGS_PAGE.RESET_USER') }}
                        </div>
                        <div class="big-button-sublabel">{{ $t('SETTINGS_PAGE.RESET_USER_WARNING') }}</div>
                    </div>
                </ion-list>
                <ion-list v-if="info && info.version">
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.APP_INFO') }}
                    </ion-list-header>
                    <ion-item>
                        <ion-label>{{ $t('SETTINGS_PAGE.VERSION') }}</ion-label>
                        <ion-note slot="end" @click="setDevMode($event)">v{{ info.version }}</ion-note>
                    </ion-item>
                    <ion-item>
                        <ion-label>{{ $t('SETTINGS_PAGE.BUILD_VERSION') }}</ion-label>
                        <ion-note slot="end">{{ info.build }}</ion-note>
                    </ion-item>
                    <ion-item>
                        <ion-toggle v-model="settings.isUserOptIn" @ionChange="settingsChanged()">{{
                            $t('SETTINGS_PAGE.DATA_COLLECTION')
                        }}</ion-toggle>
                    </ion-item>
                </ion-list>
                <ion-list v-if="settings.devMode">
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.DEVELOPER') }}
                    </ion-list-header>
                    <ion-item>
                        <ion-toggle v-model="settings.devMode" @ionChange="disableDevMode($event)">{{
                            $t('SETTINGS_PAGE.DEV_MODE')
                        }}</ion-toggle>
                    </ion-item>
                </ion-list>
                <ion-list>
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.OFFICIAL_COLLECTIONS') }}
                    </ion-list-header>
                    <ion-item v-for="(collectionItem, key) in libraryStore.getOfficialCollections" :key="key">
                        <ion-label>
                            <ion-text>{{ collectionItem.title }}</ion-text>
                            <p style="white-space: normal">{{ collectionItem.url }}</p>
                        </ion-label>
                    </ion-item>
                    <ion-item
                        :href="
                            'mailto:ill-epoc-contact@inria.fr?subject=' +
                            encodeURIComponent($t('SETTINGS_PAGE.BECOME_PARTNER'))
                        "
                        :title="$t('SETTINGS_PAGE.BECOME_PARTNER')"
                        target="_blank"
                    >
                        <ion-label role="button">{{ $t('SETTINGS_PAGE.BECOME_PARTNER') }}</ion-label>
                        <ion-icon :icon="mailOutline"></ion-icon>
                    </ion-item>
                </ion-list>
                <ion-list>
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.CUSTOM_COLLECTIONS') }}
                    </ion-list-header>
                    <template
                        v-if="
                            libraryStore.getCustomCollections &&
                            (Array.isArray(libraryStore.getCustomCollections)
                                ? libraryStore.getCustomCollections.length > 0
                                : Object.keys(libraryStore.getCustomCollections).length > 0)
                        "
                    >
                        <ion-item v-for="(collectionItem, key) in libraryStore.getCustomCollections" :key="key">
                            <ion-label>
                                <ion-text>{{ collectionItem.title }}</ion-text>
                                <p style="white-space: normal">{{ collectionItem.url }}</p>
                            </ion-label>
                            <ion-icon
                                :icon="closeCircle"
                                color="inria"
                                slot="end"
                                @click="deleteCollection($event, 'WIP')"
                            ></ion-icon>
                            <!-- TODO: replace 'WIP' with collection ID -->
                        </ion-item>
                    </template>
                    <ion-item id="present-library-prompt">
                        <ion-label role="button">{{ $t('SETTINGS_PAGE.ADD_LIBRARY') }}</ion-label>
                        <ion-icon :icon="addCircle" slot="end"></ion-icon>
                    </ion-item>
                    <ion-alert
                        trigger="present-library-prompt"
                        :header="$t('SETTINGS_PAGE.ADDING_LIBRARY')"
                        :buttons="libraryPromptButtons"
                        :inputs="libraryPromptInputs"
                    ></ion-alert>
                </ion-list>
                <ion-list>
                    <ion-list-header>
                        {{ $t('SETTINGS_PAGE.EPOC_DATA') }}
                    </ion-list-header>
                    <div role="button" class="big-button" @click="deleteData()">
                        <div class="big-button-label">
                            <ion-icon aria-hidden="true" :icon="trashOutline"></ion-icon
                            >{{ $t('SETTINGS_PAGE.DELETE_DATA') }}
                        </div>
                        <div class="big-button-sublabel">{{ $t('SETTINGS_PAGE.DATA_EXAMPLE') }}</div>
                    </div>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped lang="scss">
.wrapper {
    padding: 1rem;
}

ion-list {
    margin-bottom: 1rem;
    background: transparent;
}

ion-list-header {
    min-height: 0;
    margin: 0 0 1rem 0;
    padding: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--ion-color-inria);
    border-bottom: 1px solid var(--ion-color-item);

    &.preview {
        padding: 0;
        margin-top: 1.5rem;
        color: var(--ion-color-text-2);
        border: none;
    }
}

ion-item {
    background: var(--ion-color-item);
    margin-bottom: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
    --min-height: 0;
    --background: none;
    --border-style: none;
    --padding-top: 0.2em;
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-end: 0;

    ion-label {
        margin: 0;
    }

    ion-select {
        padding: 0 5px 0 0;
    }

    ion-range {
        padding: 0;
        overflow: auto;
        --height: 1.75rem;
        --knob-size: 1.5rem;
        --knob-box-shadow: none;
        --bar-background: var(--ion-color-inria-lightgrey);
        --ion-color-primary: var(--ion-color-inria-lightgrey);

        &::part(tick),
        &::part(tick-active) {
            top: 50%;
            transform: translateY(-50%);
            background: var(--ion-color-inria-lightgrey);
        }

        &::part(knob) {
            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        ion-icon {
            margin-inline: 0.5rem;
            color: var(--ion-color-text-2);

            & + ion-icon {
                margin-inline: 0.5rem 0;
            }
        }
    }

    ion-toggle {
        --track-background-checked: #2ec6fa;
        --track-background: var(--ion-color-unique-1);
        --handle-background: white;
        --handle-background-checked: white;
    }
}

.preview-settings {
    *:first-child {
        margin-top: 0;
    }

    *:last-child {
        margin-bottom: 0;
    }
}

.big-button {
    margin-bottom: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
    color: var(--ion-color-inria);
    border: 1px solid var(--ion-color-inria);
    background: none;
    text-align: center;

    &-label {
        display: flex;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        font-weight: bold;

        ion-icon {
            margin-right: 0.5rem;
            padding-bottom: 0.3em;
        }
    }

    &-sublabel {
        font-size: 0.875rem;
    }
}
</style>
