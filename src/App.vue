<script setup lang="ts">
// 全站布局：页眉、页脚固定，中间按路由切换页面；meta.bare 的页面（如阅读驾驶舱）独占整屏
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'

const route = useRoute()
const bare = computed(() => route.meta.bare === true)
</script>

<template>
  <SiteHeader v-if="!bare" />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter v-if="!bare" />
</template>
