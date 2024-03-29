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
      component: () => import('../views/NavView-1.vue')
    },
    {
      path: '/navAPI',
      name: 'navAPI',
      component: () => import('../views/NavAPI-2.vue')
    },
    {
      path: '/navFilter',
      name: 'navFilter',
      component: () => import('../views/NavAPIFilter-3.vue')
    },
    {
      path: '/navAPIButtons',
      name: 'navAPIButtons',
      component: () => import('../views/NavAPIButtons-4.vue')
    },
  ]
})

export default router
