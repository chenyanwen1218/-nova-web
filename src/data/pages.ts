// 方案、常见问题、更新日志页的模拟数据。后端上线后可替换为接口返回

export interface Plan {
  name: string
  price: string
  unit: string
  desc: string
  perks: string[]
  /** 主推方案，卡片会加粗描边并显示角标 */
  featured?: boolean
}

export const plans: Plan[] = [
  {
    name: '体验版',
    price: '¥0',
    unit: '/ 月',
    desc: '一个人先试试，挑一个助手长期用。',
    perks: ['1 个助手', '每天 50 次调用', '7 天历史记录'],
  },
  {
    name: '专业版',
    price: '¥39',
    unit: '/ 月',
    desc: '五个助手全开，适合每天都离不开它们的人。',
    perks: ['5 个助手全部可用', '不限调用次数', '历史记录永久保存', '优先体验新功能'],
    featured: true,
  },
  {
    name: '团队版',
    price: '¥99',
    unit: '/ 人·月',
    desc: '整个团队共用助手，统一管理权限和账单。',
    perks: ['专业版全部功能', '团队空间与共享清单', '成员权限管理', '专属客服'],
  },
]

export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  { q: '现在能用吗？', a: '目前是前端预览版，可以浏览全部页面和交互。后端服务预计 2027 Q1 接入，届时助手即可使用。' },
  { q: '预览期间收费吗？', a: '不收费。正式上线后按「方案」页的价格计费，预览期间预约的用户会有优惠。' },
  { q: '五个助手可以同时用吗？', a: '体验版可选 1 个，专业版和团队版五个都能用，也可以让它们协作完成同一件事。' },
  { q: '我的数据会被拿去训练吗？', a: '不会。你的记录只用于为你提供服务，可以随时导出或删除。' },
  { q: '支持手机吗？', a: '页面已适配手机和平板。独立 App 在规划中，会在公测后提供。' },
  { q: '团队版怎么开通？', a: '在「联系我们」留下团队规模和需求，我们会在 2 个工作日内回复。' },
]

export interface Release {
  version: string
  date: string
  notes: string[]
}

export const releases: Release[] = [
  {
    version: 'v0.4',
    date: '2026-12-08',
    notes: ['新增方案、常见问题、更新日志、联系我们页面', '页脚列出全部页面入口'],
  },
  {
    version: 'v0.3',
    date: '2026-11-20',
    notes: ['新增助手列表、助手详情、影像、关于页面', '页眉页脚拆成全站共用组件'],
  },
  { version: 'v0.2', date: '2026-10-30', notes: ['首页影像区改为莫比乌斯胶片带', '首页改版为纸面 + 墨色风格'] },
  { version: 'v0.1', date: '2026-10-12', notes: ['项目初始化，首页静态预览上线'] },
]
