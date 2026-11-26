// 首页「作品」列表。每一项都是这个仓库里真实存在、可以直接打开的页面，说明只写页面里确实做到的事

export interface Work {
  slug: string
  title: string
  summary: string
  points: string[]
  stack: string[]
  /** 演示页面地址；没有单独页面的作品不填 */
  to?: string
  /** 按钮文字，要说清楚点了去哪 */
  cta?: string
}

export const works: Work[] = [
  {
    slug: 'reading',
    title: '阅读驾驶舱',
    summary: '一个深色的阅读笔记面板。笔记排成能拖动的 3D 卡片环，右侧看详情，下方是阅读时间线。',
    points: [
      '拖动旋转卡片环，按住 Ctrl 再滚动滚轮缩放',
      '编辑模式下直接改笔记的标题和摘要',
      '一键导出成离线也能打开的 HTML 文件，样式完整',
      '点「保存页面」后，笔记范围、自动巡航和速度存在浏览器里，刷新不丢',
    ],
    stack: ['Vue 3', 'TypeScript', 'CSS 3D'],
    to: '/reading',
    cta: '打开阅读驾驶舱',
  },
  {
    slug: 'fluid-glass',
    title: '流体玻璃',
    summary: '用 WebGL 着色器画的玻璃质感指标卡，鼠标划过会推动卡片里的流体。',
    points: [
      '材质内核接入开源的 fluidglass-ui（Apache-2.0）',
      '按设备性能自动选画质，低配设备和省流量模式会降档',
      '不支持 WebGL 时自动换成 CSS 版本，页面照样能用',
      '材质设置面板可以全程用键盘操作，关掉后焦点回到原来的按钮',
    ],
    stack: ['WebGL', 'GLSL', 'Vue 3'],
    to: '/fluid-glass',
    cta: '打开流体玻璃',
  },
  {
    slug: 'film',
    title: '莫比乌斯胶片带',
    summary: '就是这一页上那条胶片带：24 帧照片沿一条扭转半圈的环排列，转一圈正面和背面交替转到眼前。',
    points: [
      '纯 CSS 3D，没有用动画库',
      '拖动带惯性，点一帧它会立到中央',
      '用键盘逐帧切换时，选中的那帧自动转到正前方',
      '滚出屏幕就停止动画；系统开了「减少动态效果」时不自转',
      '配套的画廊用原生 dialog 看大图，方向键翻页',
    ],
    stack: ['CSS 3D', 'Vue 3'],
    to: '/gallery',
    cta: '打开影像画廊',
  },
  {
    slug: 'nova',
    title: 'Nova 助手页',
    summary: '给一个虚构的 AI 助手产品做的展示页：五个助手的卡片墙，每个助手有自己的详情页。',
    points: [
      '五张卡共用一组亮度和饱和度，看起来是一套角色',
      '详情页由地址生成，可以直接分享某一个助手',
      '上一位、下一位循环切换',
    ],
    stack: ['Vue Router', '响应式布局'],
    to: '/buddies',
    cta: '打开 Nova 助手页',
  },
  {
    slug: 'audit',
    title: '前端体检：这个网站自己',
    summary: '把这个网站当成客户项目做了一次体检：每个页面在电脑和手机尺寸下各扫一遍，按问题清单逐条修好，再扫一遍确认。',
    points: [
      '自动扫描 24 次，其中 7 次报出无障碍问题，共 81 处；修完后为 0',
      '流体玻璃的设置面板打开时，按 Tab 会跑到背后 11 个元素上；修完后焦点只在面板里',
      '手机上导航有两个栏目被挤出屏幕点不到；修完后可以横向滑动',
      '阅读驾驶舱导出的 HTML 离线打开没有样式；修完后和页面上看到的一样',
    ],
    stack: ['Playwright', 'axe-core', 'WCAG'],
    to: '/services#audit',
    cta: '看前端体检服务',
  },
]
