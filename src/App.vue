<script setup lang="ts">
// 全站布局：页眉、页脚固定，中间按路由切换页面；meta.bare 的页面（如阅读驾驶舱）独占整屏
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteLink from '@/components/SiteLink.vue'
import { profile } from '@/data/profile'

const route = useRoute()
const bare = computed(() => route.meta.bare === true)
const demo = computed(() => route.meta.demo as string | undefined)

// 只在本地预览时提醒：上线接单前这几项必须填，否则客户联系不上你
const missing = import.meta.env.DEV
  ? [!profile.name && '名字', !profile.email && !profile.wechat && '邮箱或微信'].filter(Boolean)
  : []
</script>

<template>
  <SiteHeader v-if="!bare" />
  <main id="main">
    <p v-if="demo" class="demo-note">
      <span>这是作品集里的演示页面「{{ demo }}」。</span>
      <SiteLink to="/#work">回到作品列表</SiteLink>
    </p>
    <RouterView />
  </main>
  <SiteFooter v-if="!bare" />
  <aside v-if="missing.length" class="dev-todo" aria-label="上线前待办">
    上线前还要填：{{ missing.join('、') }}。在 src/data/profile.ts 里改，这条提示只在本地预览时出现。
  </aside>
</template>

<style scoped>
.demo-note {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 12px;
  margin: 0;
  padding: 10px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  font-size: 14px;
  color: var(--text-2);
}
.demo-note a {
  font-weight: 700;
  color: var(--text);
  border-bottom: 2px solid var(--accent);
}
.dev-todo {
  position: fixed;
  bottom: 12px;
  left: 12px;
  z-index: 300;
  max-width: min(420px, calc(100vw - 24px));
  margin: 0;
  padding: 10px 14px;
  border: 2px solid var(--ink);
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 13px;
  line-height: 1.5;
  box-shadow: 3px 3px 0 var(--ink);
}
</style>
