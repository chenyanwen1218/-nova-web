<script setup lang="ts">
// 全站页眉：吸顶导航，当前页高亮（RouterLink 自动加 router-link-active）
import { navLinks } from '@/data/nav'
</script>

<template>
  <a class="skip" href="#main">跳到正文</a>
  <header class="nav">
    <div class="nav-inner">
      <RouterLink class="logo" to="/" aria-label="Nova 首页">
        <span class="logo-mark" aria-hidden="true" />Nova
      </RouterLink>
      <nav aria-label="主导航">
        <RouterLink v-for="l in navLinks" :key="l.to" :to="l.to">{{ l.label }}</RouterLink>
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

@media (max-width: 640px) {
  nav a {
    padding: 10px;
  }
}
</style>
