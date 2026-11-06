<template>
  <main class="nf">
    <h1><span class="mark">404</span></h1>
    <p>这个页面走丢了，助手们也没找到它。</p>
    <RouterLink class="back" to="/">返回首页</RouterLink>
  </main>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp · SOUL=7 SPECTACLE=5 DENSITY=4 */
.nf {
  display: grid;
  place-content: center;
  justify-items: center;
  /* 现在有全站页眉，扣掉导航高度 */
  min-height: calc(100dvh - var(--nav-h));
  padding: 24px;
  text-align: center;
}
h1 {
  margin: 0;
  font-size: clamp(96px, 20vw, 200px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.06em;
}
.mark {
  padding: 0 0.06em;
  background: linear-gradient(transparent 55%, var(--accent) 55%, var(--accent) 90%, transparent 90%);
}
p {
  margin: 20px 0 32px;
  color: var(--text-2);
}
.back {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 24px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-ink);
  font-weight: 700;
  box-shadow: 3px 3px 0 var(--ink);
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s var(--ease);
}
.back:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--ink);
}
</style>
