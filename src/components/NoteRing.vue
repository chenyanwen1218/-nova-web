<script setup lang="ts">
// 3D 笔记卡片环：卡片绕 Y 轴排成一圈。
// 拖动旋转（直接写 CSS 变量，跟手无延迟），滚轮缩放，点击某张卡片把它转到正前方并选中。
// 自动巡航开启时缓慢自转；不可见、或用户偏好减少动效时不跑动画。
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RingNote } from '@/data/reading'

const props = defineProps<{ notes: RingNote[]; cruise: boolean; speed: number }>()
const active = defineModel<number>('active', { default: 0 })
const emit = defineEmits<{ reset: [] }>()

const stage = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const dragging = ref(false)

const step = () => 360 / props.notes.length
let spin = 0
let zoom = 1
let target: number | null = null
let velocity = 0
let lastX = 0
let startX = 0
let moved = false
let raf = 0
let inView = false
let reduced = false
let io: IntersectionObserver | undefined

function apply() {
  const el = ring.value
  if (!el) return
  el.style.setProperty('--spin', `${spin}deg`)
  el.style.setProperty('--zoom', `${zoom}`)
}

// 把第 i 张转到正前方，走最短路径
function focus(i: number) {
  const desired = -i * step()
  target = desired + 360 * Math.round((spin - desired) / 360)
  active.value = i
  loop()
}

function tick() {
  raf = 0
  if (!inView) return
  if (target !== null) {
    const d = target - spin
    spin += d * 0.12
    if (Math.abs(d) < 0.05) {
      spin = target
      target = null
    }
  } else if (!dragging.value) {
    if (Math.abs(velocity) > 0.01 && !reduced) {
      spin += velocity
      velocity *= 0.93
    } else {
      velocity = 0
      if (props.cruise && !reduced) spin -= 0.06 * props.speed
    }
  }
  apply()
  loop()
}

function loop() {
  const busy = dragging.value || target !== null || velocity !== 0 || (props.cruise && !reduced)
  if (!raf && inView && busy) raf = requestAnimationFrame(tick)
}

function onDown(e: PointerEvent) {
  if (e.button !== 0) return
  dragging.value = true
  moved = false
  startX = lastX = e.clientX
  velocity = 0
  target = null
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}

function onMove(e: PointerEvent) {
  const dx = e.clientX - lastX
  if (Math.abs(e.clientX - startX) > 5) moved = true
  spin += dx * 0.3
  velocity = dx * 0.3
  lastX = e.clientX
  apply()
}

function onUp() {
  dragging.value = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
  // 松手后同步当前正前方的卡片
  if (moved) {
    const n = props.notes.length
    active.value = ((Math.round(-spin / step()) % n) + n) % n
  }
  loop()
  window.setTimeout(() => (moved = false))
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  zoom = Math.min(1.35, Math.max(0.7, zoom - e.deltaY * 0.001))
  apply()
}

function pick(i: number) {
  if (moved) return
  focus(i)
}

function reset() {
  zoom = 1
  focus(0)
  emit('reset')
}

defineExpose({ reset })

watch(
  () => props.cruise,
  () => loop(),
)

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  apply()
  stage.value?.addEventListener('wheel', onWheel, { passive: false })
  if (!stage.value) return
  io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    if (inView) loop()
    else if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  })
  io.observe(stage.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  stage.value?.removeEventListener('wheel', onWheel)
  if (raf) cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
})
</script>

<template>
  <div ref="stage" class="ring-stage" :class="{ dragging }" @pointerdown="onDown">
    <ul ref="ring" class="ring" :style="{ '--n': notes.length }" aria-label="笔记目录环">
      <li v-for="(n, i) in notes" :key="n.id" class="slot" :style="{ '--i': i }">
        <button
          type="button"
          class="note"
          :class="{ on: i === active }"
          :aria-pressed="i === active"
          :aria-label="`${n.title}，${n.count} 篇，${n.status}`"
          @click="pick(i)"
        >
          <span class="note-head">
            <span>{{ n.id }}</span>
            <i class="note-dot" />
          </span>
          <span class="note-lines" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span class="note-icon" aria-hidden="true">↕</span>
          <span class="note-title">{{ n.title }}</span>
          <span class="note-sub">{{ n.count }} 篇 · {{ n.status }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ring-stage {
  --r: clamp(180px, 22vw, 300px);
  --cw: clamp(110px, 11vw, 150px);
  --ch: calc(var(--cw) * 1.3);
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
  min-height: 300px;
  perspective: 1100px;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}
.ring-stage.dragging {
  cursor: grabbing;
}

.ring {
  position: relative;
  width: var(--cw);
  height: var(--ch);
  margin: 0;
  padding: 0;
  list-style: none;
  transform-style: preserve-3d;
  transform: scale(var(--zoom, 1)) rotateX(-8deg) rotateY(var(--spin, 0deg));
}

.slot {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(calc(360deg / var(--n) * var(--i))) translateZ(var(--r));
}

.note {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 12px;
  background: linear-gradient(160deg, #eef1f0, #b7bdbb 70%, #9aa19e);
  color: #3a403d;
  text-align: center;
  cursor: inherit;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 20px 40px -18px rgba(0, 0, 0, 0.8);
  transition:
    background 0.4s,
    box-shadow 0.4s,
    color 0.4s;
}
.note.on {
  border-color: rgba(140, 255, 190, 0.7);
  background: linear-gradient(165deg, #3ef08a, #16b85e 60%, #0d8a45);
  color: #04200f;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 0 50px rgba(40, 230, 120, 0.55),
    0 20px 40px -18px rgba(0, 0, 0, 0.8);
}
.note:focus-visible {
  outline: 2px solid #3ddc84;
  outline-offset: 3px;
}

.note-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 10px/1 ui-monospace, Consolas, monospace;
  opacity: 0.7;
}
.note-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.note-lines {
  display: grid;
  gap: 6px;
  margin: 14px 4px 0;
}
.note-lines i {
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  opacity: 0.25;
}
.note-lines i:nth-child(3) {
  width: 70%;
}
.note-icon {
  margin-top: auto;
  font-size: 16px;
}
.note-title {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 700;
}
.note-sub {
  font-size: 10px;
  opacity: 0.75;
}
</style>
