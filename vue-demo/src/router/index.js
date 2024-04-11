import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/nav',
      name: 'nav',
      component: () => import('../views/revoke/NavView-1.vue')
    },
    {
      path: '/navAPI',
      name: 'navAPI',
      component: () => import('../views/revoke/NavAPI-2.vue')
    },
    {
      path: '/navFilter',
      name: 'navFilter',
      component: () => import('../views/revoke/NavAPIFilter-3.vue')
    },
    {
      path: '/navAPIButtons',
      name: 'navAPIButtons',
      component: () => import('../views/revoke/NavAPIButtons-4.vue')
    },
    {
      path: '/preResearch',
      name: 'preResearch',
      component: () => import('../views/PreResearch.vue')
    },
    {
      path: '/serialAPI',
      name: 'serialAPI',
      component: () => import('../views/revoke/SerialAPI.vue')
    },
    {
      path: '/serialAPINew',
      name: 'serialAPINew',
      component: () => import('../views/SerialAPINew.vue')
    },
    {
      path: '/electronIPC',
      name: 'electronIPC',
      component: () => import('../views/ElectronIPC.vue')
    },
  ]
})

export default router
