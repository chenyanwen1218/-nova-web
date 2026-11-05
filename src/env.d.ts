/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端地址，开发环境留空走 vite 代理 */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
