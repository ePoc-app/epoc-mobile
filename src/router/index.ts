import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LibraryPage from '@/views/library/LibraryPage.vue'
import CollectionDetailPage from '@/views/library/CollectionDetailPage.vue'
import EpocOverviewPage from '@/views/library/OverviewPage.vue';
import WIPPage from '@/views/WIPPage.vue'

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
    path: '/wip/:any',
    name: 'WIP',
    component: WIPPage
  },
  {
    path: '/:libraryId/:id',
    name: 'EpocOverviewPage',
    component: EpocOverviewPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
