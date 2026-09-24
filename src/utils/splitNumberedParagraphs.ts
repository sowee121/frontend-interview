import type { RichSegment } from '@/types/qa-content'

/** 段内序号连接符：；2、…；9、 等（顿号） */
const STEP_SPLIT_IN_TEXT = /；(?=\d+、)/

function splitTextSegment(seg: Extract<RichSegment, { type: 'text' }>): RichSegment[] {
  const parts = seg.value.split(STEP_SPLIT_IN_TEXT)
  if (parts.length <= 1) return [seg]
  return parts
    .filter((p) => p.length > 0)
    .map((value) => ({ type: 'text' as const, value }))
}

function splitOneParagraph(segments: RichSegment[]): RichSegment[][] {
  const paragraphs: RichSegment[][] = [[]]

  for (const seg of segments) {
    if (seg.type !== 'text') {
      paragraphs[paragraphs.length - 1]!.push(seg)
      continue
    }

    const textParts = splitTextSegment(seg)
    for (let i = 0; i < textParts.length; i++) {
      if (i > 0) paragraphs.push([])
      paragraphs[paragraphs.length - 1]!.push(textParts[i]!)
    }
  }

  if (paragraphs.length === 1) return [segments]
  return paragraphs.filter((p) => p.length > 0)
}

/** 将段内含 ；N、 的序号列表拆成多个段落；已按 JSON 拆好的段落幂等不变 */
export function splitNumberedParagraphs(paragraphs: RichSegment[][]): RichSegment[][] {
  return paragraphs.flatMap((segments) => splitOneParagraph(segments))
}

/** 段落是否以「N、」序号开头（用于步骤样式） */
export function isNumberedStepParagraph(segments: RichSegment[]): boolean {
  const first = segments.find((s) => s.type === 'text' || s.type === 'strong')
  if (!first) return false
  if (first.type === 'text') return /^\d+、/.test(first.value.trimStart())
  return false
}
