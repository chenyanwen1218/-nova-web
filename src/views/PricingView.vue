<script setup lang="ts">
// 方案：三档价格卡，预览阶段暂不开放购买，按钮引到联系页预约
import { plans } from '@/data/pages'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">方案</span>
      <h1>按需挑选，<span class="mark">随时</span>升级。</h1>
      <p class="lead">预览期间全部免费。正式上线后按下面的方案计费，价格以上线时公布的为准。</p>
    </header>

    <ul class="plans">
      <li v-for="p in plans" :key="p.name" class="plan" :class="{ featured: p.featured }">
        <div class="plan-head">
          <h2>{{ p.name }}</h2>
          <span v-if="p.featured" class="badge">最受欢迎</span>
        </div>
        <p class="price">
          <strong>{{ p.price }}</strong><span>{{ p.unit }}</span>
        </p>
        <p class="desc">{{ p.desc }}</p>
        <ul class="perks">
          <li v-for="k in p.perks" :key="k">{{ k }}</li>
        </ul>
        <RouterLink class="btn" :class="p.featured ? 'btn-primary' : 'btn-ghost'" to="/contact">
          预约{{ p.name }}
        </RouterLink>
      </li>
    </ul>

    <p class="note">还有疑问？先看看<RouterLink to="/faq">常见问题</RouterLink>。</p>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.plan {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 28px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--bg-elevated);
}
/* 主推方案：和主按钮同一套墨色描边 + 硬投影 */
.plan.featured {
  border: 2px solid var(--ink);
  box-shadow: 5px 5px 0 var(--ink);
}
.plan-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.plan h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.badge {
  padding: 2px 10px;
  border: 1px solid var(--ink);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 12px;
  font-weight: 700;
}
.price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0;
}
.price strong {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.price span {
  color: var(--text-3);
}
.desc {
  margin: 0;
  color: var(--text-2);
}
.perks {
  flex: 1;
  margin: 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--border);
  list-style: none;
}
.perks li {
  position: relative;
  padding: 6px 0 6px 26px;
}
/* 对勾：用边框画，不依赖图标字体 */
.perks li::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 4px;
  width: 10px;
  height: 6px;
  border-bottom: 2px solid var(--ink);
  border-left: 2px solid var(--ink);
  transform: rotate(-45deg);
}
.note {
  margin: 48px 0 120px;
  text-align: center;
  color: var(--text-2);
}
.note a {
  margin-left: 4px;
  font-weight: 700;
  color: var(--text);
  background: linear-gradient(transparent 60%, var(--accent) 60%, var(--accent) 92%, transparent 92%);
}

@media (max-width: 900px) {
  .plans {
    grid-template-columns: minmax(0, 1fr);
    max-width: 520px;
  }
}
</style>
