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

export interface FilmFrame {
  /** Unsplash 图片编号（经 Lorem Picsum 获取） */
  id: string
  author: string
  alt: string
  src: string
}

// 本地压缩后的 webp（480px 宽），由 Vite 处理成带 hash 的地址
const filmFiles = import.meta.glob<string>('@/assets/film/*.webp', { eager: true, import: 'default' })
const filmSrc = (id: string) =>
  Object.entries(filmFiles).find(([path]) => path.endsWith(`-${id}.webp`))?.[1] ?? ''

export const films: FilmFrame[] = [
  { id: '1018', author: 'Andrew Ridley', alt: '云雾下的绿色山谷与蜿蜒公路' },
  { id: '1019', author: 'Patrick Fore', alt: '暴风雨前阴沉的海面' },
  { id: '1022', author: 'Vashishtha Jogi', alt: '绿色极光下的一棵松树剪影' },
  { id: '1002', author: 'NASA', alt: '卫星视角的海岸线与浅海' },
  { id: '1015', author: 'Alexey Topolyanskiy', alt: '峭壁之间的深蓝峡湾' },
  { id: '1016', author: 'Philippe Wuyts', alt: '夕阳照亮的红色岩石峡谷' },
  { id: '1039', author: 'Andrew Coelho', alt: '森林里从苔藓崖壁落下的瀑布' },
  { id: '1044', author: 'Steve Carter', alt: '雾中河谷，一个人站在乱石滩上' },
  { id: '1047', author: 'sergee bee', alt: '两侧红砖墙的城市小巷' },
  { id: '1051', author: 'Ales Krivec', alt: '伸向湖面和远山的木栈桥' },
  { id: '1069', author: 'Marat Gilyadzinov', alt: '深蓝海水中的橙色水母' },
  { id: '110', author: 'Kenneth Thewissen', alt: '日落时草原上的几棵树' },
].map((f) => ({ ...f, src: filmSrc(f.id) }))

export interface Feature {
  title: string
  desc: string
}

export const features: Feature[] = [
  { title: '轻量', desc: '核心交互全部用原生 CSS 实现，不引入重型动画库，首屏更快。' },
  { title: '一致', desc: '配色、间距、圆角统一成设计变量，整站风格一次定下来。' },
  { title: '可扩展', desc: '页面由独立组件拼装，后端接口就绪后即可替换模拟数据。' },
]
