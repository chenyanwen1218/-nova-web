<script setup lang="ts">
// 后端尚未部署，首页使用 src/data/home.ts 的模拟数据；接口封装保留在 src/api/system.ts
import FanDeck from '@/components/FanDeck.vue'
import FilmBand from '@/components/FilmBand.vue'
import { buddies, features, films } from '@/data/home'
</script>

<template>
  <div class="container">
    <!-- 首屏：左侧大标题，右侧直接展示助手扇形卡 -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="pill"><span class="pill-dot" aria-hidden="true" />预览版</span>
        <h1 id="hero-title">
          Pick Your Buddy,
          <span class="mark">Light Up</span> Your Day.
        </h1>
        <p class="lead">五个性格不同的助手，挑一个顺手的，让每天的工作轻一点。</p>
        <div class="actions">
          <RouterLink class="btn btn-primary" to="/buddies">认识助手</RouterLink>
          <RouterLink class="btn btn-ghost" to="/about">了解更多</RouterLink>
        </div>
      </div>
      <div class="hero-deck">
        <FanDeck :items="buddies" />
      </div>
    </section>

    <!-- 墨色反转带：莫比乌斯胶片带，点击照片在中央立起 -->
    <section class="band" aria-label="影像胶片带">
      <FilmBand :items="films" />
      <div class="band-more">
        <RouterLink to="/gallery">查看全部影像 →</RouterLink>
      </div>
    </section>

    <!-- 特性：横排条目，不用卡片 -->
    <section class="features" aria-labelledby="features-title">
      <h2 id="features-title">好看，也要好用。</h2>
      <ul class="rows">
        <li v-for="f in features" :key="f.title" class="row">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp · SOUL=7 SPECTACLE=5 DENSITY=4 */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 32px;
  min-height: calc(100dvh - var(--nav-h));
  padding: 56px 0 72px;
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
.actions {
  margin-top: 36px;
}

/* 墨色反转带：横向铺满视口 */
.band {
  margin: 0 calc(50% - 50vw);
  background: var(--ink);
  color: var(--on-ink);
}
.band-more {
  display: flex;
  justify-content: center;
  padding: 0 24px 56px;
}
.band-more a {
  font-size: 15px;
  font-weight: 700;
  color: var(--on-ink-2);
  transition: color 0.2s;
}
.band-more a:hover {
  color: var(--accent);
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

@media (max-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
    padding: 48px 0 32px;
    gap: 8px;
  }
}
@media (max-width: 640px) {
  .features {
    padding: 72px 0 64px;
  }
}
</style>
