<script setup lang="ts">
// 影像：照片网格，点击用原生 <dialog> 放大查看（自带焦点管理和 Esc 关闭），左右键切换
import { computed, ref } from 'vue'
import { films } from '@/data/home'

const dialog = ref<HTMLDialogElement | null>(null)
const current = ref(0)
const frame = computed(() => films[current.value])

function open(i: number) {
  current.value = i
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}
function step(d: number) {
  current.value = (current.value + d + films.length) % films.length
}
// 点击遮罩（dialog 自身而非内容）时关闭
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) close()
}
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">影像 · {{ films.length }} 帧</span>
      <h1>慢一点，<span class="mark">看看远处</span>。</h1>
      <p class="lead">首页胶片带里的每一帧都在这里。点开任意一张放大，用方向键翻看。</p>
    </header>

    <ul class="grid" aria-label="照片列表">
      <li v-for="(f, i) in films" :key="f.id" :class="{ wide: i % 5 === 0 }">
        <button type="button" class="thumb" :aria-label="`放大查看：${f.alt}`" @click="open(i)">
          <img :src="f.src" :alt="f.alt" loading="lazy" decoding="async" />
          <span class="meta">
            <span class="no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span>{{ f.author }}</span>
          </span>
        </button>
      </li>
    </ul>

    <dialog
      ref="dialog"
      class="viewer"
      aria-label="照片查看"
      @click="onBackdrop"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
    >
      <figure>
        <img :src="frame.src" :alt="frame.alt" />
        <figcaption>
          <span>{{ frame.alt }}</span>
          <span class="credit">摄影 {{ frame.author }} · Unsplash</span>
        </figcaption>
      </figure>
      <div class="controls">
        <button type="button" aria-label="上一张" @click="step(-1)">←</button>
        <span aria-live="polite">{{ current + 1 }} / {{ films.length }}</span>
        <button type="button" aria-label="下一张" @click="step(1)">→</button>
        <button type="button" class="close" aria-label="关闭" @click="close">✕</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-flow: dense;
  gap: 16px;
  margin: 0 0 120px;
  padding: 0;
  list-style: none;
}
.grid .wide {
  grid-column: span 2;
}
.thumb {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: var(--radius);
  background: var(--ink);
  cursor: zoom-in;
}
.wide .thumb {
  aspect-ratio: auto;
  height: 100%;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.6s var(--ease),
    opacity 0.3s;
}
.meta {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  justify-content: space-between;
  padding: 32px 14px 12px;
  font-size: 13px;
  color: var(--on-ink);
  background: linear-gradient(transparent, rgba(29, 26, 20, 0.7));
  opacity: 0;
  transition: opacity 0.3s;
}
.no {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.thumb:hover img,
.thumb:focus-visible img {
  transform: scale(1.05);
}
.thumb:hover .meta,
.thumb:focus-visible .meta {
  opacity: 1;
}
/* 触屏没有悬停，信息常显 */
@media (hover: none) {
  .meta {
    opacity: 1;
  }
}

.viewer {
  width: min(960px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  padding: 0;
  border: 0;
  border-radius: var(--radius-lg);
  background: var(--ink);
  color: var(--on-ink);
}
.viewer::backdrop {
  background: rgba(29, 26, 20, 0.72);
  backdrop-filter: blur(6px);
}
.viewer figure {
  margin: 0;
}
.viewer img {
  display: block;
  width: 100%;
  max-height: calc(100dvh - 180px);
  object-fit: contain;
  background: #000;
}
.viewer figcaption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 20px 0;
}
.credit {
  font-size: 13px;
  color: var(--on-ink-2);
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 20px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--on-ink-2);
}
.controls button {
  width: 44px;
  height: 44px;
  border: 1px solid rgba(243, 237, 225, 0.2);
  border-radius: 50%;
  background: transparent;
  color: var(--on-ink);
  cursor: pointer;
  transition: background 0.2s;
}
.controls button:hover {
  background: rgba(243, 237, 225, 0.1);
}
.controls .close {
  margin-left: auto;
}
.viewer :focus-visible {
  outline-color: var(--accent);
}

@media (max-width: 560px) {
  .grid .wide {
    grid-column: auto;
  }
  .wide .thumb {
    aspect-ratio: 4 / 3;
  }
}
</style>
