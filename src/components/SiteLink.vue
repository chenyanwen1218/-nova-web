<script setup lang="ts">
// 站内链接。带 #锚点 的链接（如「作品」）指向页面里的一段而不是一个页面，
// 所以不加「当前页」高亮和 aria-current；已经在那一页时直接滚过去，重复点击也有效
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{ to: string }>()
const route = useRoute()
const router = useRouter()
const hash = computed(() => props.to.split('#')[1] ?? '')
const target = computed(() => router.resolve(props.to))

function go(e: MouseEvent) {
  // 新标签页打开之类的组合键交给浏览器
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  if (route.path === target.value.path) {
    // scrollIntoView 会算上 scroll-padding-top，标题不会被吸顶导航挡住
    document.getElementById(hash.value)?.scrollIntoView()
  } else {
    router.push(target.value)
  }
}
</script>

<template>
  <a v-if="hash" :href="target.href" @click="go"><slot /></a>
  <RouterLink v-else :to="to"><slot /></RouterLink>
</template>
