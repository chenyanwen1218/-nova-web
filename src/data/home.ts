// 首页的模拟数据。后端上线后可替换为接口返回

export interface Buddy {
  /** 详情页地址里的标识，如 /buddies/orbit */
  slug: string
  name: string
  tag: string
  emoji: string
  /** 卡片颜色 [亮面, 暗面]，五张卡保持同一组亮度和饱和度，看起来是一套角色 */
  colors: [string, string]
  intro: string
  skills: string[]
}

export const buddies: Buddy[] = [
  {
    slug: 'cloudy',
    name: 'Cloudy',
    tag: '轻盈助手',
    emoji: '☁️',
    colors: ['#c3ccff', '#a3aef5'],
    intro: '不打扰的随身记事本。随手记下的想法，它会帮你整理成清单和摘要。',
    skills: ['随手速记', '会议纪要整理', '每日摘要'],
  },
  {
    slug: 'dummies',
    name: 'Dummies',
    tag: '自动化机器人',
    emoji: '🤖',
    colors: ['#ffbfb2', '#f59d8b'],
    intro: '把重复的点击交给它。按规则批量处理文件、表单和通知，跑完给你一份报告。',
    skills: ['定时任务', '批量处理', '流程编排'],
  },
  {
    slug: 'orbit',
    name: 'Orbit',
    tag: '数据洞察',
    emoji: '🪐',
    colors: ['#aee5e8', '#84d0d6'],
    intro: '盯着关键指标，有异动时第一时间告诉你，并说清楚可能的原因。',
    skills: ['指标看板', '异常提醒', '趋势分析'],
  },
  {
    slug: 'sunny',
    name: 'Sunny',
    tag: '灵感生成',
    emoji: '🌻',
    colors: ['#ffdc7a', '#f6c445'],
    intro: '卡住的时候找它聊聊。标题、文案、方案草稿，先给你几个方向再一起细化。',
    skills: ['头脑风暴', '文案草拟', '方案对比'],
  },
  {
    slug: 'peetie',
    name: 'Peetie',
    tag: '贴心提醒',
    emoji: '🐙',
    colors: ['#ebc4f3', '#d8a5e8'],
    intro: '记得每个截止日期和约定。提前提醒，必要时帮你改期并通知相关的人。',
    skills: ['日程提醒', '待办跟进', '智能改期'],
  },
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

export interface Milestone {
  when: string
  title: string
  done: boolean
}

export const roadmap: Milestone[] = [
  { when: '2026 Q3', title: '视觉与交互定稿', done: true },
  { when: '2026 Q4', title: '前端预览版上线', done: true },
  { when: '2027 Q1', title: '后端服务接入，助手可用', done: false },
  { when: '2027 Q2', title: '开放公测', done: false },
]
