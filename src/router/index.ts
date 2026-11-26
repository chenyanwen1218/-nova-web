import { createRouter, createWebHistory } from 'vue-router'
import { siteName, siteTitle } from '@/data/profile'

const router = createRouter({
  // 跟随 vite 的 base，部署在子路径下时路由也能正确匹配
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
      meta: { title: '服务和报价' },
    },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: '关于' } },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
      meta: { title: '联系' },
    },

    // 以下是作品里的演示页面；meta.demo 会在页面顶部注明这是演示
    {
      path: '/buddies',
      name: 'buddies',
      component: () => import('../views/BuddiesView.vue'),
      meta: { title: 'Nova 助手', demo: 'Nova 助手页' },
    },
    {
      path: '/buddies/:slug',
      name: 'buddy',
      component: () => import('../views/BuddyDetailView.vue'),
      props: true,
      meta: { title: '助手详情', demo: 'Nova 助手页' },
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
      meta: { title: '影像画廊', demo: '影像画廊' },
    },
    {
      path: '/reading',
      name: 'reading',
      component: () => import('../views/ReadingView.vue'),
      // 独立的深色驾驶舱页面，不显示全站页眉页脚
      meta: { title: '阅读驾驶舱', bare: true },
    },
    {
      path: '/fluid-glass',
      name: 'fluid-glass',
      component: () => import('../views/FluidGlassView.vue'),
      // 独立的深色流体玻璃页面，不显示全站页眉页脚
      meta: { title: '流体玻璃', bare: true },
    },

    // 旧地址：原来的方案、常见问题页并入服务页，更新日志已删除
    { path: '/pricing', redirect: '/services' },
    { path: '/faq', redirect: { path: '/services', hash: '#faq' } },
    { path: '/changelog', redirect: '/' },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '页面不存在' },
    },
  ],
  // 切换页面回到顶部；后退时恢复原位置；带 #锚点 时滚到对应位置。
  // 锚点用浏览器自己的 scrollIntoView：它会算上 CSS 里的 scroll-padding-top（吸顶导航的高度），
  // 和 SiteLink 在同一页里滚动的落点一致，不用在这里再写一个偏移量
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    const el = to.hash && document.getElementById(decodeURIComponent(to.hash.slice(1)))
    if (el) {
      el.scrollIntoView()
      return false
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · ${siteName}` : siteTitle
})

export default router
