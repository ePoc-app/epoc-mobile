import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import LibraryPage from '@/views/library/LibraryPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import CollectionDetailPage from '@/views/library/CollectionDetailPage.vue';
import EpocOverviewPage from '@/views/epoc/OverviewPage.vue';
import WIPPage from '@/views/WIPPage.vue';
import TocPage from '@/views/epoc/TocPage.vue';
import PlayerPage from '@/views/epoc/PlayerPage.vue';
import AssessmentPage from '@/views/epoc/AssessmentPage.vue';
import ScorePage from '@/views/epoc/ScorePage.vue';
import { trackPageView } from '@/utils/matomo';
import { useEpocStore } from '@/stores/epocStore';

function fetchEpoc(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const epocId = to.params.epoc_id;

    if (!epocId) {
        next();
        return;
    }

    const epocStore = useEpocStore();
    if (!epocStore.epoc || epocStore.epoc.id !== epocId.toString()) {
        epocStore.getEpocById(epocId.toString());
    }

    next();
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/library',
    },
    {
        path: '/library',
        name: 'Library',
        component: LibraryPage,
    },
    {
        path: '/settings',
        name: 'SettingsPage',
        component: SettingsPage,
    },
    {
        path: '/about',
        name: 'AboutPage',
        component: AboutPage,
    },
    {
        path: '/:collection_id',
        name: 'CollectionDetail',
        component: CollectionDetailPage,
    },
    {
        path: '/wip/:any',
        name: 'WIP',
        component: WIPPage,
    },
    {
        path: '/:libraryId/:id',
        name: 'EpocOverviewPage',
        component: EpocOverviewPage,
    },
    {
        path: '/epoc/toc/:epoc_id',
        name: 'TocPage',
        component: TocPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/epoc/play/:epoc_id/:chapter_id',
        name: 'Player',
        component: PlayerPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/epoc/play/:epoc_id/:chapter_id/content/:content_id',
        name: 'PlayerContent',
        component: PlayerPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/epoc/play/:epoc_id/:chapter_id/content/:content_id/:next',
        name: 'EpocPlayerPage',
        component: PlayerPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/epoc/play/:epoc_id/content/:content_id',
        name: 'OrphanPlayer',
        component: WIPPage,
    },
    {
        path: '/epoc/:epoc_id/assessment/:assessment_id',
        name: 'AssessmentPage',
        component: AssessmentPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/epoc/score/:epoc_id',
        name: 'ScorePage',
        component: ScorePage,
        beforeEnter: fetchEpoc,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.afterEach((to: RouteLocationNormalized) => {
    if (to.name === 'PlayerContent') return; // Skip for PlayerContent handle in PlayerPage updateCurrentContent
    // We send a manually cleaned URL to Matomo
    // This ensures iOS and Android appear identical
    const cleanedPath = to.fullPath;
    const pageTitle = to.name?.toString() || 'Default Title';

    trackPageView(cleanedPath, pageTitle);
});

export default router;
