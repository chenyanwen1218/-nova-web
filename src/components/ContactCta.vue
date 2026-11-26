<script setup lang="ts">
// 页面底部的联系入口：首页、关于、服务页共用
import { profile } from '@/data/profile'

defineProps<{ hideServices?: boolean }>()
</script>

<template>
  <section class="cta" aria-labelledby="cta-title">
    <h2 id="cta-title">有项目想做？</h2>
    <p v-if="profile.responseTime">回复时间：{{ profile.responseTime }}</p>
    <div class="actions">
      <RouterLink class="btn btn-primary" to="/contact">聊聊你的项目</RouterLink>
      <RouterLink v-if="!hideServices" class="btn btn-ghost" to="/services">看服务和报价</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cta {
  margin: 48px 0 120px;
  padding: 56px 40px;
  border-radius: var(--radius-lg);
  background: var(--ink);
  color: var(--on-ink);
}
h2 {
  margin: 0 0 12px;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
p {
  margin: 0;
  color: var(--on-ink-2);
}
.actions {
  margin-top: 28px;
}
.btn-ghost {
  border-color: rgba(243, 237, 225, 0.3);
  color: var(--on-ink);
}
.btn-ghost:hover {
  background: rgba(243, 237, 225, 0.08);
}
.btn-primary {
  box-shadow: 3px 3px 0 var(--accent-ink);
}
/* 墨色底上全站默认的墨色焦点框看不见 */
.cta :focus-visible {
  outline-color: var(--accent);
}

@media (max-width: 640px) {
  .cta {
    padding: 40px 24px;
  }
}
</style>
