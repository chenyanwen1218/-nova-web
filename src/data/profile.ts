// 作品集里所有「关于你」的内容都在这个文件：名字、联系方式、服务和报价、合作流程。
// 上线接单前至少填好 name，以及 email、wechat 其中一个；本地预览时页面左下角会提示还缺什么。
// 价格、周期留空时服务卡片上不显示这一行（页头写着开工前报价），不会编一个数字出来。
// 这个文件也被 vite.config.ts 读取，用来生成 index.html 的标题和描述，所以这里不要引用别的模块。

export const profile = {
  /** 你的名字或工作室名：显示在页眉、页脚、浏览器标题和分享卡片上 */
  name: '',
  /** 一句话说明你是做什么的，跟在名字后面出现在浏览器标题里 */
  role: '前端开发',
  /** 首页大标题 */
  headline: '做会动的网页。',
  /** 首页大标题下面的一段话 */
  summary:
    '官网、落地页、3D 和 WebGL 交互动效都接，手机和电脑上都好用，键盘也能操作。这一页上的卡片和胶片带都是我做的，可以直接拖一拖、点一点。',
  /** 搜索结果和分享卡片里的描述 */
  description: '前端开发接单：落地页、交互动效、产品官网和前端体检。作品都能直接打开试用。',
  /** 关于页的自我介绍 */
  intro:
    '我做网页前端，从设计稿到上线。做完的东西我会在手机、键盘和读屏上都试一遍，也会盯着打开速度。',
  email: '',
  /** 微信号：联系页会显示，并提供一键复制 */
  wechat: '',
  /** 比如「杭州，可远程」；留空就不显示 */
  location: '',
  /** 比如「1 个工作日内」；留空就不显示 */
  responseTime: '',
  /** 其他主页，比如 { label: 'GitHub', href: 'https://github.com/…' } */
  links: [] as { label: string; href: string }[],
}

/** 名字没填时页眉和标题显示「作品集」 */
export const siteName = profile.name || '作品集'
/** 首页的浏览器标题，也是 index.html 的标题 */
export const siteTitle = `${siteName} · ${profile.role}`

export interface Service {
  /** 地址里的标识：服务页锚点 /services#landing，联系页预选 /contact?service=landing */
  slug: string
  name: string
  /** 首页卡片上的一句话 */
  tag: string
  emoji: string
  /** 首页卡片颜色 [亮面, 暗面] */
  colors: [string, string]
  desc: string
  includes: string[]
  /** 比如「¥3000 起」；留空就不显示 */
  price: string
  /** 比如「约 1 周」；留空不显示 */
  duration: string
}

export const services: Service[] = [
  {
    slug: 'landing',
    name: '落地页',
    tag: '一页讲清一件事',
    emoji: '📣',
    colors: ['#ffdc7a', '#f6c445'],
    desc: '给一个产品、活动或报名做一页：首屏、卖点、价格和行动按钮，手机上也好看。',
    includes: ['按设计稿或参考网站来做', '手机、平板、电脑都适配', '一两个让人记住的交互', '部署上线，交付源码'],
    price: '',
    duration: '',
  },
  {
    slug: 'motion',
    name: '交互动效',
    tag: '3D、拖拽、WebGL',
    emoji: '🎞️',
    colors: ['#aee5e8', '#84d0d6'],
    desc: '像本站胶片带那样的 3D、拖拽惯性或 WebGL 效果，做成组件放进你现有的网站。',
    includes: ['滚出屏幕自动暂停，不白耗电', '系统开了「减少动态效果」时自动收敛', '键盘也能操作', '低配设备自动降低画质'],
    price: '',
    duration: '',
  },
  {
    slug: 'site',
    name: '产品官网',
    tag: '多页面，好维护',
    emoji: '🏢',
    colors: ['#c3ccff', '#a3aef5'],
    desc: '首页、产品介绍、价格、常见问题、联系方式这类多页面官网。文字和图片集中放在几个数据文件里，以后改内容很方便。',
    includes: ['全站统一配色和组件', '手机适配，键盘也能操作', '部署到 GitHub Pages、Vercel、Cloudflare 或你的服务器', '交付源码和修改说明'],
    price: '',
    duration: '',
  },
  {
    slug: 'audit',
    name: '前端体检',
    tag: '找出问题，再修好',
    emoji: '🩺',
    colors: ['#ffbfb2', '#f59d8b'],
    desc: '检查你现有网站的手机显示、键盘操作、读屏、颜色对比度和加载速度，列出问题清单，然后逐条修好。',
    includes: ['逐页截图和自动无障碍扫描', '问题清单写明影响和改法', '修完再扫一遍，给你前后对比'],
    price: '',
    duration: '',
  },
]

/** 合作流程，服务页按顺序显示 */
export const steps = [
  { title: '说需求', desc: '告诉我要做什么、给谁看、什么时候要。有参考网站的话一起发来。' },
  { title: '报价和排期', desc: '我列出页面清单、总价和交付日期，你确认后开工。' },
  { title: '边做边看', desc: '开发中随时有预览链接，按约定的次数修改。' },
  { title: '上线交付', desc: '部署到线上，源码和修改说明一起交给你。' },
]

/** 服务页底部的合作问答 */
export const faqs = [
  {
    q: '价格怎么定？',
    a: '按页面数量和交互的复杂程度估算，开工前给出总价。做的过程中需求有大的变化，再一起重新商量。',
  },
  { q: '最后交付哪些东西？', a: '线上地址、完整源码，以及以后怎么改文字和图片的说明。' },
  {
    q: '网站放在哪里？',
    a: '可以放在 GitHub Pages、Vercel、Cloudflare 这类托管平台，也可以部署到你自己的服务器。服务器在中国大陆的话，需要先做 ICP 备案。',
  },
  {
    q: '已经有网站了，只想修修问题可以吗？',
    a: '可以，这就是「前端体检」：先检查出一份问题清单，你挑要修的，修完再检查一遍。',
  },
]

/** 关于页：常用的技术 */
export const skills = [
  'Vue 3',
  'TypeScript',
  'Vite',
  'Pinia',
  'CSS 3D 和动效',
  'WebGL 着色器',
  '无障碍（WCAG）',
  '响应式布局',
  'Playwright 和 axe 自动检查',
]

/** 关于页：做事的方式 */
export const ways = [
  { title: '先说清楚再动手', desc: '开工前把页面清单、总价和交付日期写下来，双方都确认。' },
  { title: '过程看得见', desc: '开发中随时有预览链接，不用等到最后才看到结果。' },
  { title: '交付的东西能用', desc: '手机、键盘和读屏都试过一遍，源码和修改说明一起交给你。' },
]
