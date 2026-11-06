<script setup lang="ts">
// 阅读驾驶舱：深色知识库仪表盘。左侧导航、顶部统计卡、阅读队列、3D 笔记环、时间轴和右侧详情面板。
// 数据来自 src/data/reading.ts 的演示数据；视图状态（选中卡片、巡航、速度）可保存到 localStorage。
import { computed, onMounted, reactive, ref } from 'vue'
import NoteRing from '@/components/NoteRing.vue'
import { queue, ringNotes, stats, timelineBars, timelineDays, today } from '@/data/reading'
import type { NoteStatus } from '@/data/reading'

const STORE_KEY = 'nova-reading-cockpit'

const nav = ['阅读驾驶舱', '未读文件索引', '今日阅读队列', '在读管理', '吸收与沉淀', '智能分析', '扫描记录', '知识图谱', '设置中心']
const navIcons = ['◉', '▦', '▣', '◫', '♧', '○', '▤', '•', '⚙']
const currentNav = ref(0)

const tabs = ['全部笔记', '我负责的', '我参与的']
const currentTab = ref(0)
const openGroups = reactive<Record<string, boolean>>({ 今日新增: true, 长期积压: true, 待沉淀: false })

const notes = ref(ringNotes.map((n) => ({ ...n })))
const active = ref(0)
const cruise = ref(true)
const speed = ref(1)
const orbit = ref(true)
const editing = ref(false)
const toast = ref('')
const ringRef = ref<InstanceType<typeof NoteRing> | null>(null)

const current = computed(() => notes.value[active.value])
const readRate = computed(() => {
  const all = notes.value.reduce((s, n) => s + n.count, 0)
  const done = notes.value.filter((n) => n.status === '待沉淀' || n.status === '已沉淀').reduce((s, n) => s + n.count, 0)
  return Math.round((done / all) * 100)
})

const statusClass: Record<NoteStatus, string> = { 未读: 's-unread', 在读: 's-reading', 待沉淀: 's-pending', 已沉淀: 's-done' }

function flash(msg: string) {
  toast.value = msg
  window.setTimeout(() => {
    if (toast.value === msg) toast.value = ''
  }, 1800)
}

function cycleSpeed() {
  speed.value = speed.value >= 3 ? 0.5 : speed.value * 2
}

function markRead() {
  const n = current.value
  if (n.status === '已沉淀') return
  n.status = '已沉淀'
  flash(`「${n.title}」已标为已读`)
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ active: active.value, cruise: cruise.value, speed: speed.value }))
  flash('页面设置已保存')
}

function exportHtml() {
  const html = '<!doctype html>\n' + document.documentElement.outerHTML
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'reading-cockpit.html'
  a.click()
  URL.revokeObjectURL(url)
}

function fullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen?.()
}

onMounted(() => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
    if (s && typeof s === 'object') {
      if (Number.isInteger(s.active) && s.active >= 0 && s.active < notes.value.length) active.value = s.active
      if (typeof s.cruise === 'boolean') cruise.value = s.cruise
      if ([0.5, 1, 2].includes(s.speed)) speed.value = s.speed
    }
  } catch {
    localStorage.removeItem(STORE_KEY)
  }
})
</script>

<template>
  <div class="cockpit">
    <!-- 左侧导航 -->
    <aside class="side panel">
      <RouterLink to="/" class="brand"><b>NOVA</b> Knowledge OS</RouterLink>
      <nav aria-label="驾驶舱导航">
        <button
          v-for="(item, i) in nav"
          :key="item"
          type="button"
          class="nav-item"
          :class="{ on: i === currentNav }"
          :aria-current="i === currentNav ? 'page' : undefined"
          @click="currentNav = i"
        >
          <span class="nav-ico" aria-hidden="true">{{ navIcons[i] }}</span>{{ item }}
        </button>
      </nav>
      <div class="side-foot">
        <p class="side-label">我的知识库</p>
        <div class="kb">◆ D:\NOVA knowledge</div>
        <div class="me">
          <span class="avatar">DY</span>
          <span><b>大Y</b><small>知识库管理员</small></span>
        </div>
      </div>
    </aside>

    <!-- 中间主区 -->
    <main class="main">
      <header class="top">
        <div>
          <h1>阅读管理</h1>
          <p>未读识别 · 阅读推进 · 知识沉淀</p>
        </div>
        <label class="search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="搜索笔记、目录或标签…" />
          <kbd>⌘K</kbd>
        </label>
        <div class="top-actions">
          <button type="button" class="round" aria-label="字体">Aa</button>
          <button type="button" class="round" aria-label="消息">✉</button>
          <button type="button" class="chip-btn green" @click="flash('扫描完成，新增 0 篇')">＋ 立即扫描</button>
        </div>
      </header>

      <!-- 统计卡：背后是缓慢流动的色块，模拟流体玻璃 -->
      <section class="stats" aria-label="阅读统计">
        <article
          v-for="s in stats"
          :key="s.key"
          class="stat"
          :class="{ light: s.light }"
          :style="{ '--a': s.tint[0], '--b': s.tint[1], '--c': s.tint[2] }"
        >
          <span class="blob" aria-hidden="true" />
          <small>{{ s.tag }}</small>
          <h2>{{ s.title }}</h2>
          <p class="num">
            <b>{{ s.value }}</b> {{ s.unit }}
          </p>
          <p class="delta">
            较昨日 <span :class="s.up ? 'up' : 'down'">{{ s.up ? '↑' : '↓' }} {{ s.delta }}</span>
          </p>
        </article>
      </section>

      <div class="work">
        <!-- 阅读队列 -->
        <section class="queue" aria-labelledby="queue-title">
          <div class="row-head">
            <h2 id="queue-title">阅读队列</h2>
            <small>演示数据</small>
          </div>
          <div class="tabs" role="tablist">
            <button
              v-for="(t, i) in tabs"
              :key="t"
              type="button"
              role="tab"
              :aria-selected="i === currentTab"
              :class="{ on: i === currentTab }"
              @click="currentTab = i"
            >
              {{ t }}
            </button>
          </div>
          <div v-for="g in queue" :key="g.name" class="group panel">
            <button
              type="button"
              class="group-head"
              :aria-expanded="openGroups[g.name]"
              @click="openGroups[g.name] = !openGroups[g.name]"
            >
              <i :style="{ background: g.dot }" />{{ g.name }} <b>{{ g.items.length }}</b>
              <span class="caret" :class="{ open: openGroups[g.name] }" aria-hidden="true">⌄</span>
            </button>
            <ul v-show="openGroups[g.name]">
              <li v-for="it in g.items" :key="it.title">
                <span class="q-title">{{ it.title }}</span>
                <span class="tag" :class="statusClass[it.status]">{{ it.status }}</span>
                <small>{{ it.time }}</small>
              </li>
            </ul>
          </div>
        </section>

        <!-- 3D 环 + 时间轴 -->
        <section class="stage panel" aria-label="笔记目录 3D 环">
          <div class="toolbar">
            <button type="button" class="chip-btn" :class="{ green: orbit }" :aria-pressed="orbit" @click="orbit = !orbit">
              ◉ 3D 环绕
            </button>
            <button type="button" class="chip-btn" :class="{ green: cruise }" :aria-pressed="cruise" @click="cruise = !cruise">
              ↻ 自动巡航
            </button>
            <button type="button" class="chip-btn" @click="ringRef?.reset()">＋ 复位视角</button>
            <span class="grow" />
            <button type="button" class="chip-btn green" @click="cycleSpeed">速度 {{ speed }}×</button>
            <button type="button" class="chip-btn">~ 筛选</button>
          </div>
          <span class="live"><i />实时交互</span>

          <div class="ring-wrap" :class="{ flat: !orbit }">
            <div class="rate panel">
              <small>阅读完成率</small>
              <b>{{ readRate }}%</b>
              <small>本月进度</small>
              <span class="bar"><i :style="{ width: `${readRate}%` }" /></span>
            </div>
            <NoteRing ref="ringRef" v-model:active="active" :notes="notes" :cruise="cruise" :speed="speed" />
          </div>

          <p class="hint">按住拖动卡片环 · 滚轮缩放 · 点击卡片聚焦 <b>{{ current.title }}</b></p>

          <div class="timeline">
            <div class="row-head">
              <h2>阅读时间轴</h2>
              <small>▣ 2026 年 7 月</small>
              <span class="grow" />
              <button type="button" class="chip-btn">月 ⌄</button>
              <button type="button" class="chip-btn">今天</button>
            </div>
            <div class="days" :style="{ '--n': timelineDays.length }">
              <span v-for="d in timelineDays" :key="d" :class="{ today: d === today }">{{ d }}</span>
              <span
                v-for="b in timelineBars"
                :key="b.label"
                class="tl-bar"
                :style="{ gridColumn: `${b.from + 1} / ${b.to + 2}`, background: b.color }"
              >
                {{ b.label }}
              </span>
            </div>
          </div>
        </section>
      </div>

      <!-- 底部悬浮操作条 -->
      <div class="dock panel" role="toolbar" aria-label="页面操作">
        <button type="button" class="chip-btn" :class="{ green: editing }" :aria-pressed="editing" @click="editing = !editing">
          编辑模式
        </button>
        <button type="button" class="chip-btn green" @click="save">保存页面</button>
        <button type="button" class="chip-btn" @click="exportHtml">导出 HTML</button>
        <button type="button" class="chip-btn" @click="fullscreen">全屏</button>
      </div>
    </main>

    <!-- 右侧详情 -->
    <aside class="detail panel" aria-labelledby="detail-title">
      <div class="row-head">
        <h2>✦ 智能详情</h2>
      </div>
      <small class="mono">NOTE-00{{ active + 12 }}-{{ current.count }}</small>
      <h3 id="detail-title" :contenteditable="editing" :class="{ editable: editing }">
        {{ current.title }}
        <span class="prio" :class="`p-${current.priority}`">{{ current.priority }}优先级</span>
      </h3>
      <p class="summary" :contenteditable="editing" :class="{ editable: editing }">{{ current.summary }}</p>
      <dl>
        <dt>负责人</dt>
        <dd><span class="avatar sm">DY</span>{{ current.owner }}</dd>
        <dt>所属目录</dt>
        <dd>☑ {{ current.folder }}</dd>
        <dt>首次发现</dt>
        <dd>▣ {{ current.found }}</dd>
        <dt>当前状态</dt>
        <dd><span class="tag" :class="statusClass[current.status]">{{ current.status }}</span></dd>
        <dt>优先级</dt>
        <dd><i class="dot" :class="`p-${current.priority}`" />{{ current.priority }}</dd>
        <dt>标签</dt>
        <dd class="tags">
          <span v-for="t in current.tags" :key="t" class="tag">{{ t }}</span>
        </dd>
      </dl>
      <div class="ai panel">
        <h4>AI 助手建议</h4>
        <ul>
          <li v-for="t in current.tips" :key="t">{{ t }}</li>
        </ul>
        <button type="button" class="chip-btn">查看建议详情</button>
      </div>
      <div class="detail-actions">
        <button type="button" class="chip-btn" @click="editing = !editing">✎ {{ editing ? '完成编辑' : '编辑笔记' }}</button>
        <button type="button" class="chip-btn green" :disabled="current.status === '已沉淀'" @click="markRead">
          ✓ {{ current.status === '已沉淀' ? '已读' : '标为已读' }}
        </button>
      </div>
    </aside>

    <p class="toast" role="status" aria-live="polite">
      <span v-if="toast">{{ toast }}</span>
    </p>
  </div>
</template>

<style scoped>
.cockpit {
  --bg0: #050706;
  --p: rgba(255, 255, 255, 0.035);
  --line: rgba(255, 255, 255, 0.08);
  --t1: #eef2ef;
  --t2: #9aa39e;
  --t3: #6b736f;
  --g: #3ddc84;
  --g-deep: #0f3a24;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 300px;
  gap: 16px;
  min-height: 100dvh;
  padding: 16px;
  background: radial-gradient(1200px 600px at 50% 40%, #0c1410, var(--bg0));
  color: var(--t1);
  font-size: 13px;
  line-height: 1.5;
}
.cockpit :focus-visible {
  outline: 2px solid var(--g);
  outline-offset: 2px;
}
.panel {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--p);
  backdrop-filter: blur(14px);
}
h1,
h2,
h3,
h4,
p {
  margin: 0;
}
small {
  color: var(--t3);
  font-size: 11px;
}
.mono {
  font-family: ui-monospace, Consolas, monospace;
}
.grow {
  flex: 1;
}
button {
  cursor: pointer;
}

/* 通用小按钮 */
.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--t1);
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.chip-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.chip-btn.green {
  border-color: rgba(61, 220, 132, 0.35);
  background: var(--g-deep);
  color: #b9f5d2;
}
.chip-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.round {
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  color: var(--t1);
}

/* 左侧 */
.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 12px;
  position: sticky;
  top: 16px;
  height: calc(100dvh - 32px);
}
.brand {
  padding: 0 8px 8px;
  font-size: 13px;
  color: var(--t2);
}
.brand b {
  color: var(--t1);
  font-size: 16px;
  margin-right: 4px;
}
.side nav {
  display: grid;
  gap: 4px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: none;
  color: var(--t2);
  text-align: left;
  font-size: 13px;
}
.nav-item:hover {
  color: var(--t1);
}
.nav-item.on {
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.07);
  color: var(--t1);
}
.nav-item.on .nav-ico {
  color: var(--g);
}
.nav-ico {
  width: 16px;
  text-align: center;
}
.side-foot {
  margin-top: auto;
  display: grid;
  gap: 10px;
}
.side-label {
  padding: 0 8px;
  color: var(--t3);
  font-size: 11px;
}
.kb {
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
}
.me b {
  display: block;
}
.avatar {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2a2f2c;
  font-size: 11px;
  font-weight: 700;
}
.avatar.sm {
  width: 22px;
  height: 22px;
  margin-right: 6px;
  font-size: 9px;
}

/* 主区 */
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding-bottom: 72px;
}
.top {
  display: flex;
  align-items: center;
  gap: 20px;
}
.top h1 {
  font-size: 22px;
  font-weight: 800;
}
.top p {
  color: var(--t2);
  font-size: 12px;
}
.search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 300px;
  margin: 0 auto;
  padding: 0 12px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--t3);
}
.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: none;
  color: var(--t1);
  font: inherit;
  outline: none;
}
kbd {
  font: 10px ui-monospace, monospace;
}
.top-actions {
  display: flex;
  gap: 8px;
}

/* 统计卡 */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.stat {
  position: relative;
  overflow: hidden;
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  background: #0b0d0c;
  isolation: isolate;
}
.stat .blob {
  position: absolute;
  inset: -40%;
  z-index: -1;
  background:
    radial-gradient(35% 45% at 70% 40%, var(--a), transparent 70%),
    radial-gradient(30% 40% at 85% 75%, var(--b), transparent 70%),
    radial-gradient(40% 40% at 55% 85%, var(--c), transparent 70%);
  filter: blur(18px);
  animation: drift 14s ease-in-out infinite alternate;
}
/* 左侧压暗，保证文字可读 */
.stat::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, rgba(5, 7, 6, 0.85) 20%, rgba(5, 7, 6, 0.2) 70%, transparent);
}
.stat.light {
  color: #111;
  background: #dfe5e7;
}
.stat.light::after {
  background: linear-gradient(90deg, rgba(240, 244, 245, 0.85) 25%, rgba(240, 244, 245, 0.1) 75%);
}
.stat.light small,
.stat.light .delta {
  color: #4b5458;
}
.stat h2 {
  margin-top: 4px;
  font-size: 15px;
}
.num {
  margin-top: 4px;
  font-size: 11px;
}
.num b {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
  margin-right: 4px;
}
.delta {
  margin-top: 6px;
  font-size: 11px;
  color: var(--t2);
}
.up {
  color: var(--g);
}
.stat.light .up {
  color: #138a4c;
}
.down {
  color: #ff6b6b;
}
@keyframes drift {
  to {
    transform: translate(-8%, 6%) rotate(12deg) scale(1.1);
  }
}

/* 队列 + 舞台 */
.work {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.row-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.row-head h2 {
  font-size: 14px;
}
.queue {
  display: grid;
  gap: 10px;
}
.queue > .row-head {
  justify-content: space-between;
}
.tabs {
  display: flex;
  gap: 4px;
}
.tabs button {
  min-height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--t3);
  font-size: 12px;
}
.tabs button.on {
  background: rgba(255, 255, 255, 0.07);
  color: var(--t1);
}
.group {
  padding: 4px 0;
}
.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 38px;
  padding: 0 12px;
  border: 0;
  background: none;
  color: var(--t1);
  font-size: 12px;
  text-align: left;
}
.group-head i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.caret {
  margin-left: auto;
  color: var(--t3);
  transition: transform 0.25s;
  transform: rotate(-90deg);
}
.caret.open {
  transform: none;
}
.group ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.group li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-top: 1px solid var(--line);
  font-size: 12px;
}
.q-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #d4dad6;
}
.tag {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 11px;
  color: var(--t2);
}
.s-unread {
  background: rgba(61, 220, 132, 0.14);
  color: #7ff0b0;
}
.s-reading {
  background: rgba(255, 159, 67, 0.15);
  color: #ffbf80;
}
.s-pending {
  background: rgba(177, 140, 255, 0.15);
  color: #cdb6ff;
}
.s-done {
  background: rgba(108, 140, 255, 0.15);
  color: #a9bcff;
}

.stage {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px;
  min-height: 560px;
  overflow: hidden;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.live {
  position: absolute;
  top: 56px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--g-deep);
  color: #b9f5d2;
  font-size: 11px;
}
.live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--g);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}
.ring-wrap {
  position: relative;
  flex: 1;
  display: grid;
  min-height: 340px;
}
/* 关闭 3D 环绕时压平成正视 */
.ring-wrap.flat :deep(.ring-stage) {
  perspective: none;
}
.rate {
  position: absolute;
  top: 40px;
  left: 4%;
  z-index: 2;
  display: grid;
  gap: 2px;
  width: 150px;
  padding: 14px;
  background: rgba(30, 34, 32, 0.75);
  transform: perspective(600px) rotateY(12deg);
  box-shadow: 0 20px 40px -20px #000;
}
.rate b {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
}
.bar {
  height: 3px;
  margin-top: 8px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
}
.bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--g);
}
.hint {
  align-self: center;
  margin: 4px 0 12px;
  padding: 6px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--t2);
  font-size: 11px;
  text-align: center;
}
.hint b {
  color: var(--t1);
}
.timeline {
  padding-top: 12px;
  border-top: 1px solid var(--line);
}
.days {
  display: grid;
  grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  gap: 6px 0;
  margin-top: 12px;
  font: 10px ui-monospace, monospace;
  color: var(--t3);
  text-align: center;
}
.days .today {
  border-radius: 999px;
  background: var(--g);
  color: #03170b;
  font-weight: 700;
}
.tl-bar {
  overflow: hidden;
  padding: 2px 6px;
  border-radius: 999px;
  color: #dfe;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dock {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 20;
  display: flex;
  gap: 6px;
  padding: 6px;
  transform: translateX(-50%);
  background: rgba(16, 19, 17, 0.85);
  box-shadow: 0 20px 40px -10px #000;
}

/* 右侧详情 */
.detail {
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100dvh - 32px);
  padding: 20px;
  overflow-y: auto;
}
.detail h3 {
  font-size: 19px;
  font-weight: 800;
}
.prio {
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  vertical-align: middle;
}
.p-高 {
  background: rgba(61, 220, 132, 0.14);
  color: #7ff0b0;
}
.p-中 {
  background: rgba(255, 159, 67, 0.15);
  color: #ffbf80;
}
.p-低 {
  background: rgba(255, 255, 255, 0.07);
  color: var(--t2);
}
.summary {
  color: #c8cfcb;
}
.editable {
  outline: 1px dashed rgba(61, 220, 132, 0.6);
  outline-offset: 4px;
  border-radius: 4px;
}
dl {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px 8px;
  margin: 4px 0;
}
dt {
  color: var(--t3);
}
dd {
  display: flex;
  align-items: center;
  margin: 0;
}
.tags {
  flex-wrap: wrap;
  gap: 4px;
}
.dot {
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
}
.dot.p-高 {
  background: #ff5b5b;
}
.dot.p-中 {
  background: #ff9f43;
}
.dot.p-低 {
  background: var(--t3);
}
.ai {
  display: grid;
  gap: 8px;
  padding: 14px;
}
.ai h4 {
  font-size: 13px;
}
.ai ul {
  margin: 0;
  padding-left: 16px;
  color: #c8cfcb;
}
.ai .chip-btn {
  justify-self: start;
}
.detail-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: auto;
}
.detail-actions .chip-btn {
  justify-content: center;
  min-height: 40px;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 30;
  transform: translateX(-50%);
  pointer-events: none;
}
.toast span {
  display: block;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--g-deep);
  color: #b9f5d2;
  font-size: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .stat .blob,
  .live i {
    animation: none;
  }
}

/* 中屏：右侧详情挪到下方 */
@media (max-width: 1280px) {
  .cockpit {
    grid-template-columns: 200px minmax(0, 1fr);
  }
  .detail {
    grid-column: 2;
    position: static;
    height: auto;
  }
}
/* 小屏：单列，侧栏变横向滚动导航 */
@media (max-width: 900px) {
  .cockpit {
    grid-template-columns: minmax(0, 1fr);
    padding: 12px;
  }
  .side {
    position: static;
    height: auto;
    padding: 12px;
  }
  .side nav {
    display: flex;
    overflow-x: auto;
  }
  .nav-item {
    flex: none;
  }
  .side-foot {
    display: none;
  }
  .detail {
    grid-column: 1;
  }
  .top {
    flex-wrap: wrap;
  }
  .search {
    order: 3;
    max-width: none;
    flex-basis: 100%;
  }
  .top-actions {
    margin-left: auto;
  }
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .work {
    grid-template-columns: minmax(0, 1fr);
  }
  .rate {
    top: 8px;
    width: 120px;
    padding: 10px;
  }
  .rate b {
    font-size: 22px;
  }
  .dock {
    bottom: 12px;
    max-width: calc(100vw - 24px);
    overflow-x: auto;
  }
}
</style>
