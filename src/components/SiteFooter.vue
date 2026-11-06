<script setup lang="ts">
import { footerLinks } from '@/data/nav'
</script>

<template>
  <footer class="footer">
    <RouterLink class="logo" to="/"><span class="logo-mark" aria-hidden="true" />Nova</RouterLink>
    <nav aria-label="页脚导航">
      <RouterLink v-for="l in footerLinks" :key="l.to" :to="l.to">{{ l.label }}</RouterLink>
    </nav>
    <span>© 2026 Nova</span>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-3);
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}
.logo-mark {
  width: 12px;
  height: 12px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--accent);
}
nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}
nav a:hover {
  color: var(--text);
}
</style>
