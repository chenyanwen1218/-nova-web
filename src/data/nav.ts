// 页眉放主要栏目；页脚再加上各个演示页面
export const navLinks = [
  { to: '/#work', label: '作品' },
  { to: '/services', label: '服务' },
  { to: '/about', label: '关于' },
  { to: '/contact', label: '联系' },
] as const

export const footerLinks = [
  ...navLinks,
  { to: '/reading', label: '阅读驾驶舱' },
  { to: '/fluid-glass', label: '流体玻璃' },
  { to: '/gallery', label: '影像画廊' },
  { to: '/buddies', label: 'Nova 助手页' },
] as const
