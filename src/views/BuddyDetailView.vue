<script setup lang="ts">
// 助手详情：路由参数 slug 由 router 以 props 传入；找不到时给出提示
import { computed } from 'vue'
import { buddies } from '@/data/home'

const props = defineProps<{ slug: string }>()

const index = computed(() => buddies.findIndex((b) => b.slug === props.slug))
const buddy = computed(() => buddies[index.value])
// 上一位 / 下一位循环切换
const prev = computed(() => buddies[(index.value - 1 + buddies.length) % buddies.length])
const next = computed(() => buddies[(index.value + 1) % buddies.length])
</script>

<template>
  <div class="container">
    <template v-if="buddy">
      <RouterLink class="back" to="/buddies">← 全部助手</RouterLink>

      <section class="detail" aria-labelledby="buddy-name">
        <div class="portrait" :style="{ '--c1': buddy.colors[0], '--c2': buddy.colors[1] }" aria-hidden="true">
          <span class="emoji">{{ buddy.emoji }}</span>
        </div>

        <div class="copy">
          <span class="pill">{{ buddy.tag }}</span>
          <h1 id="buddy-name">{{ buddy.name }}</h1>
          <p class="lead">{{ buddy.intro }}</p>

          <h2>它擅长</h2>
          <ul class="skills">
            <li v-for="s in buddy.skills" :key="s">{{ s }}</li>
          </ul>

          <div class="actions">
            <button type="button" class="btn btn-primary" disabled title="后端接入后开放">召唤 {{ buddy.name }}</button>
            <RouterLink class="btn btn-ghost" to="/about">了解进度</RouterLink>
          </div>
          <p class="note">后端服务接入后即可使用。</p>
        </div>
      </section>

      <nav class="pager" aria-label="切换助手">
        <RouterLink :to="`/buddies/${prev.slug}`">
          <span>上一位</span><strong>{{ prev.emoji }} {{ prev.name }}</strong>
        </RouterLink>
        <RouterLink :to="`/buddies/${next.slug}`" class="to-next">
          <span>下一位</span><strong>{{ next.name }} {{ next.emoji }}</strong>
        </RouterLink>
      </nav>
    </template>

    <section v-else class="page-head">
      <span class="pill">找不到</span>
      <h1>没有叫 “{{ slug }}” 的助手。</h1>
      <div class="actions">
        <RouterLink class="btn btn-primary" to="/buddies">看看全部助手</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.back {
  display: inline-block;
  margin-top: 40px;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-2);
}
.back:hover {
  color: var(--text);
}

.detail {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 56px;
  padding: 32px 0 80px;
}
.portrait {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 5;
  border: 2px solid var(--ink);
  border-radius: 32px;
  background: linear-gradient(160deg, var(--c1), var(--c2));
  box-shadow: 8px 8px 0 var(--ink);
  transform: rotate(-2deg);
}
.emoji {
  font-size: clamp(120px, 16vw, 200px);
  line-height: 1;
}

.copy h1 {
  margin: 16px 0;
  font-size: clamp(56px, 8vw, 112px);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.05em;
}
.copy h2 {
  margin: 40px 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-3);
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.skills li {
  padding: 8px 16px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: var(--bg-elevated);
  font-weight: 600;
}
.actions {
  margin-top: 40px;
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}
.note {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--text-3);
}

.pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 96px;
  border-top: 1px solid var(--border-strong);
  border-bottom: 1px solid var(--border-strong);
}
.pager a {
  display: grid;
  gap: 4px;
  padding: 28px 0;
  transition: padding 0.4s var(--ease);
}
.pager a span {
  font-size: 13px;
  color: var(--text-3);
}
.pager a strong {
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: -0.03em;
}
.pager .to-next {
  justify-items: end;
  border-left: 1px solid var(--border-strong);
}
@media (hover: hover) and (pointer: fine) {
  .pager a:hover {
    padding-left: 12px;
  }
  .pager .to-next:hover {
    padding-left: 0;
    padding-right: 12px;
  }
}

@media (max-width: 900px) {
  .detail {
    grid-template-columns: minmax(0, 1fr);
    gap: 40px;
  }
  .portrait {
    max-width: 360px;
  }
}
</style>
