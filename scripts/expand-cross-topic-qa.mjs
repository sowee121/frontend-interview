/**
 * 将埋点/监控、i18n、WebSocket、移动端适配等扩写到现有章，不新建专题。
 * 用法: node scripts/expand-cross-topic-qa.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const jsonDir = join(dirname(fileURLToPath(import.meta.url)), '../src/data/qa/json')

function load(slug) {
  const p = join(jsonDir, `${slug}.json`)
  return { data: JSON.parse(readFileSync(p, 'utf8')), path: p }
}

function save(path, data) {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function upsertItem(items, item, afterId) {
  const i = items.findIndex((x) => x.id === item.id)
  if (i >= 0) {
    items[i] = item
    return
  }
  const after = items.findIndex((x) => x.id === afterId)
  if (after >= 0) items.splice(after + 1, 0, item)
  else items.push(item)
}

// performance
const perf = load('performance')
upsertItem(perf.data.items, {
  id: 'q-observability',
  navLabel: '埋点与可观测',
  question: '埋点、性能监控和错误上报怎么分工？',
  questionNote: '三者都上报，但目的不同；面试能说清指标类型与谁消费。',
  answer: [
    [
      { type: 'strong', value: '一句话：' },
      {
        type: 'text',
        value: '埋点看「用户做了什么」，性能监控看「快不快、卡不卡」，错误上报看「哪里挂了」。',
      },
    ],
    [
      { type: 'text', value: '1、' },
      { type: 'strong', value: '行为埋点' },
      {
        type: 'text',
        value: '：点击、曝光、漏斗转化，给产品/运营；注意采样与隐私合规。',
      },
    ],
    [
      { type: 'text', value: '2、' },
      { type: 'strong', value: '性能监控（RUM）' },
      { type: 'text', value: '：Web Vitals、接口耗时、白屏率；用 ' },
      { type: 'code', value: 'PerformanceObserver' },
      { type: 'text', value: ' 采集，与 Lighthouse 互补。' },
    ],
    [
      { type: 'text', value: '3、' },
      { type: 'strong', value: '错误上报' },
      {
        type: 'text',
        value: '：JS 异常、资源 404、接口 5xx；接 Sentry 等，带 release、路由、breadcrumb。',
      },
    ],
    [
      { type: 'text', value: '4、可共用 ' },
      { type: 'code', value: 'sendBeacon' },
      { type: 'text', value: ' 通道，但指标定义与告警要分开，避免一个大盘塞所有字段。' },
    ],
  ],
}, 'q-monitor')
save(perf.path, perf.data)

// engineering
const eng = load('engineering')
upsertItem(eng.data.items, {
  id: 'q-i18n-engineering',
  navLabel: '国际化工程化',
  question: 'Vue/React 项目里国际化一般怎么落地？',
  questionNote: '语言包拆分、懒加载、构建与类型；RTL/SEO 见场景题。',
  answer: [
    [
      { type: 'strong', value: '一句话：' },
      { type: 'text', value: '用 i18n 库管文案 key，按语言拆包，切换 locale 时按需加载。' },
    ],
    [
      { type: 'text', value: '1、Vue 用 ' },
      { type: 'code', value: 'vue-i18n' },
      { type: 'text', value: '，React 用 ' },
      { type: 'code', value: 'react-i18next' },
      { type: 'text', value: '；模板 ' },
      { type: 'code', value: "$t('key')" },
      { type: 'text', value: '，避免硬编码。' },
    ],
    [
      { type: 'text', value: '2、' },
      { type: 'code', value: 'locales/zh-CN.json' },
      { type: 'text', value: ' 按语言拆分，路由级 ' },
      { type: 'code', value: 'import()' },
      { type: 'text', value: ' 懒加载；CI 可校验缺失 key。' },
    ],
    [
      { type: 'text', value: '3、复数/插值用 ICU 或库内置；日期货币仍用 ' },
      { type: 'code', value: 'Intl' },
      { type: 'text', value: '。RTL、路由前缀见场景题「国际化与 RTL」。' },
    ],
  ],
})
save(eng.path, eng.data)

// network
const net = load('network')
upsertItem(net.data.items, {
  id: 'q-websocket-basics',
  navLabel: 'WebSocket 基础',
  question: 'WebSocket 和 HTTP 是什么关系？',
  questionNote: '握手走 HTTP 升级；全双工长连接；重连与 SSE 选型见场景题。',
  answer: [
    [
      { type: 'strong', value: '一句话：' },
      {
        type: 'text',
        value: '先 HTTP 协议升级（Upgrade），再在同一条 TCP 上双向传帧，不是短连接一问一答。',
      },
    ],
    [
      { type: 'text', value: '1、请求头带 ' },
      { type: 'code', value: 'Upgrade: websocket' },
      { type: 'text', value: '，服务端 101 后进入 WebSocket。' },
    ],
    [
      {
        type: 'text',
        value: '2、适合聊天、协同、行情等低延迟双向场景；只读推送可评估服务端发送事件（SSE）。',
      },
    ],
    [
      {
        type: 'text',
        value: '3、注意代理超时、握手鉴权；断线重连与心跳见场景题。',
      },
    ],
  ],
})
save(net.path, net.data)

// html-css
const html = load('html-css')
upsertItem(
  html.data.items,
  {
    id: 'q-safe-area',
    navLabel: '安全区',
    question: '刘海屏、底部横条（Home Indicator）怎么适配？',
    questionNote: 'env(safe-area-inset-*) + viewport-fit=cover。',
    answer: [
      [
        { type: 'strong', value: '一句话：' },
        { type: 'text', value: '用 CSS 环境变量把内容顶进系统标定的安全区内。' },
      ],
      [
        { type: 'text', value: '1、' },
        { type: 'code', value: 'viewport-fit=cover' },
        { type: 'text', value: ' + ' },
        { type: 'code', value: 'padding-bottom: env(safe-area-inset-bottom)' },
        { type: 'text', value: ' 给固定底栏留白。' },
      ],
      [
        { type: 'text', value: '2、四边用 ' },
        { type: 'code', value: 'safe-area-inset-*' },
        { type: 'text', value: '；旧 iOS 可写 ' },
        { type: 'code', value: 'constant()' },
        { type: 'text', value: ' 兜底。' },
      ],
      [
        { type: 'text', value: '3、与 1px 细线、100vh/dvh 同属移动端常考点。' },
      ],
    ],
  },
  'q-mobile-1px',
)
upsertItem(
  html.data.items,
  {
    id: 'q-mobile-viewport',
    navLabel: '移动端 viewport',
    question: '移动端 H5 适配 viewport 和布局要注意什么？',
    questionNote: 'device-width、flex/rem，避免整页 scale。',
    answer: [
      [
        { type: 'strong', value: '一句话：' },
        { type: 'text', value: '先对齐设备宽度，再用弹性布局 + rem/vw，别只靠整页缩放。' },
      ],
      [
        { type: 'text', value: '1、' },
        { type: 'code', value: 'width=device-width, initial-scale=1' },
        { type: 'text', value: ' 是基线。' },
      ],
      [
        { type: 'text', value: '2、布局用 flex/grid + ' },
        { type: 'code', value: 'rem' },
        { type: 'text', value: '；750 稿可用 postcss-pxtorem 或 vw，注意最小字号。' },
      ],
      [
        { type: 'text', value: '3、触摸目标 ≥ 44px；1px 与安全区见同章相关题。' },
      ],
    ],
  },
  'q-safe-area',
)
save(html.path, html.data)

// scenario expansions
const sc = load('scenario')
const err = sc.data.items.find((x) => x.id === 'q-error')
if (err && !JSON.stringify(err.answer).includes('error', 0)) {
  /* noop */
}
if (err && !JSON.stringify(err.answer).includes('捕获阶段')) {
  err.answer.push([
    { type: 'text', value: '4、资源失败用捕获阶段 ' },
    { type: 'code', value: "addEventListener('error', fn, true)" },
    { type: 'text', value: '；上报采样、去重、限流，防错误风暴。' },
  ])
}
const tel = sc.data.items.find((x) => x.id === 'q-telemetry')
if (tel && !JSON.stringify(tel.answer).includes('IntersectionObserver')) {
  tel.answer.push([
    { type: 'text', value: '3、曝光埋点：' },
    { type: 'code', value: 'IntersectionObserver' },
    { type: 'text', value: ' 可见比例 + 停留时长再上报，与 RUM 字段分开。' },
  ])
}
const i18n = sc.data.items.find((x) => x.id === 'q-i18n-rtl')
if (i18n && !JSON.stringify(i18n.answer).includes('vue-i18n')) {
  i18n.answer.push([
    { type: 'text', value: '4、语言包工程化见「国际化工程化」；Vue ' },
    { type: 'code', value: 'vue-i18n' },
    { type: 'text', value: '，React ' },
    { type: 'code', value: 'react-i18next' },
    { type: 'text', value: '。' },
  ])
}
// scenario: AI 流式对话（紧挨 SSE/WebSocket）
upsertItem(
  sc.data.items,
  {
    id: 'q-ai-stream-chat',
    navLabel: '流式对话输出',
    question: '大模型对话里的「逐字输出」，前后端各自做了什么？',
    questionNote:
      '服务端流式推 token/chunk；前端 ReadableStream 或 SSE 增量拼文案，别和纯前端打字机动画混淆。',
    answer: [
      [
        { type: 'strong', value: '一句话：' },
        {
          type: 'text',
          value:
            '不是等整段生成完再显示，而是模型边算边通过 HTTP 流/SSE 推片段，前端边收边 append 到气泡里。',
        },
      ],
      [
        { type: 'text', value: '1、' },
        { type: 'strong', value: '服务端' },
        { type: 'text', value: '：接口开 stream（如 ' },
        { type: 'code', value: 'stream: true' },
        { type: 'text', value: '），按 token 或一小段文本写出；常见形态是 ' },
        { type: 'code', value: 'text/event-stream' },
        { type: 'text', value: '（SSE）或分块传输（chunked）的 JSON 行。' },
      ],
      [
        { type: 'text', value: '2、' },
        { type: 'strong', value: '前端收流' },
        { type: 'text', value: '：' },
        { type: 'code', value: 'fetch' },
        { type: 'text', value: ' 后对 ' },
        { type: 'code', value: 'response.body.getReader()' },
        { type: 'text', value: ' 循环 ' },
        { type: 'code', value: 'read()' },
        { type: 'text', value: '，用 ' },
        { type: 'code', value: 'TextDecoder' },
        { type: 'text', value: ' 解码；或 ' },
        { type: 'code', value: 'EventSource' },
        { type: 'text', value: ' 接 SSE。解析每行 ' },
        { type: 'code', value: 'data: {...}' },
        { type: 'text', value: '，把 delta 拼到当前消息 state。' },
      ],
      [
        { type: 'text', value: '3、' },
        { type: 'strong', value: '和「打字机」的区别' },
        { type: 'text', value: '：真流式是网络层陆续到达；若全文已返回再用 ' },
        { type: 'code', value: 'setInterval' },
        { type: 'text', value: ' 逐字展示只是动效，不能降低首字等待时间。' },
      ],
      [
        { type: 'text', value: '4、体验：' },
        { type: 'code', value: 'AbortController' },
        { type: 'text', value: ' 可停止生成；滚动条跟到底；失败要区分用户取消与断流重试。通道选型见「SSE 与 WebSocket」。' },
      ],
    ],
  },
  'q-sse-ws',
)
save(sc.path, sc.data)

console.log('expand-cross-topic-qa: done')
