<script setup lang="ts">
// 莫比乌斯胶片带：照片沿一条扭转半圈的环形胶片排列，转一圈时正面与背面交替转到眼前。
// 横向拖动带动整圈旋转（直接写 CSS 变量，不走 Vue 响应式，跟手无延迟），松手后惯性滑行；
// 点击某一帧它离开胶片带，升到舞台中央并正面立起；抬起期间整圈停转。动画循环只在可见时运行。
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { FilmFrame } from '@/data/home'

const props = defineProps<{ items: FilmFrame[] }>()

// 照片少于一圈所需数量时循环铺满，保证环足够密
const COUNT = 24
const STEP = 360 / COUNT
const frames = computed(() =>
  Array.from({ length: COUNT }, (_, i) => {
    const item = props.items[i % props.items.length]
    return { ...item, key: `${item.id}-${i}`, no: String(i + 1).padStart(2, '0'), deg: STEP * i }
  }),
)

const AUTO = 0.05 // 自转：每帧角度
const DRAG = 0.28 // 拖动：每像素角度
const FRICTION = 0.94

const stage = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const active = ref(-1)
const front = ref(0)
const autoplay = ref(true)
const reducedMotion = ref(false)
const isDragging = ref(false)

let spin = 0
let velocity = 0
let target: number | null = null
let startX = 0
let lastX = 0
let lastT = 0
let moved = false
let pointerFocus = false
let inView = false
let raf = 0
let io: IntersectionObserver | undefined
let mq: MediaQueryList | undefined

function apply() {
  ring.value?.style.setProperty('--spin', `${spin}deg`)
  // 正对观众的那一帧：deg + spin ≡ 0
  const idx = Math.round((((-spin % 360) + 360) % 360) / STEP) % COUNT
  if (idx !== front.value) front.value = idx
}

function tick() {
  raf = 0
  if (!inView) return
  if (active.value !== -1) {
    // 有照片立在中央时整圈保持静止，否则它的反向旋转会跟着变
    velocity = 0
  } else if (target !== null) {
    const d = target - spin
    spin += d * 0.14
    if (Math.abs(d) < 0.05) {
      spin = target
      target = null
    }
  } else if (!isDragging.value) {
    if (Math.abs(velocity) > 0.01 && !reducedMotion.value) {
      spin += velocity
      velocity *= FRICTION
    } else {
      velocity = 0
      if (autoplay.value && !reducedMotion.value) spin -= AUTO
    }
  }
  apply()
  loop()
}

// 只有在确实有东西在动时才继续请求下一帧
function loop() {
  const busy =
    isDragging.value ||
    target !== null ||
    velocity !== 0 ||
    (autoplay.value && !reducedMotion.value && active.value === -1)
  if (!raf && inView && busy) raf = requestAnimationFrame(tick)
}

function onDown(e: PointerEvent) {
  pointerFocus = true
  if (e.button !== 0) return
  if ((e.target as HTMLElement).closest('.film-toggle')) return
  isDragging.value = true
  moved = false
  startX = lastX = e.clientX
  lastT = e.timeStamp
  velocity = 0
  target = null
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)
}

function onMove(e: PointerEvent) {
  const dx = e.clientX - lastX
  if (!moved && Math.abs(e.clientX - startX) > 6) {
    moved = true
    // 开始拖动时把立起的照片放回带上
    active.value = -1
  }
  spin += dx * DRAG
  const dt = Math.max(1, e.timeStamp - lastT)
  velocity = ((dx * DRAG) / dt) * 16
  lastX = e.clientX
  lastT = e.timeStamp
  apply()
}

function onUp(e: PointerEvent) {
  isDragging.value = false
  // 停住之后才松手，不应再滑行
  if (e.timeStamp - lastT > 80) velocity = 0
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
  loop()
  // click 在 pointerup 之后同一轮派发，下一轮再复位，避免之后键盘回车被当成拖动
  window.setTimeout(() => {
    pointerFocus = false
    moved = false
  })
}

function pick(i: number) {
  if (moved) return
  active.value = active.value === i ? -1 : i
  velocity = 0
  target = null
  loop()
}

// 键盘切换到某一帧时，把它转到正前方
function onFocus(i: number) {
  if (pointerFocus) return
  if (active.value !== -1 && active.value !== i) active.value = -1
  const desired = -frames.value[i].deg
  target = desired + 360 * Math.round((spin - desired) / 360)
  loop()
}

function toggleAutoplay() {
  autoplay.value = !autoplay.value
  loop()
}

function onMotionChange(e: MediaQueryListEvent) {
  reducedMotion.value = e.matches
  loop()
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener('change', onMotionChange)
  apply()
  if (!stage.value) return
  io = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      if (inView) loop()
      else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    },
    { threshold: 0.1 },
  )
  io.observe(stage.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  mq?.removeEventListener('change', onMotionChange)
  if (raf) cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
})
</script>

<template>
  <div ref="stage" class="film" :class="{ dragging: isDragging }" @pointerdown="onDown">
    <div class="film-scene">
      <ul ref="ring" class="film-ring" :class="{ 'has-active': active !== -1 }" aria-label="莫比乌斯胶片带">
        <li
          v-for="(f, i) in frames"
          :key="f.key"
          class="film-slot"
          :class="{ lifted: i === active }"
          :style="{ '--deg': `${f.deg}deg` }"
        >
          <button
            type="button"
            class="film-frame"
            :aria-pressed="i === active"
            :aria-label="`${f.alt}，摄影 ${f.author}`"
            @click="pick(i)"
            @focus="onFocus(i)"
          >
            <span class="face front">
              <span class="perf" aria-hidden="true"><i>{{ f.id }}</i><i>{{ f.no }}</i></span>
              <img :src="f.src" alt="" width="480" height="320" decoding="async" draggable="false" />
              <span class="perf" aria-hidden="true"><i>RECTO</i><i>{{ f.deg }}°</i></span>
            </span>
            <span class="face back" aria-hidden="true">
              <span class="perf"><i>{{ f.no }}</i><i>NOVA</i></span>
              <img :src="f.src" alt="" width="480" height="320" decoding="async" draggable="false" />
              <span class="perf"><i>VERSO</i><i>{{ f.id }}</i></span>
            </span>
          </button>
        </li>
      </ul>
    </div>

    <p class="film-label" aria-hidden="true">
      <b>NOVA 影像</b>
      <span>莫比乌斯胶片带 · 照片来自 Unsplash</span>
    </p>

    <button
      v-if="!reducedMotion"
      type="button"
      class="film-toggle"
      :aria-pressed="autoplay"
      aria-label="自动旋转"
      @click="toggleAutoplay"
    >
      <span :class="{ on: autoplay }">自转</span>
      <span :class="{ on: !autoplay }">暂停</span>
    </button>

    <div class="film-meta" aria-hidden="true">
      <span>
        第 <b>{{ frames[front].no }}</b> 帧 · 沿带 {{ frames[front].deg }}° · {{ frames[front].author }}
      </span>
      <span>拖动旋转 · 点击抬起</span>
    </div>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.film {
  --r: clamp(250px, 40vw, 540px);
  --fw: calc(var(--r) * 0.235);
  --fh: calc(var(--fw) * 0.86);
  --film: #17130e;
  --lift-scale: 1.3;
  --mono: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
  position: relative;
  height: calc(var(--r) * 1.15 + 160px);
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}
.film.dragging {
  cursor: grabbing;
}

.film-scene {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  perspective: calc(var(--r) * 3);
}

/* 整圈：略微俯视并倾斜，--spin 由 JS 每帧写入 */
.film-ring {
  position: relative;
  width: var(--fw);
  height: var(--fh);
  margin: 0;
  padding: 0;
  list-style: none;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateZ(-4deg) rotateY(var(--spin, 0deg));
}

/* 每一帧：绕 Y 轴排成一圈，再绕切线扭转 deg/2，一圈正好扭转 180°，形成莫比乌斯带 */
.film-slot {
  --lift: 0px;
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateY(var(--deg)) translateZ(calc(var(--r) + var(--lift))) rotateX(calc(var(--deg) / 2));
  transition: transform 0.6s var(--ease);
}
/* 立起：先抵消整圈的旋转与倾斜，回到屏幕坐标系，再朝观众推出并放大，正面朝前 */
.film-slot.lifted {
  z-index: 1;
  transform: rotateY(calc(var(--spin, 0deg) * -1)) rotateZ(4deg) rotateX(20deg) translateZ(calc(var(--r) * 1.3))
    scale(var(--lift-scale));
}

.film-frame {
  position: absolute;
  inset: 0;
  padding: 0;
  border: 0;
  background: none;
  cursor: inherit;
  transform-style: preserve-3d;
}
.film-frame:focus-visible {
  outline: none;
}

.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 3px;
  background: var(--film);
  box-shadow: 0 0 0 1px rgba(243, 237, 225, 0.08);
  backface-visibility: hidden;
  transition: box-shadow 0.4s var(--ease);
}
.front {
  transform: translateZ(0.5px);
}
.back {
  transform: rotateX(180deg) translateZ(0.5px);
  background: #231d15;
}

/* 背面同样是照片 */
/* 片孔条：矩形孔用渐变平铺，编号压在上面 */
.perf {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 14%;
  padding: 0 5%;
  background-image: linear-gradient(90deg, transparent 32%, rgba(243, 237, 225, 0.42) 32% 68%, transparent 68%);
  background-size: calc(var(--fw) / 9) 44%;
  background-position: 0 50%;
  background-repeat: repeat-x;
}
.perf i {
  padding: 0 3px;
  background: var(--film);
  font: 500 clamp(7px, calc(var(--fw) * 0.055), 10px) / 1 var(--mono);
  font-style: normal;
  letter-spacing: 0.06em;
  color: var(--on-ink-2);
}
.back .perf i {
  background: #231d15;
}

.face img {
  display: block;
  flex: 1;
  min-height: 0;
  width: 100%;
  object-fit: cover;
  filter: brightness(0.78) saturate(0.85);
  transition: filter 0.4s var(--ease);
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .film-frame:hover .face img {
    filter: brightness(0.95) saturate(1);
  }
}

/* 被点中的一帧：抬起、变亮、主色描边 */
.lifted .face img {
  filter: brightness(1.08) saturate(1.05);
}
.lifted .face {
  box-shadow:
    0 0 0 1.5px var(--accent),
    0 0 36px rgba(255, 207, 63, 0.28);
}
/* 有照片立起时，带上其余帧压暗（滤镜加在叶子节点上，不破坏 preserve-3d） */
.has-active .film-slot:not(.lifted) .face {
  filter: brightness(0.45);
}
.face {
  transition:
    box-shadow 0.4s var(--ease),
    filter 0.4s var(--ease);
}
.film-frame:focus-visible .face {
  box-shadow: 0 0 0 2px var(--accent);
}

.film-label,
.film-meta {
  position: absolute;
  z-index: 2;
  margin: 0;
  font: 12px/1.5 var(--mono);
  letter-spacing: 0.04em;
  color: var(--on-ink-2);
  pointer-events: none;
}
.film-label {
  top: 24px;
  left: 24px;
  display: flex;
  flex-direction: column;
}
.film-label b,
.film-meta b {
  color: var(--on-ink);
  font-weight: 700;
}
.film-meta {
  right: 24px;
  bottom: 24px;
  left: 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  font-variant-numeric: tabular-nums;
}

/* 自转开关，对应视频右上角的 run / hold */
.film-toggle {
  position: absolute;
  top: 18px;
  right: 24px;
  z-index: 3;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid rgba(243, 237, 225, 0.16);
  border-radius: 999px;
  background: rgba(23, 19, 14, 0.6);
  cursor: pointer;
}
.film-toggle span {
  padding: 6px 12px;
  border-radius: 999px;
  font: 12px/1 var(--mono);
  color: var(--on-ink-2);
  transition:
    background 0.2s,
    color 0.2s;
}
.film-toggle span.on {
  background: var(--on-ink);
  color: var(--ink);
}

@media (max-width: 640px) {
  .film {
    --r: clamp(220px, 62vw, 300px);
    --lift-scale: 1.8;
    height: calc(var(--r) * 1.2 + 200px);
  }
  .film-label {
    top: 20px;
    left: 20px;
  }
  .film-label span {
    display: none;
  }
  .film-toggle {
    top: 14px;
    right: 20px;
  }
  .film-meta {
    right: 20px;
    bottom: 20px;
    left: 20px;
    font-size: 11px;
  }
}
</style>
