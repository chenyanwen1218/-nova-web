import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 跟随 vite 的 base，部署在子路径下时路由也能正确匹配
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
