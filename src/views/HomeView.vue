<script setup lang="ts">
// 后端尚未部署，首页使用 src/data/home.ts 的模拟数据；接口封装保留在 src/api/system.ts
import FanDeck from '@/components/FanDeck.vue'
import RingGallery from '@/components/RingGallery.vue'
import { buddies, features, gallery } from '@/data/home'
</script>

<template>
  <a class="skip" href="#top">跳到正文</a>

  <header class="nav">
    <div class="nav-inner">
      <a class="logo" href="#top" aria-label="Nova 首页"><span class="logo-mark" aria-hidden="true" />Nova</a>
      <nav aria-label="主导航">
        <a href="#buddies">助手</a>
        <a href="#modules">模块</a>
        <a href="#features">特性</a>
      </nav>
    </div>
  </header>

  <main id="top">
    <!-- 首屏：左侧大标题，右侧直接展示助手扇形卡 -->
    <section id="buddies" class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="pill"><span class="pill-dot" aria-hidden="true" />预览版</span>
        <h1 id="hero-title">
          Pick Your Buddy,
          <span class="mark">Light Up</span> Your Day.
        </h1>
        <p class="lead">五个性格不同的助手，挑一个顺手的，让每天的工作轻一点。</p>
        <div class="actions">
          <a class="btn btn-primary" href="#modules">开始体验</a>
          <a class="btn btn-ghost" href="#features">了解更多</a>
        </div>
      </div>
      <div class="hero-deck">
        <FanDeck :items="buddies" />
      </div>
    </section>

    <!-- 墨色反转带：环形模块画廊 -->
    <section id="modules" class="band" aria-labelledby="modules-title">
      <div class="band-inner">
        <div class="band-head">
          <h2 id="modules-title">一圈常用功能，<br />随手可达。</h2>
          <p>{{ gallery.length }} 个模块围成一圈，鼠标移上去会停下。</p>
        </div>
        <RingGallery :items="gallery" />
      </div>
    </section>

    <!-- 特性：横排条目，不用卡片 -->
    <section id="features" class="features" aria-labelledby="features-title">
      <h2 id="features-title">好看，也要好用。</h2>
      <ul class="rows">
        <li v-for="f in features" :key="f.title" class="row">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </li>
      </ul>
    </section>
  </main>

  <footer class="footer">
    <span class="logo"><span class="logo-mark" aria-hidden="true" />Nova</span>
    <span>© 2026 Nova</span>
  </footer>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp · SOUL=7 SPECTACLE=5 DENSITY=4 */
.skip {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 200;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: var(--ink);
  color: var(--on-ink);
  transform: translateY(-160%);
  transition: transform 0.2s var(--ease);
}
.skip:focus-visible {
  transform: none;
}

/* 导航：唯一的 top:0 吸顶元素 */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--nav-h);
  border-bottom: 1px solid var(--border);
  background: rgba(246, 241, 231, 0.82);
  backdrop-filter: blur(10px);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.logo-mark {
  width: 14px;
  height: 14px;
  border: 2px solid var(--ink);
  border-radius: 50%;
  background: var(--accent);
}
.nav nav {
  display: flex;
  gap: 4px;
}
.nav nav a {
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--text-2);
  white-space: nowrap;
  transition:
    color 0.2s,
    background 0.2s;
}
.nav nav a:hover {
  color: var(--text);
  background: var(--surface);
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 首屏 */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 32px;
  min-height: calc(100dvh - var(--nav-h));
  padding: 56px 0 72px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-2);
}
.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--ink);
}
h1 {
  margin: 24px 0 20px;
  font-size: clamp(44px, 7.2vw, 96px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.045em;
}
/* 唯一的主色强调：荧光笔式底色，而不是渐变文字 */
.mark {
  padding: 0 0.08em;
  background: linear-gradient(transparent 52%, var(--accent) 52%, var(--accent) 92%, transparent 92%);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.lead {
  max-width: 30em;
  margin: 0;
  font-size: 18px;
  color: var(--text-2);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}
.btn {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 0.3s var(--ease),
    box-shadow 0.3s var(--ease),
    background 0.2s;
}
.btn:active {
  transform: translateY(1px);
}
.btn-primary {
  border: 2px solid var(--ink);
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 3px 3px 0 var(--ink);
}
.btn-primary:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--ink);
}
.btn-ghost {
  border: 1px solid var(--border-strong);
  color: var(--text);
}
.btn-ghost:hover {
  background: var(--surface);
}

/* 墨色反转带：横向铺满视口 */
.band {
  margin: 0 calc(50% - 50vw);
  padding: 112px 24px;
  background: var(--ink);
  color: var(--on-ink);
}
.band-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
  align-items: center;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}
.band-head h2 {
  margin: 0 0 16px;
  font-size: clamp(32px, 4.4vw, 56px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
}
.band-head p {
  max-width: 22em;
  margin: 0;
  color: var(--on-ink-2);
}

/* 特性：一列横排条目 */
.features {
  padding: 120px 0 96px;
}
.features h2 {
  margin: 0 0 48px;
  font-size: clamp(32px, 4.4vw, 56px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
}
.rows {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--border-strong);
}
.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  align-items: baseline;
  gap: 24px;
  padding: 32px 0;
  border-bottom: 1px solid var(--border-strong);
  transition: padding 0.4s var(--ease);
}
.row h3 {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.row p {
  max-width: 34em;
  margin: 0;
  font-size: 17px;
  color: var(--text-2);
}
@media (hover: hover) and (pointer: fine) {
  .row:hover {
    padding-left: 16px;
  }
  .row:hover h3 {
    background: linear-gradient(transparent 55%, var(--accent) 55%, var(--accent) 90%, transparent 90%);
  }
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-3);
}
.footer .logo {
  font-size: 15px;
  color: var(--text);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
    padding: 48px 0 32px;
    gap: 8px;
  }
  .band-inner {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .nav nav a {
    padding: 10px 10px;
  }
  .band {
    padding: 72px 20px;
  }
  .features {
    padding: 72px 0 64px;
  }
  .row {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
    padding: 24px 0;
  }
}
</style>
