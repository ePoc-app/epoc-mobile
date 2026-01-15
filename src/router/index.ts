import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
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
        path: '/epoc/toc/:id',
        name: 'TocPage',
        component: TocPage,
    },
    {
        path: '/epoc/play/:epoc_id/:chapter_id',
        name: 'Player',
        component: PlayerPage,
    },
    {
        path: '/epoc/play/:epoc_id/:chapter_id/content/:content_id',
        name: 'PlayerContent',
        component: PlayerPage,
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
    },
    {
        path: '/epoc/score/:epoc_id',
        name: 'ScorePage',
        component: ScorePage,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
