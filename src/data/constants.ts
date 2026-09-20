export const CHAPTER_ORDER = [
  'html-css',
  'javascript',
  'es6',
  'typescript',
  'vue',
  'react',
  'miniprogram',
  'browser',
  'network',
  'backend',
  'engineering',
  'performance',
  'scenario',
  'ai',
  'agent',
  'electron',
  'project',
  'coding',
] as const

export type ChapterSlug = (typeof CHAPTER_ORDER)[number]
