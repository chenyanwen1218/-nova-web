// 页眉放主要栏目；页脚放全部页面
export const navLinks = [
  { to: '/buddies', label: '助手' },
  { to: '/gallery', label: '影像' },
  { to: '/pricing', label: '方案' },
  { to: '/about', label: '关于' },
] as const

export const footerLinks = [
  ...navLinks,
  { to: '/faq', label: '常见问题' },
  { to: '/changelog', label: '更新日志' },
  { to: '/contact', label: '联系我们' },
] as const
