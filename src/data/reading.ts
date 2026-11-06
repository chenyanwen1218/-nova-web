// 阅读驾驶舱页面的演示数据（后端未部署前使用）

export type NoteStatus = '未读' | '在读' | '待沉淀' | '已沉淀'

export interface StatCard {
  key: string
  tag: string
  title: string
  value: number
  unit: string
  delta: string
  up: boolean
  // 卡片背后流体光斑的三种颜色
  tint: [string, string, string]
  light?: boolean
}

export interface QueueItem {
  title: string
  status: NoteStatus
  time: string
}

export interface QueueGroup {
  name: string
  dot: string
  items: QueueItem[]
}

export interface RingNote {
  id: string
  title: string
  status: NoteStatus
  count: number
  folder: string
  owner: string
  found: string
  priority: '高' | '中' | '低'
  tags: string[]
  summary: string
  tips: string[]
}

export const stats: StatCard[] = [
  { key: 'today', tag: 'TODAY / 今日新增', title: '今日新增', value: 12, unit: '篇笔记', delta: '20%', up: true, tint: ['#e9eef0', '#9aa6ad', '#5d6a72'], light: true },
  { key: 'inbox', tag: 'INBOX / 未读库存', title: '未读库存', value: 28, unit: '篇笔记', delta: '8%', up: true, tint: ['#2f4bd8', '#d9622b', '#7a2fb8'] },
  { key: 'archive', tag: 'ARCHIVE / 已经阅读', title: '已经阅读', value: 56, unit: '篇笔记', delta: '15%', up: true, tint: ['#3b5bf0', '#e0743a', '#20286b'] },
  { key: 'backlog', tag: 'BACKLOG / 长期未读', title: '长期未读', value: 3, unit: '篇笔记', delta: '40%', up: false, tint: ['#e8592b', '#2b56e0', '#a33a7d'] },
]

export const queue: QueueGroup[] = [
  {
    name: '今日新增',
    dot: '#3ddc84',
    items: [
      { title: 'AI 时代的信息焦虑', status: '未读', time: '今天 10:00' },
      { title: 'Obsidian 阅读工作流', status: '未读', time: '今天 14:00' },
      { title: '知识吸收的闭环设计', status: '在读', time: '昨天 09:30' },
    ],
  },
  {
    name: '长期积压',
    dot: '#6c8cff',
    items: [
      { title: 'Agent Memory 架构', status: '未读', time: '已积压 92 天' },
      { title: '本地优先知识库方案', status: '在读', time: '已积压 38 天' },
    ],
  },
  {
    name: '待沉淀',
    dot: '#b18cff',
    items: [
      { title: '卡片笔记写作法', status: '待沉淀', time: '3 天前' },
      { title: '第二大脑读书笔记', status: '待沉淀', time: '5 天前' },
    ],
  },
]

const base = { owner: '大Y', folder: '待沉淀', found: '2026-07-20 18:55' }

export const ringNotes: RingNote[] = [
  { ...base, id: 'MD-12', title: '已读待沉淀', status: '待沉淀', count: 86, priority: '高', tags: ['阅读', '知识管理', '自动化'], summary: '已经看完，但尚未形成摘要、Wiki 条目、结论或输出。', tips: ['优先完成已经在读超过 7 天的笔记', '将已读内容提炼为摘要或 Wiki 条目'] },
  { ...base, id: 'MD-01', title: '01 收件箱', status: '未读', count: 28, folder: '收件箱', priority: '中', tags: ['收件箱'], summary: '新收进来的文章和链接，等待第一次分拣。', tips: ['每天花 10 分钟清空收件箱', '不想读的直接归档'] },
  { ...base, id: 'MD-02', title: '在读清单', status: '在读', count: 9, folder: '在读', priority: '高', tags: ['阅读'], summary: '正在阅读中的笔记，按最近打开时间排序。', tips: ['同时在读不超过 5 篇', '读完立刻标注要点'] },
  { ...base, id: 'MD-03', title: '摘要草稿', status: '在读', count: 14, folder: '摘要', priority: '中', tags: ['写作', '摘要'], summary: '已经开始写摘要但没写完的草稿。', tips: ['先写一句话结论再补细节'] },
  { ...base, id: 'MD-04', title: 'Wiki 条目', status: '已沉淀', count: 132, folder: 'Wiki', priority: '低', tags: ['Wiki'], summary: '已经沉淀成长期知识的条目。', tips: ['定期给旧条目补上新来源'] },
  { ...base, id: 'MD-05', title: '项目资料', status: '在读', count: 21, folder: '项目', priority: '中', tags: ['项目'], summary: '和当前项目直接相关的参考资料。', tips: ['项目结束后统一归档'] },
  { ...base, id: 'MD-06', title: '稍后再读', status: '未读', count: 47, folder: '稍后', priority: '低', tags: ['稍后'], summary: '暂时不急的长文，周末集中处理。', tips: ['超过 30 天没读就考虑删除'] },
  { ...base, id: 'MD-11', title: '长期未读', status: '未读', count: 3, folder: '积压', priority: '高', tags: ['积压'], summary: '放了很久一直没打开的笔记。', tips: ['挑一篇今天读完', '剩下的重新评估是否还需要'] },
]

// 时间轴：以 7 月 24 日为“今天”，前后各展开几天
export const timelineDays = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export const today = 24

export const timelineBars = [
  { label: '知识吸收闭环 · 7.18 – 7.24', from: 0, to: 6, color: '#3a3f3c' },
  { label: 'Agent Memory · 7.22 – 8.1', from: 4, to: 14, color: '#2b4a3a' },
  { label: '卡片写作 · 7.26 – 8.6', from: 8, to: 19, color: '#1fae5f' },
]
