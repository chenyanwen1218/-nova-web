<script setup lang="ts">
// 一张流体玻璃卡片。分层固定为：玻璃底材 → 透明 WebGL 流体 → 左侧内容遮罩 → 噪点 → 边缘高光 → 内容。
// WebGL 不可用或超出上下文预算时，自动切到 CSS 渐变降级层。
import { computed, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'
import { FluidRenderer, materialTokens, type FluidCard, type RenderMode } from '@/utils/fluidGlass'

const props = defineProps<{ card: FluidCard; index: number; selected: boolean }>()
const emit = defineEmits<{ select: [key: string]; mode: [key: string, mode: RenderMode] }>()

const el = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const mode = ref<RenderMode>('webgl')
let renderer: FluidRenderer | undefined

const tokens = computed(() => materialTokens(props.card.surface))
const vars = computed(() => {
  const t = tokens.value
  return {
    '--fluid-a': props.card.a,
    '--fluid-b': props.card.b,
    '--fluid-c': props.card.c,
    '--surface-opacity': t.surface,
    '--content-shade': t.shade,
    '--content-shade-mid': t.shadeMid,
    '--content-shade-soft': t.shadeSoft,
    '--top-glow': t.topGlow,
    '--bottom-shade': t.bottomShade,
    '--stat-text': t.text,
    '--stat-title': t.title,
    '--stat-muted': t.muted,
    '--stat-eyebrow': t.eyebrow,
    '--stat-change': t.change,
    '--edge-highlight': t.edge,
  }
})
const up = computed(() => props.card.change >= 0)

onMounted(() => {
  if (!el.value || !canvas.value) return
  // 传原始对象：面板改的是同一个对象，渲染循环每帧直接读取，不经过响应式代理
  renderer = new FluidRenderer(el.value, canvas.value, toRaw(props.card), props.index, (m) => {
    mode.value = m
    emit('mode', props.card.key, m)
  })
})

// 恢复默认时卡片对象会被整体替换
watch(
  () => props.card,
  (c) => renderer?.setConfig(toRaw(c)),
)

onBeforeUnmount(() => renderer?.destroy())
</script>

<template>
  <button
    ref="el"
    type="button"
    class="fg-card"
    :class="{ 'is-selected': selected, 'is-fallback': mode === 'fallback' }"
    :style="vars"
    :aria-pressed="selected"
    @click="emit('select', card.key)"
  >
    <canvas ref="canvas" class="fg-fluid-canvas" aria-hidden="true" />
    <span class="fg-fluid-fallback" aria-hidden="true" />
    <span class="fg-noise" aria-hidden="true" />
    <span class="fg-content">
      <span class="fg-eyebrow">{{ card.eyebrow }}</span>
      <span class="fg-title">{{ card.label }}</span>
      <span>
        <span class="fg-value">{{ card.value }}</span>
        <span class="fg-unit">{{ card.unit }}</span>
      </span>
      <span class="fg-change">
        较昨日
        <span :class="up ? 'fg-up' : 'fg-down'">{{ up ? '↑' : '↓' }} {{ Math.abs(card.change) }}%</span>
      </span>
    </span>
  </button>
</template>

<style scoped>
/* 材质内核：几何、分层顺序、透明度预算与 fluidglass-ui 保持一致 */
.fg-card {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  height: 144px;
  padding: 0;
  border: 1px solid rgba(153, 255, 237, 0.18);
  border-radius: 30px;
  overflow: hidden;
  isolation: isolate;
  color: #eefcf8;
  text-align: left;
  background-color: rgba(255, 255, 255, var(--surface-opacity));
  -webkit-backdrop-filter: blur(16px) saturate(118%);
  backdrop-filter: blur(16px) saturate(118%);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, 0.28),
    0 2px 8px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(222, 255, 248, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.24);
  cursor: pointer;
  transform: translateZ(0);
  transition:
    transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}
.fg-card:hover,
.fg-card.is-selected {
  transform: translateY(-3px);
  border-color: rgba(111, 255, 228, 0.38);
  box-shadow:
    0 23px 42px rgba(0, 0, 0, 0.36),
    0 3px 9px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(226, 255, 249, 0.15),
    0 0 0 1px rgba(91, 246, 218, 0.08),
    0 0 32px rgba(0, 231, 210, 0.1);
}
.fg-card:focus-visible {
  outline: 2px solid #5bf6da;
  outline-offset: 3px;
}

.fg-fluid-canvas,
.fg-fluid-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
}
.fg-fluid-canvas {
  z-index: 0;
  display: block;
  opacity: 0.96;
  transform: scale(1.035);
  filter: saturate(1.1) contrast(1.04) blur(1.8px);
}
.fg-fluid-fallback {
  z-index: -1;
  opacity: 0;
  background:
    radial-gradient(ellipse at 82% 18%, color-mix(in srgb, var(--fluid-a), transparent 10%) 0 8%, transparent 42%),
    radial-gradient(ellipse at 62% 88%, color-mix(in srgb, var(--fluid-b), transparent 18%) 0 13%, transparent 52%),
    radial-gradient(ellipse at 98% 58%, color-mix(in srgb, var(--fluid-c), transparent 8%) 0 10%, transparent 48%),
    radial-gradient(ellipse at 48% 45%, rgba(0, 231, 210, 0.12), transparent 58%);
  background-size:
    130% 145%,
    150% 155%,
    135% 150%,
    115% 125%;
  animation: drift 9s ease-in-out infinite alternate;
}
.is-fallback .fg-fluid-canvas {
  display: none;
}
.is-fallback .fg-fluid-fallback {
  z-index: 0;
  opacity: 0.92;
}
@keyframes drift {
  0% {
    background-position: 100% 0, 70% 100%, 100% 50%, 35% 40%;
  }
  50% {
    background-position: 78% 20%, 92% 72%, 70% 34%, 56% 60%;
  }
  100% {
    background-position: 100% 30%, 58% 84%, 94% 70%, 42% 48%;
  }
}

/* 左侧内容保护遮罩 + 顶部微光 / 底部压暗 */
.fg-card::before {
  content: '';
  position: absolute;
  z-index: 1;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(2, 10, 8, var(--content-shade)) 0%,
      rgba(3, 13, 11, var(--content-shade-mid)) 28%,
      rgba(3, 14, 12, var(--content-shade-soft)) 50%,
      transparent 76%
    ),
    linear-gradient(180deg, rgba(208, 255, 246, var(--top-glow)), transparent 34%, rgba(0, 0, 0, var(--bottom-shade)));
}
/* 边缘高光 */
.fg-card::after {
  content: '';
  position: absolute;
  z-index: 4;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, var(--edge-highlight)),
    inset 0 -1px 2px rgba(0, 0, 0, 0.26),
    inset -22px 0 34px rgba(0, 231, 210, 0.025);
}
.fg-noise {
  position: absolute;
  z-index: 2;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0.075;
  mix-blend-mode: soft-light;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(220, 255, 248, 0.7) 0 0.42px, transparent 0.78px),
    radial-gradient(circle at 70% 65%, rgba(0, 40, 34, 0.78) 0 0.4px, transparent 0.75px);
  background-size:
    4px 4px,
    5px 5px;
}

.fg-content {
  position: relative;
  z-index: 3;
  height: 100%;
  padding: 18px 20px 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--stat-text);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.34);
}
.fg-eyebrow {
  margin-bottom: 4px;
  max-width: 78%;
  color: var(--stat-eyebrow);
  font-size: 10px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: 0.065em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fg-title {
  margin-bottom: 5px;
  color: var(--stat-title);
  font-size: 15px;
  line-height: 1.25;
  font-weight: 600;
}
.fg-value {
  color: var(--stat-text);
  font-size: 38px;
  line-height: 0.98;
  font-weight: 500;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
}
.fg-unit {
  margin-left: 5px;
  color: var(--stat-muted);
  font-size: 11px;
  text-shadow: none;
}
.fg-change {
  margin-top: 6px;
  color: var(--stat-change);
  font-size: 11px;
  line-height: 1.35;
}
.fg-up {
  color: #35e9bb;
  font-weight: 500;
}
.fg-down {
  color: #ff7280;
  font-weight: 500;
}

@media (prefers-reduced-motion: reduce) {
  .fg-fluid-fallback {
    animation: none;
  }
  .fg-card {
    transition: none;
  }
  .fg-card:hover,
  .fg-card.is-selected {
    transform: translateZ(0);
  }
}
</style>
