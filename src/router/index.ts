import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  // 跟随 vite 的 base，部署在子路径下时路由也能正确匹配
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: '首页' } },
    {
      path: '/buddies',
      name: 'buddies',
      component: () => import('../views/BuddiesView.vue'),
      meta: { title: '助手' },
    },
    {
      path: '/buddies/:slug',
      name: 'buddy',
      component: () => import('../views/BuddyDetailView.vue'),
      props: true,
      meta: { title: '助手详情' },
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
      meta: { title: '影像' },
    },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: '关于' } },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingView.vue'),
      meta: { title: '方案' },
    },
    { path: '/faq', name: 'faq', component: () => import('../views/FaqView.vue'), meta: { title: '常见问题' } },
    {
      path: '/changelog',
      name: 'changelog',
      component: () => import('../views/ChangelogView.vue'),
      meta: { title: '更新日志' },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { title: '联系我们' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '页面不存在' },
    },
  ],
  // 切换页面回到顶部；带 #锚点 时滚到对应位置；后退时恢复原位置
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · Nova` : 'Nova'
})

export default router
