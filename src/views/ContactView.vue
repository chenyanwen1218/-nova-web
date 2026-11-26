<script setup lang="ts">
// 联系：网站没有后端，表单只把需求整理成一段文字，复制后发微信，或者打开邮件程序发出去。
// 填的内容不会上传到任何地方
import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { profile, services } from '@/data/profile'

const route = useRoute()
const topics = [...services.map((s) => s.name), '其他']
// 从服务页「咨询某项服务」过来时预选那一项
const preset = services.find((s) => s.slug === route.query.service)?.name

const form = reactive({ name: '', contact: '', topic: preset ?? topics[0], budget: '', deadline: '', message: '' })
const status = ref('')
const manual = ref('')
const manualEl = ref<HTMLTextAreaElement | null>(null)

// 有微信时主按钮是「复制发微信」，只有邮箱时主按钮是「用邮件发送」
const primary = profile.wechat || !profile.email ? 'copy' : 'mail'
const copyLabel = profile.wechat ? '复制内容，发到微信' : '复制内容'
const how = profile.wechat && profile.email
  ? '复制后发到微信，或者直接用邮件发给我'
  : profile.wechat
    ? '复制后发到微信'
    : profile.email
      ? '用邮件发给我，或者复制后自己发'
      : '复制后发给我'

const text = computed(() => {
  const lines = [`称呼：${form.name}`, `联系方式：${form.contact}`, `想做：${form.topic}`]
  if (form.budget) lines.push(`预算：${form.budget}`)
  if (form.deadline) lines.push(`希望上线：${form.deadline}`)
  return [...lines, '', form.message].join('\n')
})

async function copyText(value: string, done: string) {
  manual.value = ''
  try {
    // 非 https 页面没有 navigator.clipboard，会落到下面让用户手动复制
    await navigator.clipboard.writeText(value)
    status.value = done
  } catch {
    manual.value = value
    status.value = '浏览器不让自动复制，请手动复制下面的内容。'
    await nextTick()
    manualEl.value?.select()
  }
}

function mail() {
  const subject = `项目咨询：${form.topic}（${form.name}）`
  location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text.value)}`
  status.value = `正在打开邮件程序。没有反应的话，复制内容发到 ${profile.email}。`
}

// 浏览器原生校验（required）通过后才会触发 submit；回车提交时 submitter 是第一个按钮
function onSubmit(e: SubmitEvent) {
  const action = (e.submitter as HTMLElement | null)?.dataset.action ?? primary
  if (action === 'mail') mail()
  else copyText(text.value, profile.wechat ? `已复制。加微信 ${profile.wechat}，把内容粘贴发给我。` : '已复制。')
}
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1>说说你的项目</h1>
      <p class="lead">把下面几项填好，{{ how }}。这个页面不会把你填的内容上传到任何地方。</p>
    </header>

    <div class="layout">
      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <label for="c-name">称呼</label>
          <input id="c-name" v-model.trim="form.name" type="text" autocomplete="name" required />
        </div>
        <div class="field">
          <label for="c-contact">怎么联系你</label>
          <input id="c-contact" v-model.trim="form.contact" type="text" placeholder="微信号、手机或邮箱" required />
        </div>
        <div class="field">
          <label for="c-topic">想做什么</label>
          <select id="c-topic" v-model="form.topic">
            <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="pair">
          <div class="field">
            <label for="c-budget">预算（可选）</label>
            <input id="c-budget" v-model.trim="form.budget" type="text" placeholder="大概的范围，没想好可以不填" />
          </div>
          <div class="field">
            <label for="c-deadline">希望什么时候上线（可选）</label>
            <input id="c-deadline" v-model.trim="form.deadline" type="text" placeholder="比如：下个月底" />
          </div>
        </div>
        <div class="field">
          <label for="c-msg">具体说说</label>
          <textarea
            id="c-msg"
            v-model.trim="form.message"
            rows="5"
            maxlength="1000"
            placeholder="要做几个页面、给谁看、有没有参考网站或设计稿"
            required
          />
        </div>

        <div class="actions">
          <template v-if="primary === 'copy'">
            <button class="btn btn-primary" type="submit" data-action="copy">{{ copyLabel }}</button>
            <button v-if="profile.email" class="btn btn-ghost" type="submit" data-action="mail">用邮件发送</button>
          </template>
          <template v-else>
            <button class="btn btn-primary" type="submit" data-action="mail">用邮件发送</button>
            <button class="btn btn-ghost" type="submit" data-action="copy">复制内容</button>
          </template>
        </div>
        <p class="status" role="status" aria-live="polite">{{ status }}</p>
        <div v-if="manual" class="field">
          <label for="c-manual">要复制的内容</label>
          <textarea id="c-manual" ref="manualEl" :value="manual" rows="8" readonly />
        </div>
      </form>

      <aside class="side" aria-labelledby="side-title">
        <h2 id="side-title">直接联系</h2>
        <dl>
          <template v-if="profile.wechat">
            <dt>微信</dt>
            <dd>
              <span>{{ profile.wechat }}</span>
              <button type="button" class="copy" @click="copyText(profile.wechat, '微信号已复制。')">复制微信号</button>
            </dd>
          </template>
          <template v-if="profile.email">
            <dt>邮箱</dt>
            <dd><a :href="`mailto:${profile.email}`">{{ profile.email }}</a></dd>
          </template>
          <template v-if="profile.location">
            <dt>所在地</dt>
            <dd>{{ profile.location }}</dd>
          </template>
          <template v-if="profile.responseTime">
            <dt>回复时间</dt>
            <dd>{{ profile.responseTime }}</dd>
          </template>
        </dl>
        <p v-if="!profile.wechat && !profile.email" class="empty">联系方式还没填好。</p>
        <ul v-if="profile.links.length" class="links">
          <li v-for="l in profile.links" :key="l.href">
            <a :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
          </li>
        </ul>
        <RouterLink class="btn btn-ghost" to="/services">先看服务和报价</RouterLink>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  margin-bottom: 120px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  font-size: 14px;
  font-weight: 700;
}
input,
select,
textarea {
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  font: inherit;
  color: var(--text);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
::placeholder {
  color: var(--text-3);
}
textarea {
  resize: vertical;
}
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: none;
  border-color: var(--ink);
  box-shadow: 3px 3px 0 var(--ink);
}
.status {
  min-height: 1.65em;
  margin: 0;
  color: var(--text-2);
}

.side {
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  background: var(--ink);
  color: var(--on-ink);
}
.side h2 {
  margin: 0 0 20px;
  font-size: 22px;
  font-weight: 800;
}
dl {
  margin: 0 0 12px;
}
dt {
  font-size: 13px;
  color: var(--on-ink-2);
}
dd {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin: 4px 0 16px;
  font-weight: 700;
  overflow-wrap: anywhere;
}
dd a,
.links a {
  border-bottom: 2px solid var(--accent);
}
.copy {
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(243, 237, 225, 0.3);
  border-radius: 999px;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--on-ink);
  cursor: pointer;
}
.copy:hover {
  background: rgba(243, 237, 225, 0.08);
}
.empty {
  margin: 0 0 20px;
  color: var(--on-ink-2);
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
  font-weight: 700;
}
.side .btn-ghost {
  margin-top: 8px;
  border-color: rgba(243, 237, 225, 0.3);
  color: var(--on-ink);
}
.side .btn-ghost:hover {
  background: rgba(243, 237, 225, 0.08);
}
.side :focus-visible {
  outline-color: var(--accent);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 640px) {
  .pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
