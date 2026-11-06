// 流体玻璃页面的演示指标（后端未部署前使用）；材质默认全部为 Cyan 预设
import { PRESETS, VARIANTS, type FluidCard } from '@/utils/fluidGlass'

const metrics = [
  { key: 'today', eyebrow: 'TODAY / 今日新增', label: '今日新增', value: '12', unit: '篇笔记', change: 20 },
  { key: 'inbox', eyebrow: 'INBOX / 未读库存', label: '未读库存', value: '28', unit: '篇笔记', change: 8 },
  { key: 'archive', eyebrow: 'ARCHIVE / 已经阅读', label: '已经阅读', value: '56', unit: '篇笔记', change: 15 },
  { key: 'backlog', eyebrow: 'BACKLOG / 长期未读', label: '长期未读', value: '3', unit: '篇笔记', change: -40 },
  { key: 'focus', eyebrow: 'FOCUS / 专注时长', label: '专注时长', value: '4.6', unit: '小时', change: 12 },
  { key: 'digest', eyebrow: 'DIGEST / 新增摘要', label: '新增摘要', value: '9', unit: '条', change: 33 },
  { key: 'wiki', eyebrow: 'WIKI / 知识条目', label: '知识条目', value: '132', unit: '条', change: 5 },
  { key: 'links', eyebrow: 'LINKS / 双向链接', label: '双向链接', value: '418', unit: '个', change: -6 },
]

export const fluidCards: FluidCard[] = metrics.map((m, i) => ({
  ...m,
  preset: 'cyan',
  ...PRESETS.cyan,
  ...VARIANTS[i % VARIANTS.length],
}))
