#!/usr/bin/env node
/**
 * 扫描题库文案：过长段落、连续大写缩写、常见未配对缩写。
 * 只读检查，不修改 JSON。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const JSON_DIR = path.join(__dirname, '../src/data/qa/json')

/** 若同段已含中文释义则视为已解释 */
const PAIRED_HINTS = [
  /跨站脚本|XSS/i,
  /跨站请求伪造|CSRF/i,
  /内容安全策略|CSP/i,
  /暂时性死区|TDZ/i,
  /同步报文|SYN/i,
  /确认报文|ACK/i,
  /域名解析|DNS/i,
  /传输层安全|TLS/i,
  /服务端渲染|SSR/i,
  /客户端渲染|CSR/i,
  /热模块替换|HMR/i,
]

/** 叙述里像教材伪代码的写法（编程题整段 code 答案跳过） */
const PSEUDO_CODE = [
  { re: /\bawait\s+expr\b/i, label: 'await expr' },
  { re: /\bexpr\b/i, label: 'expr' },
  { re: /下一节\s*resolve/i, label: '下一节 resolve' },
  { re: /resolve\s*\(\s*该/i, label: 'resolve(该值)' },
  { re: /\bsuccess\s*回调/i, label: 'success 回调' },
  {
    re: /pending\s*的\s*Promise/i,
    label: 'pending 的 Promise',
    allow: /永远\s*pending|pending\s*（|等待中\s*（\s*pending/i,
  },
  { re: /\bexecutor\s*\(/i, label: 'executor(' },
  {
    re: /\bGC\b/,
    label: '裸写 GC',
    allow: /垃圾回收/,
  },
  { re: /(?:延迟|阻止|不阻止)\s*GC/i, label: '延迟/阻止 GC' },
]

const BARE_ACRONYMS = [
  'SYN',
  'ACK',
  'ESTABLISHED',
  'QUIC',
  'FOIT',
  'FOUT',
  'CSSOM',
  'TDZ',
  'CSRF',
  'CSP',
  'HMR',
  'PromiseLike',
  'settled',
  'iterable',
]

/** 单题叙事（text/strong，不含 code）建议字数上限，超出应压缩到口述体量 */
const NARRATIVE_MAX = 520

/** 跨章指回提示：正文不得出现「见 X 章「某题」」类编辑口吻，每题答案须自足 */
const CROSS_CHAPTER_REF =
  /(?<![常意遇可而])见\s*(?:本章|同章|场景题|编程题|「[^」]{1,12}」\s*章|[\u4e00-\u9fffA-Za-z0-9./\s]{0,12}?章)/

/** 出题人/备考视角文字：不提供知识，只增加阅读噪音，正文与备注都不该出现 */
const EDITORIAL_HINT =
  /(考察要点：|对应职责：|对应经历：|面试|追问|答题|背诵|得分|加分点|要说清|须说明|需理解|要提到|要能列|不必背|少背|硬背|口述)/

/** 章节引语只写知识主线，不写复习指引 */
const LEAD_HINT = /(略读|口述|准备|深挖点|为主|转到|见「|即可|背诵|面试|追问)/

/** 备注里的弱指令词：正文中的「X 即可」多为技术表述，只在 questionNote 里视为指引 */
const NOTE_HINT = /(即可|无需|不必)/

/** 隐私词：真实公司/机构/业务名一律用通用系统词替代 */
const PRIVACY_WORDS = ['菜鸟', '医院', '诊所', '医疗寄递', '字节跳动']

/** 已废弃/已被取代的术语；命中时同段须出现对应说明才放行 */
const OBSOLETE_TERMS = [
  { term: '.cursorrules', allow: /废弃|旧的|旧版/ },
  { term: 'wx.getUserProfile', allow: /不能|不再|已只返回|废弃/ },
  { term: 'wx.getUserInfo', allow: /不能|不再|已只返回|废弃/ },
  { term: 'Server Push', allow: /移除|不再使用/ },
  { term: 'FID', allow: /取代/ },
]

function collectText(item) {
  const parts = []
  if (item.questionNote) parts.push(item.questionNote)
  for (const para of item.answer ?? []) {
    for (const seg of para) {
      if (seg.type === 'text' || seg.type === 'strong') parts.push(seg.value)
      if (seg.type === 'code') parts.push(seg.value)
    }
  }
  return parts.join('\n')
}

function hasChineseContext(text, acronym) {
  if (PAIRED_HINTS.some((re) => re.test(text))) return true
  // 同段内 acronym 前有中文（至少 2 字）
  const idx = text.indexOf(acronym)
  if (idx <= 0) return false
  const before = text.slice(Math.max(0, idx - 24), idx)
  return /[\u4e00-\u9fff]{2,}/.test(before)
}

function lintFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const base = path.basename(filePath)
  const issues = []

  for (const field of ['description', 'lead']) {
    const t = data[field] ?? ''
    if (t.length > 80 && !/[\u4e00-\u9fff]/.test(t.slice(0, 20))) {
      issues.push({ file: base, id: '(chapter)', kind: 'lead/description', snippet: t.slice(0, 60) })
    }
    const leadHit = t.match(LEAD_HINT)
    if (leadHit) {
      issues.push({
        file: base,
        id: '(chapter)',
        kind: 'editorial-hint',
        snippet: `${field} 含复习指引「${leadHit[0]}」，应改为知识主线`,
      })
    }
  }

  for (const item of data.items ?? []) {
    const full = collectText(item)
    const isCodeOnlyAnswer = item.answer?.every(
      (p) => p.length === 1 && p[0]?.type === 'code',
    )
    if (!isCodeOnlyAnswer) {
      const narrative = (item.answer ?? [])
        .flatMap((para) => para.filter((s) => s.type === 'text' || s.type === 'strong'))
        .map((s) => s.value)
        .join('\n')
      const note = item.questionNote ?? ''
      for (const { re, label, allow } of PSEUDO_CODE) {
        const hit = re.test(narrative) || re.test(note)
        if (!hit) continue
        if (allow && (allow.test(narrative) || allow.test(note))) continue
        issues.push({ file: base, id: item.id, kind: 'pseudo-code', snippet: label })
      }
    }
    for (const segs of item.answer ?? []) {
      const paraText = segs.map((s) => s.value).join('')
      const isSingleCodePara = segs.length === 1 && segs[0]?.type === 'code'
      const isCodeOnlyAnswer =
        item.answer?.every((p) => p.length === 1 && p[0]?.type === 'code') ?? false
      if (!isSingleCodePara && !isCodeOnlyAnswer && paraText.replace(/\s/g, '').length > 140) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'long-paragraph',
          snippet: paraText.slice(0, 80) + '…',
        })
      }
      if (/；[2-9]\d*）/.test(paraText)) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'inline-numbered-steps',
          snippet: '段内仍含 ；2） 类连接符，应拆 answer[]',
        })
      }
    }

    // 文本段反引号/加粗残留、空 text 段、跨章指回提示
    for (const para of item.answer ?? []) {
      for (const seg of para) {
        if (seg.type !== 'text' && seg.type !== 'strong') continue
        if (seg.value.includes('`') || seg.value.includes('**')) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'markdown-residue',
            snippet: seg.value.slice(0, 60),
          })
        }
        if (seg.type === 'text' && seg.value === '') {
          issues.push({
            file: base,
            id: item.id,
            kind: 'empty-text-segment',
            snippet: '存在空的 text 段',
          })
        }
        const ref = seg.value.match(CROSS_CHAPTER_REF)
        if (ref) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'cross-chapter-ref',
            snippet: `正文含指回提示「…${ref[0]}…」，应删除并保持本题自足`,
          })
        }
        const hint = seg.value.match(EDITORIAL_HINT)
        if (hint) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'editorial-hint',
            snippet: `正文含备考口吻「${hint[0]}」，应改为知识陈述`,
          })
        }
      }
    }
    if (item.questionNote) {
      const ref = item.questionNote.match(CROSS_CHAPTER_REF)
      if (ref) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'cross-chapter-ref',
          snippet: `questionNote 含指回提示「…${ref[0]}…」，应删除`,
        })
      }
      const hint = item.questionNote.match(EDITORIAL_HINT) ?? item.questionNote.match(NOTE_HINT)
      if (hint) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'editorial-hint',
          snippet: `questionNote 含答题指引「${hint[0]}」，应改为知识陈述或删除`,
        })
      }
    }

    // 单题叙事体量
    const narrativeLen = (item.answer ?? [])
      .flatMap((para) => para.filter((s) => s.type === 'text' || s.type === 'strong'))
      .reduce((n, s) => n + s.value.length, 0)
    if (narrativeLen > NARRATIVE_MAX) {
      issues.push({
        file: base,
        id: item.id,
        kind: 'overlong-answer',
        snippet: `叙事 ${narrativeLen} 字，超过建议上限 ${NARRATIVE_MAX}`,
      })
    }

    // 隐私词与过时术语
    for (const word of PRIVACY_WORDS) {
      if (full.includes(word)) {
        issues.push({
          file: base,
          id: item.id,
          kind: 'privacy-word',
          snippet: `出现真实公司/机构名「${word}」，请改为通用系统词`,
        })
      }
    }
    for (const { term, allow } of OBSOLETE_TERMS) {
      let from = 0
      while (full.indexOf(term, from) !== -1) {
        const idx = full.indexOf(term, from)
        const window = full.slice(Math.max(0, idx - 40), idx + term.length + 40)
        if (!allow.test(window)) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'obsolete-term',
            snippet: `${term}（未见废弃/替代说明）`,
          })
        }
        from = idx + term.length
      }
    }
    for (const ac of BARE_ACRONYMS) {
      if (!full.includes(ac)) continue
      if (!hasChineseContext(full, ac) && full.includes(ac)) {
        const inCodeOnly = item.answer?.every((para) =>
          para.every((s) => s.type === 'code' || !s.value.includes(ac)),
        )
        if (!inCodeOnly && /(?:^|[\s，；。])/.test(full)) {
          issues.push({
            file: base,
            id: item.id,
            kind: 'bare-acronym',
            snippet: ac,
          })
        }
      }
    }

    const capsRun = full.match(/\b[A-Z]{2,6}\b(?:\s*[→、/]\s*\b[A-Z]{2,6}\b){2,}/)
    if (capsRun && !hasChineseContext(full, capsRun[0].slice(0, 3))) {
      issues.push({
        file: base,
        id: item.id,
        kind: 'acronym-chain',
        snippet: capsRun[0],
      })
    }
  }

  // 同章 navLabel 重复
  const labelCount = new Map()
  for (const item of data.items ?? []) {
    const key = item.navLabel
    labelCount.set(key, [...(labelCount.get(key) ?? []), item.id])
  }
  for (const [label, ids] of labelCount) {
    if (ids.length > 1) {
      issues.push({
        file: base,
        id: ids.join(', '),
        kind: 'duplicate-navlabel',
        snippet: `章节内 navLabel「${label}」重复`,
      })
    }
  }

  return issues
}

const all = fs
  .readdirSync(JSON_DIR)
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => lintFile(path.join(JSON_DIR, f)))

if (all.length === 0) {
  console.log('lint-qa-copy: OK (no issues)')
  process.exit(0)
}

console.log(`lint-qa-copy: ${all.length} issue(s)\n`)
for (const i of all) {
  console.log(`[${i.kind}] ${i.file} :: ${i.id}`)
  console.log(`  ${i.snippet}\n`)
}
process.exit(1)
