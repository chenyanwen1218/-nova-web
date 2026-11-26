<script setup lang="ts">
// 全站页眉：吸顶导航，当前页高亮（RouterLink 自动加 router-link-active；锚点链接不高亮，见 SiteLink）
import SiteLink from '@/components/SiteLink.vue'
import { navLinks } from '@/data/nav'
import { siteName } from '@/data/profile'
</script>

<template>
  <a class="skip" href="#main">跳到正文</a>
  <header class="nav">
    <div class="nav-inner">
      <RouterLink class="logo" to="/" :aria-label="`${siteName} 首页`">
        <span class="logo-mark" aria-hidden="true" />{{ siteName }}
      </RouterLink>
      <nav aria-label="主导航">
        <SiteLink v-for="l in navLinks" :key="l.to" :to="l.to">{{ l.label }}</SiteLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.skip {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 200;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: var(--on-ink);
  transform: translateY(-160%);
  transition: transform 0.2s var(--ease);
}
.skip:focus-visible {
  transform: none;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--nav-h);
  border-bottom: 1px solid var(--border);
  background: rgba(246, 241, 231, 0.82);
  backdrop-filter: blur(10px);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.logo-mark {
  width: 14px;
  height: 14px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--accent);
}
nav {
  display: flex;
  gap: 4px;
}
nav a {
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-2);
  white-space: nowrap;
  transition:
    color 0.2s,
    background 0.2s;
}
nav a:hover {
  color: var(--text);
  background: var(--surface);
}
/* 当前页：墨色底，和品牌按钮一套语言 */
nav a.router-link-active {
  color: var(--on-ink);
  background: var(--ink);
}

/* 手机上栏目多了放不下时可以横向滑动，右侧渐隐提示还有内容（原来六个栏目时「方案」「关于」被裁掉点不到） */
@media (max-width: 640px) {
  .nav-inner {
    gap: 12px;
    padding: 0 0 0 20px;
  }
  .logo {
    flex: none;
  }
  nav {
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    padding-right: 28px;
    mask-image: linear-gradient(to right, #000 calc(100% - 36px), transparent);
  }
  nav::-webkit-scrollbar {
    display: none;
  }
  nav a {
    flex: none;
    padding: 10px;
  }
}
</style>
