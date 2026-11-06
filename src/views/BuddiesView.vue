<script setup lang="ts">
// 助手列表：五个助手的卡片墙，点击进入详情
import { buddies } from '@/data/home'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">助手 · {{ buddies.length }} 位</span>
      <h1>挑一个<span class="mark">顺手</span>的。</h1>
      <p class="lead">每个助手只做好一类事。先认识它们，再决定把什么交出去。</p>
    </header>

    <ul class="grid" aria-label="助手列表">
      <li v-for="b in buddies" :key="b.slug">
        <RouterLink class="card" :to="`/buddies/${b.slug}`" :style="{ '--c1': b.colors[0], '--c2': b.colors[1] }">
          <span class="card-top">
            <strong>{{ b.name }}</strong>
            <span class="tag">{{ b.tag }}</span>
          </span>
          <span class="emoji" aria-hidden="true">{{ b.emoji }}</span>
          <span class="intro">{{ b.intro }}</span>
          <span class="more" aria-hidden="true">查看详情 →</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin: 0 0 120px;
  padding: 0;
  list-style: none;
}
.card {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 16px;
  height: 100%;
  min-height: 340px;
  padding: 24px;
  border: 2px solid var(--ink);
  border-radius: var(--radius-lg);
  background: linear-gradient(160deg, var(--c1), var(--c2));
  box-shadow: 4px 4px 0 var(--ink);
  transition:
    transform 0.35s var(--ease),
    box-shadow 0.35s var(--ease);
}
.card:hover {
  transform: translate(-2px, -4px) rotate(-1deg);
  box-shadow: 6px 8px 0 var(--ink);
}
.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.card-top strong {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.tag {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 2px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.4);
}
.emoji {
  align-self: center;
  justify-self: center;
  font-size: 72px;
  line-height: 1;
  transition: transform 0.4s var(--ease);
}
.card:hover .emoji {
  transform: scale(1.12) rotate(6deg);
}
.intro {
  font-size: 15px;
  color: var(--ink-2);
}
.more {
  font-size: 14px;
  font-weight: 700;
}
</style>
