export const CHAPTER_ORDER = [
  'html-css',
  'javascript',
  'es6',
  'typescript',
  'vue',
  'react',
  'miniprogram',
  'electron',
  'browser',
  'network',
  'performance',
  'engineering',
  'scenario',
  'project',
  'coding',
  'backend',
  'ai',
  'agent',
] as const

export type ChapterSlug = (typeof CHAPTER_ORDER)[number]
