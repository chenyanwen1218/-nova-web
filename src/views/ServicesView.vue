<script setup lang="ts">
// 服务和报价：能接的几类活、合作流程、合作问答。内容都在 src/data/profile.ts
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ContactCta from '@/components/ContactCta.vue'
import { faqs, services, steps } from '@/data/profile'

// 从别处链接到某一项（如 /services#audit）时高亮它。
// 不能用 CSS :target：这些卡片是页面加载后才渲染的，路由切换也不会触发 :target
const route = useRoute()
const targeted = computed(() => route.hash.slice(1))
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1>能帮你做什么</h1>
      <p class="lead">下面这几类活都接。价格按页面数量和交互的复杂程度估算，开工前给出总价。</p>
    </header>

    <ul class="plans">
      <li v-for="s in services" :id="s.slug" :key="s.slug" class="plan" :class="{ targeted: targeted === s.slug }">
        <div class="plan-head">
          <h2>{{ s.name }}</h2>
          <span class="emoji" aria-hidden="true">{{ s.emoji }}</span>
        </div>
        <!-- 没填价格就不显示这一行：页头已经写明开工前报价，每张卡再重复一遍「按需报价」是噪音 -->
        <p v-if="s.price || s.duration" class="price">
          <strong v-if="s.price">{{ s.price }}</strong>
          <span v-if="s.duration">{{ s.duration }}</span>
        </p>
        <p class="desc">{{ s.desc }}</p>
        <ul class="perks">
          <li v-for="k in s.includes" :key="k">{{ k }}</li>
        </ul>
        <RouterLink class="btn btn-ghost" :to="{ path: '/contact', query: { service: s.slug } }">
          咨询{{ s.name }}
        </RouterLink>
      </li>
    </ul>

    <section class="block" aria-labelledby="steps-title">
      <h2 id="steps-title">合作流程</h2>
      <ol class="steps">
        <li v-for="(st, i) in steps" :key="st.title">
          <span class="no" aria-hidden="true">{{ i + 1 }}</span>
          <h3>{{ st.title }}</h3>
          <p>{{ st.desc }}</p>
        </li>
      </ol>
    </section>

    <section id="faq" class="block" aria-labelledby="faq-title">
      <h2 id="faq-title">合作问答</h2>
      <div class="faqs">
        <details v-for="(f, i) in faqs" :key="f.q" :open="i === 0">
          <summary>
            <span>{{ f.q }}</span>
            <span class="icon" aria-hidden="true" />
          </summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </section>

    <ContactCta hide-services />
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  /* 吸顶导航的高度已经由 html 的 scroll-padding-top 让出来了，这里只留一点空隙 */
  scroll-margin-top: 16px;
}
/* 从首页「前端体检」等链接跳过来时，让对应的那一项显眼一点 */
.plan.targeted {
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
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.emoji {
  font-size: 36px;
  line-height: 1;
}
.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin: 0;
}
.price strong {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
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
.plan .btn {
  align-self: flex-start;
}

/* 间距大部分放在 margin 上：从 /faq 跳到「合作问答」时，标题紧贴在吸顶导航下面 */
.block {
  margin-top: 72px;
  padding-top: 24px;
}
.block h2 {
  margin: 0 0 32px;
  font-size: clamp(28px, 3.6vw, 44px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps li {
  display: grid;
  align-content: start;
  gap: 8px;
  padding-top: 20px;
  border-top: 2px solid var(--ink);
}
.no {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--accent);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.steps h3 {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 800;
}
.steps p {
  margin: 0;
  color: var(--text-2);
}

.faqs {
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
  padding: 24px 0;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 800;
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
  margin: -4px 0 0;
  padding: 0 56px 24px 0;
  font-size: 16px;
  color: var(--text-2);
}

@media (max-width: 900px) {
  .plans {
    grid-template-columns: minmax(0, 1fr);
  }
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .steps {
    grid-template-columns: minmax(0, 1fr);
  }
  .block {
    margin-top: 48px;
  }
}
</style>
