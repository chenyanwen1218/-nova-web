<script setup lang="ts">
// 后端尚未部署，首页暂不请求任何接口；接口封装保留在 src/api/system.ts，后端上线后再接入
</script>

<template>
  <main class="home">
    <h1>Nova</h1>
    <p class="desc">前端已运行，后端服务接入中。</p>
  </main>
</template>

<style scoped>
.home {
  max-width: 640px;
  margin: 15vh auto 0;
  padding: 0 24px;
  text-align: center;
}
.desc {
  margin: 24px 0;
  color: #4b5563;
}
</style>
