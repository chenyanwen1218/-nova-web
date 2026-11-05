// 首页的模拟数据。后端上线后可替换为接口返回

export interface Buddy {
  name: string
  tag: string
  emoji: string
  /** 卡片颜色 [亮面, 暗面]，五张卡保持同一组亮度和饱和度，看起来是一套角色 */
  colors: [string, string]
}

export const buddies: Buddy[] = [
  { name: 'Cloudy', tag: '轻盈助手', emoji: '☁️', colors: ['#c3ccff', '#a3aef5'] },
  { name: 'Dummies', tag: '自动化机器人', emoji: '🤖', colors: ['#ffbfb2', '#f59d8b'] },
  { name: 'Orbit', tag: '数据洞察', emoji: '🪐', colors: ['#aee5e8', '#84d0d6'] },
  { name: 'Sunny', tag: '灵感生成', emoji: '🌻', colors: ['#ffdc7a', '#f6c445'] },
  { name: 'Peetie', tag: '贴心提醒', emoji: '🐙', colors: ['#ebc4f3', '#d8a5e8'] },
]

export interface GalleryItem {
  title: string
  emoji: string
}

export const gallery: GalleryItem[] = [
  { title: '仪表盘', emoji: '📊' },
  { title: '工作流', emoji: '⚙️' },
  { title: '知识库', emoji: '📚' },
  { title: '消息中心', emoji: '💬' },
  { title: '日程', emoji: '🗓️' },
  { title: '团队', emoji: '👥' },
  { title: '报表', emoji: '📈' },
  { title: '设置', emoji: '🛠️' },
]

export interface Feature {
  title: string
  desc: string
}

export const features: Feature[] = [
  { title: '轻量', desc: '核心交互全部用原生 CSS 实现，不引入重型动画库，首屏更快。' },
  { title: '一致', desc: '配色、间距、圆角统一成设计变量，整站风格一次定下来。' },
  { title: '可扩展', desc: '页面由独立组件拼装，后端接口就绪后即可替换模拟数据。' },
]
