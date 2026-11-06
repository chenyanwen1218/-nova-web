<script setup lang="ts">
// 更新日志：按版本倒序
import { releases } from '@/data/pages'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">更新日志</span>
      <h1>每一版<span class="mark">改了什么</span>。</h1>
      <p class="lead">预览期间更新比较频繁，这里记录每个版本的主要变化。</p>
    </header>

    <ol class="releases">
      <li v-for="(r, i) in releases" :key="r.version" class="release">
        <div class="meta">
          <span class="version" :class="{ latest: i === 0 }">{{ r.version }}</span>
          <time :datetime="r.date">{{ r.date }}</time>
        </div>
        <ul class="notes">
          <li v-for="n in r.notes" :key="n">{{ n }}</li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.releases {
  margin: 0 0 120px;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--border-strong);
}
.release {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 24px;
  padding: 32px 0;
  border-bottom: 1px solid var(--border-strong);
}
.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.version {
  padding: 2px 12px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  font-size: 18px;
  font-weight: 800;
}
.version.latest {
  background: var(--accent);
  color: var(--accent-ink);
}
time {
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--text-3);
}
.notes {
  margin: 0;
  padding: 0;
  list-style: none;
}
.notes li {
  position: relative;
  padding: 4px 0 4px 20px;
  font-size: 17px;
}
.notes li::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 0;
  width: 8px;
  height: 2px;
  background: var(--ink);
}

@media (max-width: 640px) {
  .release {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .meta {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
}
</style>
