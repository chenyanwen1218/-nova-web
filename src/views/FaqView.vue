<script setup lang="ts">
// 常见问题：原生 <details> 折叠，键盘和读屏开箱即用
import { faqs } from '@/data/pages'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">常见问题</span>
      <h1>你可能<span class="mark">想问</span>的。</h1>
      <p class="lead">没找到答案的话，直接<RouterLink class="inline-link" to="/contact">联系我们</RouterLink>。</p>
    </header>

    <div class="faqs">
      <details v-for="(f, i) in faqs" :key="f.q" :open="i === 0">
        <summary>
          <span>{{ f.q }}</span>
          <span class="icon" aria-hidden="true" />
        </summary>
        <p>{{ f.a }}</p>
      </details>
    </div>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.inline-link {
  font-weight: 700;
  color: var(--text);
  background: linear-gradient(transparent 60%, var(--accent) 60%, var(--accent) 92%, transparent 92%);
}
.faqs {
  margin-bottom: 120px;
  border-top: 1px solid var(--border-strong);
}
details {
  border-bottom: 1px solid var(--border-strong);
}
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
/* 加号：展开后旋转成乘号 */
.icon {
  position: relative;
  flex: none;
  width: 32px;
  height: 32px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  transition:
    transform 0.3s var(--ease),
    background 0.2s;
}
.icon::before,
.icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  background: var(--ink);
  transform: translate(-50%, -50%);
}
.icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}
details[open] .icon {
  background: var(--accent);
  transform: rotate(45deg);
}
details p {
  max-width: 40em;
  margin: -8px 0 0;
  padding: 0 56px 28px 0;
  font-size: 17px;
  color: var(--text-2);
}
</style>
