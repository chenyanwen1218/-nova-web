<script setup lang="ts">
// 流体玻璃指标页：卡片网格 + 右侧设置抽屉。材质内核见 src/utils/fluidGlass.ts。
// 面板直接改响应式卡片对象，渲染器持有同一份原始对象，每帧读取，无需额外同步。
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import FluidGlassCard from '@/components/FluidGlassCard.vue'
import { fluidCards } from '@/data/fluidGlass'
import {
  PRESETS,
  clamp,
  loadSettings,
  materialTokens,
  persistSettings,
  setInteraction,
  setQuality,
  surfaceLabel,
  type PresetName,
  type Quality,
  type RenderMode,
} from '@/utils/fluidGlass'

const STORAGE_KEY = 'nova_fluid_glass'

const settings = reactive(loadSettings(STORAGE_KEY, fluidCards))
// 渲染器在子组件挂载时创建，先把质量档位和交互开关设好
const resolved = ref(setQuality(settings.quality))
setInteraction(settings.interaction)

const selectedKey = ref(settings.cards[0].key)
const open = ref(false)
const modes = reactive<Record<string, RenderMode>>({})
const toast = ref('')
const panel = ref<HTMLElement | null>(null)
const opener = ref<HTMLElement | null>(null)

const card = computed(() => settings.cards.find((c) => c.key === selectedKey.value) ?? settings.cards[0])
const tokens = computed(() => materialTokens(card.value.surface))
const webglCount = computed(() => Object.values(modes).filter((m) => m === 'webgl').length)
const diagnostic = computed(() =>
  resolved.value === 'fallback'
    ? 'CSS 降级渲染'
    : `${resolved.value} · ${webglCount.value}/${settings.cards.length} 张 WebGL`,
)

const presetList: { name: PresetName; label: string }[] = [
  { name: 'cyan', label: 'Cyan' },
  { name: 'original', label: 'Original' },
  { name: 'klein', label: 'Klein' },
  { name: 'chrome', label: 'Chrome' },
]
const qualityList: { value: Quality; label: string }[] = [
  { value: 'auto', label: '自动' },
  { value: 'high', label: '高' },
  { value: 'balanced', label: '均衡' },
  { value: 'eco', label: '节能' },
  { value: 'fallback', label: 'CSS 降级' },
]

let saveTimer = 0
let toastTimer = 0
function save(notify = false) {
  window.clearTimeout(saveTimer)
  if (notify) {
    showToast(persistSettings(STORAGE_KEY, settings) ? '设置已保存' : '保存失败：浏览器禁止了本地存储')
    return
  }
  saveTimer = window.setTimeout(() => persistSettings(STORAGE_KEY, settings), 200)
}
function showToast(msg: string) {
  toast.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 1850)
}

function select(key: string) {
  selectedKey.value = key
  if (!open.value) openPanel()
}

async function openPanel() {
  opener.value = document.activeElement as HTMLElement | null
  open.value = true
  await nextTick()
  panel.value?.focus()
}
function closePanel() {
  open.value = false
  opener.value?.focus()
}

function setColor(k: 'a' | 'b' | 'c', v: string) {
  card.value[k] = v
  card.value.preset = 'custom'
  save()
}
function setNum(k: 'speed' | 'intensity' | 'pointer', v: string) {
  card.value[k] = Number(v)
  save()
}
function setSurface(v: string) {
  card.value.surface = clamp(Number(v) / 100, 0, 1)
  save()
}
function applyPreset(name: PresetName) {
  Object.assign(card.value, PRESETS[name], { preset: name })
  save()
}
function onQuality(v: string) {
  settings.quality = v as Quality
  resolved.value = setQuality(settings.quality)
  save()
}
function onInteraction(v: boolean) {
  settings.interaction = v
  setInteraction(v)
  save()
}

// 恢复当前卡片的默认材质，文案保持不变
function resetCard() {
  const i = settings.cards.findIndex((c) => c.key === selectedKey.value)
  settings.cards[i] = { ...fluidCards[i] }
  save()
  showToast('已恢复当前卡片')
}

// 只同步配色与底材，每张卡自己的速度、强度、扰动和种子保持不变
function applyAll() {
  const { a, b, c, surface } = card.value
  settings.cards.forEach((x) => Object.assign(x, { a, b, c, surface, preset: 'custom' }))
  save()
  showToast('材质已应用到全部卡片')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) closePanel()
}
onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  window.clearTimeout(toastTimer)
  // 离开页面前把还没写入的改动落盘
  if (saveTimer) persistSettings(STORAGE_KEY, settings)
  window.clearTimeout(saveTimer)
})
</script>

<template>
  <div class="fg-page">
    <header class="fg-toolbar">
      <RouterLink to="/" class="fg-brand">
        <span class="fg-brand-dot" aria-hidden="true" />
        <span>Nova · 流体玻璃</span>
      </RouterLink>
      <button type="button" class="fg-icon-btn" aria-label="打开材质设置" @click="openPanel">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" /></svg>
      </button>
    </header>

    <div class="fg-main">
      <h1 class="fg-heading">阅读指标</h1>
      <p class="fg-lead">鼠标划过卡片可以推动流体，点击卡片调整它的材质。</p>
      <section class="fg-grid" aria-label="指标卡片">
        <FluidGlassCard
          v-for="(c, i) in settings.cards"
          :key="c.key"
          :card="c"
          :index="i"
          :selected="open && c.key === selectedKey"
          @select="select"
          @mode="(k, m) => (modes[k] = m)"
        />
      </section>
      <p class="fg-credit">
        材质内核来自
        <a href="https://github.com/csuyincs-creator/fluidglass-ui" target="_blank" rel="noopener noreferrer">fluidglass-ui</a>
        · Apache-2.0
      </p>
    </div>

    <Transition name="fade">
      <div v-if="open" class="fg-backdrop" @click="closePanel" />
    </Transition>

    <aside
      ref="panel"
      class="fg-panel"
      :class="{ open }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fg-panel-title"
      tabindex="-1"
      :inert="!open"
    >
      <div class="fg-panel-head">
        <div>
          <span class="fg-kicker">MATERIAL CORE</span>
          <h2 id="fg-panel-title">材质设置</h2>
        </div>
        <button type="button" class="fg-close" aria-label="关闭" @click="closePanel">×</button>
      </div>

      <div class="fg-panel-body">
        <label class="fg-field">
          <span>当前卡片</span>
          <select v-model="selectedKey">
            <option v-for="c in settings.cards" :key="c.key" :value="c.key">{{ c.label }}</option>
          </select>
        </label>

        <div
          class="fg-preview"
          :style="{
            '--pa': card.a,
            '--pb': card.b,
            '--pc': card.c,
            '--ps': tokens.surface,
            '--pshade': tokens.shade,
            '--pshade-mid': tokens.shadeMid,
            '--ptext': tokens.text,
            '--pmuted': tokens.muted,
          }"
          aria-hidden="true"
        >
          <small>LIVE MATERIAL</small>
          <b>{{ card.label }}</b>
          <span>{{ surfaceLabel(card.surface) }}</span>
        </div>

        <fieldset class="fg-set">
          <legend>配色预设</legend>
          <div class="fg-presets">
            <button
              v-for="p in presetList"
              :key="p.name"
              type="button"
              :class="{ active: card.preset === p.name }"
              :aria-pressed="card.preset === p.name"
              @click="applyPreset(p.name)"
            >
              <i :style="{ '--a': PRESETS[p.name].a, '--b': PRESETS[p.name].b, '--c': PRESETS[p.name].c }" />
              <span>{{ p.label }}</span>
            </button>
          </div>
        </fieldset>

        <fieldset class="fg-set">
          <legend>自定义颜色</legend>
          <div class="fg-colors">
            <label v-for="k in ['a', 'b', 'c'] as const" :key="k">
              <span>{{ k === 'c' ? '阴影 C' : `颜色 ${k.toUpperCase()}` }}</span>
              <input type="color" :value="card[k]" @input="setColor(k, ($event.target as HTMLInputElement).value)" />
              <code>{{ card[k].toUpperCase() }}</code>
            </label>
          </div>
        </fieldset>

        <fieldset class="fg-set">
          <legend>底材</legend>
          <label class="fg-range">
            <span>底色不透明度 <output>{{ surfaceLabel(card.surface) }}</output></span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              :value="Math.round(card.surface * 100)"
              @input="setSurface(($event.target as HTMLInputElement).value)"
            />
          </label>
        </fieldset>

        <fieldset class="fg-set">
          <legend>动效</legend>
          <label class="fg-range">
            <span>流动速度 <output>{{ card.speed.toFixed(2) }}×</output></span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              :value="card.speed"
              @input="setNum('speed', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="fg-range">
            <span>流体强度 <output>{{ Math.round(card.intensity * 100) }}%</output></span>
            <input
              type="range"
              min="0.35"
              max="1.6"
              step="0.05"
              :value="card.intensity"
              @input="setNum('intensity', ($event.target as HTMLInputElement).value)"
            />
          </label>
          <label class="fg-range">
            <span>鼠标扰动 <output>{{ Math.round(card.pointer * 100) }}%</output></span>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              :value="card.pointer"
              @input="setNum('pointer', ($event.target as HTMLInputElement).value)"
            />
          </label>
        </fieldset>

        <fieldset class="fg-set">
          <legend>性能</legend>
          <label class="fg-field">
            <span>渲染质量</span>
            <select :value="settings.quality" @change="onQuality(($event.target as HTMLSelectElement).value)">
              <option v-for="q in qualityList" :key="q.value" :value="q.value">{{ q.label }}</option>
            </select>
          </label>
          <label class="fg-switch">
            <span><b>鼠标交互</b><small>划过卡片时推动流体</small></span>
            <input
              type="checkbox"
              :checked="settings.interaction"
              @change="onInteraction(($event.target as HTMLInputElement).checked)"
            />
            <i aria-hidden="true" />
          </label>
          <p class="fg-diag" :class="webglCount === settings.cards.length ? 'ok' : 'warn'" role="status">
            <i aria-hidden="true" />{{ diagnostic }}
          </p>
        </fieldset>
      </div>

      <div class="fg-actions">
        <button type="button" @click="resetCard">恢复当前卡片</button>
        <button type="button" @click="applyAll">应用到全部</button>
        <button
          type="button"
          class="primary"
          @click="
            save(true);
            closePanel()
          "
        >
          保存设置
        </button>
      </div>
    </aside>

    <p class="fg-toast" :class="{ show: toast }" role="status" aria-live="polite">{{ toast }}</p>
  </div>
</template>

<style scoped>
.fg-page {
  --fg-mono: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
  position: relative;
  min-height: 100dvh;
  padding: 28px;
  color: #eefcf8;
  color-scheme: dark;
  background:
    radial-gradient(circle at 55% 28%, rgba(0, 231, 210, 0.055), transparent 34%),
    radial-gradient(circle at 15% 0%, rgba(255, 255, 255, 0.032), transparent 22%),
    #050706;
}
/* 页面点阵 */
.fg-page::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.1;
  background-image: radial-gradient(rgba(255, 255, 255, 0.22) 0.55px, transparent 0.62px);
  background-size: 22px 22px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), transparent 85%);
}

.fg-toolbar,
.fg-main {
  position: relative;
  max-width: 1160px;
  margin: 0 auto;
}
.fg-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  margin-bottom: 36px;
}
.fg-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #dff7f1;
  font-weight: 600;
  letter-spacing: -0.015em;
}
.fg-brand-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #00e7d2;
  box-shadow: 0 0 12px rgba(0, 231, 210, 0.78);
}
.fg-icon-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(77, 235, 207, 0.22);
  border-radius: 50%;
  background: rgba(0, 231, 210, 0.055);
  color: #9ad9ca;
  cursor: pointer;
}
.fg-icon-btn:hover {
  color: #dffff7;
  border-color: rgba(77, 235, 207, 0.42);
  background: rgba(0, 231, 210, 0.11);
}
.fg-icon-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.65;
  stroke-linecap: round;
}

.fg-heading {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 700;
  letter-spacing: -0.03em;
}
.fg-lead {
  margin: 8px 0 28px;
  color: #8fa9a2;
  font-size: 15px;
}
.fg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.fg-credit {
  margin: 40px 0 0;
  color: #5f7a73;
  font: 12px/1.5 var(--fg-mono);
}
.fg-credit a {
  color: #82a69d;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 设置抽屉 */
.fg-backdrop {
  position: fixed;
  z-index: 90;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(4px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.24s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fg-panel {
  position: fixed;
  z-index: 100;
  top: 18px;
  right: 18px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  width: min(360px, calc(100vw - 36px));
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 24px;
  color: #e9efec;
  background: linear-gradient(155deg, rgba(28, 34, 32, 0.97), rgba(8, 12, 11, 0.98));
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.68),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: translateX(calc(100% + 34px));
  opacity: 0;
  visibility: hidden;
  transition:
    transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.24s ease,
    visibility 0s 0.34s;
}
.fg-panel.open {
  transform: none;
  opacity: 1;
  visibility: visible;
  transition:
    transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.24s ease;
}
.fg-panel:focus {
  outline: none;
}
.fg-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 22px 22px 17px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.fg-kicker {
  display: block;
  margin-bottom: 5px;
  color: #65dbab;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
}
.fg-panel h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.fg-close {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: #b8c1bc;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}
.fg-panel-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px 20px 24px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}

.fg-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #9ba7a1;
  font-size: 13px;
}
.fg-field select {
  min-width: 150px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 11px;
  background: #111614;
  color: #e8eeeb;
}

.fg-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 94px;
  margin: 16px 0 19px;
  padding: 17px 20px;
  overflow: hidden;
  border: 1px solid rgba(111, 255, 228, 0.22);
  border-radius: 24px;
  color: var(--ptext);
  background:
    radial-gradient(ellipse at 88% 15%, color-mix(in srgb, var(--pa), transparent 14%), transparent 48%),
    radial-gradient(ellipse at 68% 92%, color-mix(in srgb, var(--pb), transparent 18%), transparent 54%),
    radial-gradient(ellipse at 96% 58%, color-mix(in srgb, var(--pc), transparent 8%), transparent 50%),
    rgba(255, 255, 255, var(--ps));
}
.fg-preview::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(2, 10, 8, var(--pshade)) 0 30%,
    rgba(2, 11, 9, var(--pshade-mid)) 43%,
    transparent 72%
  );
}
.fg-preview > * {
  position: relative;
  z-index: 1;
}
.fg-preview small {
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--pmuted);
}
.fg-preview b {
  margin-top: 4px;
  font-size: 17px;
}
.fg-preview span {
  margin-top: 3px;
  font-size: 11px;
  color: var(--pmuted);
}

.fg-set {
  margin: 0 0 18px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.025);
}
.fg-set legend {
  padding: 0 7px;
  color: #aab4af;
  font-size: 12px;
  font-weight: 600;
}
.fg-presets {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.fg-presets button {
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  color: #9aa49f;
  font-size: 11px;
  cursor: pointer;
}
.fg-presets button:hover,
.fg-presets button.active {
  border-color: rgba(0, 230, 118, 0.34);
  background: rgba(0, 230, 118, 0.07);
  color: #e9fff4;
}
.fg-presets i {
  display: block;
  height: 38px;
  margin-bottom: 5px;
  border: 1px solid rgba(115, 255, 229, 0.16);
  border-radius: 12px;
  background:
    radial-gradient(circle at 78% 18%, var(--a), transparent 50%),
    radial-gradient(circle at 64% 90%, var(--b), transparent 55%),
    radial-gradient(circle at 100% 60%, var(--c), transparent 58%),
    rgba(3, 12, 10, 0.72);
}
.fg-colors {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}
.fg-colors label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #9aa49f;
  font-size: 11px;
}
.fg-colors input {
  width: 100%;
  height: 40px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 10px;
  background: #101513;
  cursor: pointer;
}
.fg-colors code {
  font: 10px var(--fg-mono);
  color: #aeb8b3;
}
.fg-range {
  display: block;
  margin-bottom: 14px;
}
.fg-range:last-child {
  margin-bottom: 0;
}
.fg-range > span {
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
  color: #a9b2ae;
  font-size: 12px;
}
.fg-range output {
  color: #e5ebe8;
  font-variant-numeric: tabular-nums;
}
.fg-range input {
  width: 100%;
  accent-color: #00c873;
}

.fg-switch {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.065);
  cursor: pointer;
}
.fg-switch span {
  display: flex;
  flex-direction: column;
}
.fg-switch b {
  font-size: 13px;
  color: #d8dfdc;
}
.fg-switch small {
  margin-top: 3px;
  font-size: 11px;
  color: #849089;
}
.fg-switch input {
  position: absolute;
  opacity: 0;
}
.fg-switch i {
  position: relative;
  width: 40px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  background: #252b28;
  transition: 0.2s;
}
.fg-switch i::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #8e9893;
  transition: 0.2s;
}
.fg-switch input:checked + i {
  border-color: rgba(0, 230, 118, 0.42);
  background: rgba(0, 201, 113, 0.25);
}
.fg-switch input:checked + i::after {
  left: 21px;
  background: #18e996;
}
.fg-switch input:focus-visible + i {
  outline: 2px solid #5bf6da;
  outline-offset: 2px;
}

.fg-diag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 13px 0 0;
  padding: 10px 11px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
  color: #9aa49f;
  font-size: 11px;
}
.fg-diag i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f0b24f;
}
.fg-diag.ok i {
  background: #13df8c;
  box-shadow: 0 0 9px rgba(19, 223, 140, 0.65);
}

.fg-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 14px 18px 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(3, 6, 5, 0.42);
}
.fg-actions button {
  min-height: 44px;
  padding: 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.045);
  color: #c0c8c4;
  font-size: 12px;
  cursor: pointer;
}
.fg-actions button.primary {
  border-color: rgba(0, 230, 118, 0.35);
  background: linear-gradient(180deg, rgba(0, 215, 117, 0.28), rgba(0, 130, 69, 0.22));
  color: #eafff3;
}

.fg-toast {
  position: fixed;
  z-index: 110;
  right: 24px;
  bottom: 24px;
  margin: 0;
  padding: 10px 14px;
  border: 1px solid rgba(0, 230, 118, 0.3);
  border-radius: 12px;
  background: rgba(8, 16, 13, 0.94);
  color: #dffff0;
  font-size: 13px;
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: 0.2s;
}
.fg-toast.show {
  opacity: 1;
  transform: none;
}

@media (max-width: 1040px) {
  .fg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
/* 移动端单列，卡片保持 144px 高的横向宽卡 */
@media (max-width: 620px) {
  .fg-page {
    padding: 18px;
  }
  .fg-grid {
    grid-template-columns: 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fg-panel,
  .fg-panel.open,
  .fg-toast {
    transition: none;
  }
}
</style>
