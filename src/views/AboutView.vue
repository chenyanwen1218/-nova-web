<script setup lang="ts">
// 关于：项目理念 + 路线图
import { features, roadmap } from '@/data/home'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">关于 Nova</span>
      <h1>让工具像<span class="mark">伙伴</span>一样。</h1>
      <p class="lead">
        Nova 把常见的工作拆给几个性格鲜明的助手。界面先行，后端服务正在接入，下面是我们在意的事和接下来的计划。
      </p>
    </header>

    <section class="block" aria-labelledby="values-title">
      <h2 id="values-title">我们在意的</h2>
      <ul class="rows">
        <li v-for="f in features" :key="f.title" class="row">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </li>
      </ul>
    </section>

    <section class="block" aria-labelledby="roadmap-title">
      <h2 id="roadmap-title">路线图</h2>
      <ol class="timeline">
        <li v-for="m in roadmap" :key="m.when" :class="{ done: m.done }">
          <span class="dot" aria-hidden="true" />
          <span class="when">{{ m.when }}</span>
          <span class="what">{{ m.title }}</span>
          <span class="state">{{ m.done ? '已完成' : '进行中' }}</span>
        </li>
      </ol>
    </section>

    <section class="cta">
      <h2>先去认识一下它们？</h2>
      <div class="actions">
        <RouterLink class="btn btn-primary" to="/buddies">认识助手</RouterLink>
        <RouterLink class="btn btn-ghost" to="/gallery">逛逛影像</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.block {
  padding: 48px 0;
}
.block h2 {
  margin: 0 0 24px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.timeline {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 竖线 */
.timeline::before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 7px;
  width: 2px;
  background: var(--border-strong);
}
.timeline li {
  position: relative;
  display: grid;
  grid-template-columns: 16px 120px minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: 18px 0;
}
.dot {
  width: 16px;
  height: 16px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--bg);
}
.done .dot {
  background: var(--accent);
}
.when {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-2);
}
.what {
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.state {
  padding: 2px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-3);
}
.done .state {
  border-color: var(--ink);
  background: var(--accent);
  color: var(--accent-ink);
}

.cta {
  margin: 48px 0 120px;
  padding: 56px 40px;
  border-radius: var(--radius-lg);
  background: var(--ink);
  color: var(--on-ink);
}
.cta h2 {
  margin: 0 0 28px;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.cta .btn-ghost {
  border-color: rgba(243, 237, 225, 0.3);
  color: var(--on-ink);
}
.cta .btn-ghost:hover {
  background: rgba(243, 237, 225, 0.08);
}
.cta .btn-primary {
  box-shadow: 3px 3px 0 var(--accent-ink);
}

@media (max-width: 640px) {
  .timeline li {
    grid-template-columns: 16px minmax(0, 1fr) auto;
    gap: 4px 16px;
  }
  .when {
    grid-column: 2;
  }
  .what {
    grid-column: 2;
    grid-row: 2;
  }
  .state {
    grid-row: 1 / 3;
    grid-column: 3;
  }
  .cta {
    padding: 40px 24px;
  }
}
</style>
