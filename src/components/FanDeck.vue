<script setup lang="ts">
// 扇形助手卡：进页面时从一叠散开成扇形（只播一次），之后保持展开。
// 悬停或点击某张卡时它上浮回正；点击可在手机上切换当前助手。
import { onMounted, ref } from 'vue'
import type { Buddy } from '@/data/home'

const props = defineProps<{ items: Buddy[] }>()
const mid = (props.items.length - 1) / 2

const spread = ref(false)
// 入场结束后去掉错峰延迟，避免之后悬停有滞后感
const settled = ref(false)
const active = ref(Math.floor(mid))

onMounted(() => {
  // 减少动态效果：直接定在展开状态，不播入场
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    spread.value = true
    settled.value = true
    return
  }
  // 等首帧以收拢状态绘制后再展开，过渡才会生效
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      spread.value = true
      window.setTimeout(() => (settled.value = true), 900)
    }),
  )
})

function cardStyle(item: Buddy, i: number) {
  const o = i - mid
  return {
    '--o': o,
    '--abs-o': Math.abs(o),
    '--c1': item.colors[0],
    '--c2': item.colors[1],
    '--delay': `${Math.abs(o) * 40}ms`,
    zIndex: i === active.value ? 20 : 10 - Math.abs(o),
  }
}
</script>

<template>
  <div class="fan">
    <ul class="deck" :class="{ spread, settled }" aria-label="Nova 助手">
      <li v-for="(item, i) in items" :key="item.name" class="slot" :style="cardStyle(item, i)">
        <button
          type="button"
          class="card"
          :class="{ active: i === active }"
          :aria-pressed="i === active"
          @click="active = i"
        >
          <span class="card-head">
            <strong>{{ item.name }}</strong>
            <span>{{ item.tag }}</span>
          </span>
          <span class="card-emoji" aria-hidden="true">{{ item.emoji }}</span>
        </button>
      </li>
    </ul>
    <p class="caption" aria-live="polite">
      当前助手 <strong>{{ items[active].name }}</strong> · {{ items[active].tag }}
    </p>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.fan {
  --w: 164px;
  --h: 224px;
  --gap: 88px;
  --tilt: 7deg;
}

.deck {
  position: relative;
  height: calc(var(--h) + 96px);
  margin: 0;
  padding: 0;
  list-style: none;
}

.slot {
  position: absolute;
  left: calc(50% - var(--w) / 2);
  bottom: 40px;
  width: var(--w);
  height: var(--h);
}

.card {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 16px;
  border: 1px solid rgba(40, 30, 10, 0.14);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 80% at 20% 0%, rgba(255, 255, 255, 0.55), transparent 60%),
    linear-gradient(165deg, var(--c1), var(--c2));
  box-shadow:
    var(--shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  text-align: left;
  cursor: pointer;
  transform-origin: 50% 130%;
  /* 收拢状态：轻微错开的一叠 */
  transform: translateX(calc(var(--o) * 10px)) rotate(calc(var(--o) * 2deg));
  transition:
    transform 0.7s var(--ease),
    box-shadow 0.3s;
}

/* 展开状态：拉开、倾斜、两侧下沉；入场时由中间向两侧错峰 */
.spread .card {
  transform: translateX(calc(var(--o) * var(--gap))) translateY(calc(var(--abs-o) * 12px))
    rotate(calc(var(--o) * var(--tilt)));
  transition-delay: var(--delay), 0ms;
}
.settled .card {
  transition-delay: 0ms;
}

/* 当前卡与悬停卡：上浮回正 */
.spread .card.active,
.spread .card:hover,
.spread .card:focus-visible {
  transform: translateX(calc(var(--o) * var(--gap))) translateY(-24px) rotate(0deg) scale(1.04);
  box-shadow:
    0 28px 50px -20px rgba(60, 40, 10, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.slot:has(.card:hover),
.slot:has(.card:focus-visible) {
  z-index: 30 !important;
}

.card:active {
  scale: 0.98;
}

.card-head {
  display: flex;
  flex-direction: column;
  color: var(--ink);
}
.card-head strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.card-head span {
  font-size: 12px;
  color: var(--ink-2);
}

.card-emoji {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-size: 68px;
  line-height: 1;
  filter: drop-shadow(0 8px 10px rgba(60, 40, 10, 0.25));
  transition: transform 0.6s var(--ease);
}
.card.active .card-emoji,
.card:hover .card-emoji {
  transform: translateY(-6px) rotate(-8deg) scale(1.08);
}

.caption {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-3);
}
.caption strong {
  color: var(--text);
}

/* 减少动态效果：去掉所有位移过渡，卡片直接停在终态 */
@media (prefers-reduced-motion: reduce) {
  .card,
  .card-emoji {
    transition: none;
  }
  .card.active .card-emoji,
  .card:hover .card-emoji {
    transform: none;
  }
}

@media (max-width: 640px) {
  .fan {
    --w: 112px;
    --h: 156px;
    --gap: 46px;
    --tilt: 6deg;
  }
  .card-head strong {
    font-size: 15px;
  }
  .card-head span {
    font-size: 11px;
  }
  .card-emoji {
    font-size: 44px;
  }
}
</style>
