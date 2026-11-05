<script setup lang="ts">
// 3D 环形画廊：卡片沿 Y 轴均匀排成一圈，统一墨色卡面。
// 只在滚到视野里时旋转，离开就停；悬停或键盘聚焦时暂停。
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { GalleryItem } from '@/data/home'

const props = defineProps<{ items: GalleryItem[] }>()
const step = 360 / props.items.length

const stage = ref<HTMLElement | null>(null)
const inView = ref(false)
let io: IntersectionObserver | undefined

onMounted(() => {
  if (!stage.value) return
  io = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), { threshold: 0.2 })
  io.observe(stage.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div ref="stage" class="stage" :class="{ running: inView }">
    <ul class="ring" aria-label="功能模块">
      <li v-for="(item, i) in items" :key="item.title" class="panel" :style="{ '--deg': `${i * step}deg` }">
        <span class="panel-emoji" aria-hidden="true">{{ item.emoji }}</span>
        <span class="panel-title">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.stage {
  --radius-3d: 380px;
  /* 前排卡片经透视放大约 1.37 倍，mask-image 会裁掉盒子外的部分，需留足高度 */
  height: 420px;
  perspective: 1400px;
  display: grid;
  place-items: center;
  /* 两侧淡出，营造景深（mask 只读透明度，颜色无关） */
  mask-image: linear-gradient(90deg, transparent, rgb(29 26 20) 18%, rgb(29 26 20) 82%, transparent);
}

.ring {
  position: relative;
  width: 200px;
  height: 260px;
  margin: 0;
  padding: 0;
  list-style: none;
  transform-style: preserve-3d;
  animation: spin 40s linear infinite;
  animation-play-state: paused;
}
.running .ring {
  animation-play-state: running;
}
.stage:hover .ring,
.stage:focus-within .ring {
  animation-play-state: paused;
}

.panel {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid rgba(243, 237, 225, 0.12);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(120% 70% at 0% 0%, rgba(255, 207, 63, 0.14), transparent 55%),
    linear-gradient(170deg, #2b2620, #17140f);
  color: var(--on-ink);
  box-shadow: inset 0 1px 0 rgba(243, 237, 225, 0.08);
  transform: rotateY(var(--deg)) translateZ(var(--radius-3d));
  backface-visibility: hidden;
}

.panel-emoji {
  font-size: 52px;
  line-height: 1;
}
.panel-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

@keyframes spin {
  to {
    transform: rotateY(-360deg);
  }
}

/* 减少动态效果：停在正面，不旋转 */
@media (prefers-reduced-motion: reduce) {
  .ring {
    animation: none;
  }
}

@media (max-width: 640px) {
  .stage {
    --radius-3d: 220px;
    height: 280px;
  }
  .ring {
    width: 130px;
    height: 180px;
  }
  .panel {
    padding: 14px;
  }
  .panel-emoji {
    font-size: 40px;
  }
  .panel-title {
    font-size: 16px;
  }
}
</style>
