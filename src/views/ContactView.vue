<script setup lang="ts">
// 联系我们：表单先做前端校验，后端未接入时只提示不发送
import { reactive, ref } from 'vue'

const topics = ['预约体验', '团队版咨询', '问题反馈', '其他'] as const

const form = reactive({ name: '', email: '', topic: topics[0] as string, message: '' })
const sent = ref(false)

function submit() {
  // 浏览器原生校验（required / type=email）通过后才会触发 submit
  sent.value = true
}

function reset() {
  Object.assign(form, { name: '', email: '', topic: topics[0], message: '' })
  sent.value = false
}
</script>

<template>
  <div class="container">
    <header class="page-head">
      <span class="pill">联系我们</span>
      <h1>想聊聊？<span class="mark">留个言</span>。</h1>
      <p class="lead">预约体验、团队版咨询或者问题反馈都可以，我们会在 2 个工作日内回复。</p>
    </header>

    <div class="layout">
      <form class="form" @submit.prevent="submit">
        <div class="field">
          <label for="c-name">称呼</label>
          <input id="c-name" v-model.trim="form.name" type="text" autocomplete="name" required />
        </div>
        <div class="field">
          <label for="c-email">邮箱</label>
          <input id="c-email" v-model.trim="form.email" type="email" autocomplete="email" required />
        </div>
        <div class="field">
          <label for="c-topic">主题</label>
          <select id="c-topic" v-model="form.topic">
            <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="field">
          <label for="c-msg">内容</label>
          <textarea id="c-msg" v-model.trim="form.message" rows="5" maxlength="1000" required />
        </div>

        <div class="actions">
          <button class="btn btn-primary" type="submit">提交</button>
          <button v-if="sent" class="btn btn-ghost" type="button" @click="reset">再写一条</button>
        </div>
        <p class="status" role="status" aria-live="polite">
          <template v-if="sent">已记下，{{ form.name }}。后端服务接入后才会真正发送，目前不会提交任何数据。</template>
        </p>
      </form>

      <aside class="side" aria-label="其他联系方式">
        <h2>其他方式</h2>
        <dl>
          <dt>邮箱</dt>
          <dd><a href="mailto:hello@example.com">hello@example.com</a></dd>
          <dt>工作时间</dt>
          <dd>周一至周五 10:00–19:00</dd>
        </dl>
        <RouterLink class="btn btn-ghost" to="/faq">先看常见问题</RouterLink>
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
  margin: 0 0 28px;
}
dt {
  font-size: 13px;
  color: var(--on-ink-2);
}
dd {
  margin: 4px 0 16px;
  font-weight: 700;
}
dd a {
  border-bottom: 2px solid var(--accent);
}
.side .btn-ghost {
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
</style>
