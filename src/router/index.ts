import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LibraryPage from '@/views/library/LibraryPage.vue'
import CollectionDetailPage from '@/views/library/CollectionDetailPage.vue'
import EpocOverviewPage from '@/views/epoc/OverviewPage.vue';
import WIPPage from '@/views/WIPPage.vue'
import TestPage from '@/views/TestPage.vue';
import TocPage from '@/views/epoc/TocPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/library'
  },
  {
    path: '/library',
    name: 'Library',
    component: LibraryPage
  },
  {
    path: '/:collection_id',
    name: 'CollectionDetail',
    component: CollectionDetailPage
  },
  {
    path: '/test/:id',
    name: 'TEST',
    component: TestPage
  },
  {
    path: '/wip/:any',
    name: 'WIP',
    component: WIPPage
  },
  {
    path: '/:libraryId/:id',
    name: 'EpocOverviewPage',
    component: EpocOverviewPage
  },
  {
    path: '/epoc/toc/:id',
    name: 'TocPage',
    component: TocPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
