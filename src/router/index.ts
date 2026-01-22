import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import LibraryPage from '@/views/library/LibraryPage.vue';
import AboutPage from '@/views/AboutPage.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import CollectionDetailPage from '@/views/library/CollectionDetailPage.vue';
import EpocOverviewPage from '@/views/epoc/OverviewPage.vue';
import TocPage from '@/views/epoc/TocPage.vue';
import PlayerPage from '@/views/epoc/PlayerPage.vue';
import AssessmentPage from '@/views/epoc/AssessmentPage.vue';
import ScorePage from '@/views/epoc/ScorePage.vue';
import OrphanPlayerPage from '@/views/epoc/OrphanPlayerPage.vue';
import OverviewEditorPage from '@/views/epoc/OverviewEditorPage.vue';
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
        component: OrphanPlayerPage,
        beforeEnter: fetchEpoc,
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
    {
        path: '/epoc/preview-editor/:epoc_id',
        name: 'OverviewEditorPage',
        component: OverviewEditorPage,
        beforeEnter: fetchEpoc,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        // Redirect in the guard below
        component: { render: () => null }
    }
];

// Define logic to filter routes
const getRoutes = () => {
    if (import.meta.env.VITE_APP_MODE === 'preview') {
        // Only keep the root redirect and routes starting with /epoc
        return routes.filter(route =>
            route.path === '/' || route.path.startsWith('/epoc') || route.name === 'NotFound'
        );
    }
    return routes;
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: getRoutes(),
});

router.beforeEach((to, from, next) => {
    const isPreview = import.meta.env.VITE_APP_MODE === 'preview';
    if (to.name === 'NotFound') {
        console.warn(`unknown route: ${to.fullPath}`);

        if (isPreview) {
            // Redirect to OverviewEditorPage.
            // Note: Since OverviewEditorPage requires an :id,
            // you might need to provide a default or fallback ID here.
            next({ name: 'OverviewEditorPage', params: { epoc_id: 'default' } });
        } else {
            next({ name: 'Library' });
        }
    } else {
        next();
    }
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
