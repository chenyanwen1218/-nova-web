<script setup lang="ts">
// 作品集首页：首屏说清楚做什么，下面是能直接上手试的作品。文案在 src/data/profile.ts 和 src/data/work.ts
import ContactCta from '@/components/ContactCta.vue'
import FanDeck from '@/components/FanDeck.vue'
import FilmBand from '@/components/FilmBand.vue'
import SiteLink from '@/components/SiteLink.vue'
import { films } from '@/data/home'
import { profile, services } from '@/data/profile'
import { works } from '@/data/work'
</script>

<template>
  <div class="container">
    <!-- 首屏：左侧一句话说清楚做什么，右侧扇形卡就是能接的几类活 -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">{{ profile.headline }}</h1>
        <p class="lead">{{ profile.summary }}</p>
        <div class="actions">
          <RouterLink class="btn btn-primary" to="/contact">聊聊你的项目</RouterLink>
          <SiteLink class="btn btn-ghost" to="/#work">看看作品</SiteLink>
        </div>
      </div>
      <div class="hero-deck">
        <FanDeck :items="services" label="能接的活" />
      </div>
    </section>

    <!-- 墨色反转带：莫比乌斯胶片带本身就是一件作品 -->
    <section class="band" aria-label="作品：莫比乌斯胶片带">
      <FilmBand :items="films" />
      <div class="band-more">
        <RouterLink to="/gallery">打开影像画廊</RouterLink>
      </div>
    </section>

    <section id="work" class="work" aria-labelledby="work-title">
      <h2 id="work-title">能直接打开试的作品</h2>
      <ul class="rows">
        <li v-for="w in works" :key="w.slug" class="row">
          <h3>{{ w.title }}</h3>
          <div class="work-body">
            <p>{{ w.summary }}</p>
            <ul class="points">
              <li v-for="pt in w.points" :key="pt">{{ pt }}</li>
            </ul>
            <ul class="stack" :aria-label="`${w.title}用到的技术`">
              <li v-for="s in w.stack" :key="s">{{ s }}</li>
            </ul>
            <RouterLink v-if="w.to" class="btn btn-ghost" :to="w.to">{{ w.cta }}</RouterLink>
          </div>
        </li>
      </ul>
    </section>

    <ContactCta />
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
/* 中文大字：负字距会让字挤在一起，行高也要比英文大 */
h1 {
  margin: 0 0 20px;
  font-size: clamp(40px, 5.4vw, 76px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
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
/* 墨色底上全站默认的墨色焦点框看不见，换成主色 */
.band :focus-visible {
  outline-color: var(--accent);
}

/* 间距放在 margin 上：点「作品」滚到这一段时，标题紧贴在吸顶导航下面，而不是隔着一大片空白 */
.work {
  margin-top: 96px;
  padding: 24px 0 48px;
}
.work h2 {
  margin: 0 0 48px;
  font-size: clamp(32px, 4.4vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.work-body {
  display: grid;
  justify-items: start;
  gap: 16px;
}
.points {
  max-width: 34em;
  margin: 0;
  padding-left: 1.2em;
  /* 嵌在列表里的列表默认是空心圆点 */
  list-style: disc;
  font-size: 15px;
  color: var(--text-2);
}
.points li + li {
  margin-top: 4px;
}
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.stack li {
  padding: 2px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-2);
}
.work-body .btn {
  min-height: 44px;
  margin-top: 4px;
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
  .work {
    margin-top: 48px;
    padding-bottom: 32px;
  }
}
</style>
