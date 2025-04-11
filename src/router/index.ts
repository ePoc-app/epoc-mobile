import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

// Define routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/library'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue')
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library/:id',
    name: 'LibraryDetail',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library/:libraryId/:epocId',
    name: 'CustomLibraryDetail',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/library/qr',
    name: 'QRScanner',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/epoc/toc/:id',
    name: 'EpocTOC',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/epoc/score/:id',
    name: 'EpocScore',
    component: () => import('@/views/library/LibraryPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/AboutPage.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/about/AboutPage.vue')
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/about/AboutPage.vue')
  }
];

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
