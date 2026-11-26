import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { profile, siteTitle } from './src/data/profile.ts'

// index.html 的标题和描述跟着 src/data/profile.ts 走，名字只需要改一处。
// 微信、搜索引擎抓链接预览时不运行 JS，所以要写进 HTML 本身
function siteMeta(): Plugin {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'site-meta',
    // 名字和联系方式没填就发布的话，客户联系不上你：启动和构建时都提醒一下
    buildStart() {
      if (!profile.name || (!profile.email && !profile.wechat)) {
        this.warn('src/data/profile.ts 里还没填名字或联系方式（邮箱、微信至少一个），这样发布出去客户联系不上你。')
      }
    },
    transformIndexHtml: (html) =>
      html.replaceAll('__SITE_TITLE__', esc(siteTitle)).replaceAll('__SITE_DESC__', esc(profile.description)),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // GitHub Pages 部署在 /-nova-web/ 子路径下，由工作流传入 VITE_BASE；其他环境默认根路径
    base: process.env.VITE_BASE || '/',
    plugins: [vue(), siteMeta()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      // 本地开发把 /api 转发到后端，避免跨域
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
