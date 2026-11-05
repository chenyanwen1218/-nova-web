<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getHealth } from '../api/system'

const status = ref<'loading' | 'up' | 'down'>('loading')
const errorMsg = ref('')

async function check() {
  status.value = 'loading'
  errorMsg.value = ''
  try {
    const res = await getHealth()
    status.value = res.status === 'UP' ? 'up' : 'down'
  } catch (e) {
    status.value = 'down'
    errorMsg.value = (e as Error).message
  }
}

onMounted(check)
</script>

<template>
  <main class="home">
    <h1>Nova</h1>
    <p class="status" role="status" aria-live="polite">
      后端状态：
      <span v-if="status === 'loading'">检测中…</span>
      <span v-else-if="status === 'up'" class="up">运行中</span>
      <span v-else class="down">不可用{{ errorMsg ? `（${errorMsg}）` : '' }}</span>
    </p>
    <button type="button" :disabled="status === 'loading'" @click="check">重新检测</button>
  </main>
</template>

<style scoped>
.home {
  max-width: 640px;
  margin: 15vh auto 0;
  padding: 0 24px;
  text-align: center;
}
.status {
  margin: 24px 0;
}
.up {
  color: #15803d;
}
.down {
  color: #b91c1c;
}
button {
  padding: 8px 20px;
  border: 1px solid currentColor;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
