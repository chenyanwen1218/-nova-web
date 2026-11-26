<script setup lang="ts">
// 关于：自我介绍、常用技术、做事的方式。内容都在 src/data/profile.ts
import ContactCta from '@/components/ContactCta.vue'
import { profile, skills, ways } from '@/data/profile'
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1>{{ profile.name ? `你好，我是${profile.name}。` : '关于我' }}</h1>
      <p class="lead">{{ profile.intro }}</p>
      <p v-if="profile.location" class="where">{{ profile.location }}</p>
    </header>

    <section class="block" aria-labelledby="skills-title">
      <h2 id="skills-title">常用的技术</h2>
      <ul class="skills">
        <li v-for="s in skills" :key="s">{{ s }}</li>
      </ul>
    </section>

    <section class="block" aria-labelledby="ways-title">
      <h2 id="ways-title">做事的方式</h2>
      <ul class="rows">
        <li v-for="w in ways" :key="w.title" class="row">
          <h3>{{ w.title }}</h3>
          <p>{{ w.desc }}</p>
        </li>
      </ul>
    </section>

    <ContactCta />
  </div>
</template>

<style scoped>
/* finesse · register=brand · see src/style.css for full stamp */
.where {
  margin: 16px 0 0;
  color: var(--text-3);
}
.block {
  padding: 48px 0;
}
.block h2 {
  margin: 0 0 24px;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.skills li {
  padding: 8px 16px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: var(--bg-elevated);
  font-weight: 600;
}
</style>
