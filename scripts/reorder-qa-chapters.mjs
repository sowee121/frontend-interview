/**
 * 按知识点聚合 + 由易到难重排各章 items。
 * 用法: node scripts/reorder-qa-chapters.mjs
 *
 * 每章 order 须列全当前全部 id；未列入的会 warn 并挂到末尾。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonDir = join(__dirname, '../src/data/qa/json')

/** @type {Record<string, { order: string[] }>} */
const CHAPTERS = {
  'html-css': {
    order: [
      // 文档与盒模型
      'q-semantic',
      'q-box',
      // 布局：易 → 难
      'q-flex',
      'q-vertical-center',
      'q-grid',
      'q-two-three-column',
      'q-position',
      'q-bfc',
      // 选择器与层叠 / 显隐动效
      'q-specificity',
      'q-stacking',
      'q-hide-element',
      'q-text-ellipsis',
      'q-anim-transition',
      'q-dark-mode',
      // 移动端
      'q-mobile-viewport',
      'q-rem-em',
      'q-mobile-1px',
      'q-safe-area',
      // 工程化 CSS
      'q-css-preprocessor',
      'q-tailwind',
    ],
  },
  javascript: {
    order: [
      // 类型与比较
      'q-null-undefined',
      'q-loose-equality',
      'q-type-detection',
      'q-float-precision',
      // 作用域与闭包
      'q-hoisting',
      'q-execution-context',
      'q-closure',
      // 原型与 this
      'q-new',
      'q-proto',
      'q-call-bind',
      'q-this',
      // 异步与事件
      'q-eventloop',
      'q-async-try-catch',
      'q-debounce',
      'q-event-delegation',
      'q-target-current',
      'q-memory-leak',
      // 设计模式（稍难）
      'q-observer-pubsub',
      'q-singleton',
      'q-solid',
    ],
  },
  es6: {
    order: [
      'q-let-const-tdz',
      'q-destructuring',
      'q-arrow-and-params',
      'q-optional-nullish',
      'q-symbol',
      'q-set-map',
      'q-weakmap',
      'q-copy',
      'q-for-in-of',
      'q-generator',
      'q-promise',
      'q-promise-chain-error',
      'q-async-await',
      'q-cancel-promise',
      'q-class',
      'q-proxy-reflect',
      'q-dynamic-import',
    ],
  },
  typescript: {
    order: [
      'q-why',
      'q-basic-types',
      'q-optional-union',
      'q-type-interface',
      'q-enum',
      'q-any-unknown',
      'q-never-void',
      'q-type-narrowing',
      'q-type-assertion',
      'q-generics',
      'q-utility',
      'q-strict-config',
      'q-module-declare',
    ],
  },
  vue: {
    order: [
      // Vue2 响应式与生命周期
      'q-vue2-reactivity-core',
      'q-vue2-set-delete',
      'q-vue2-array-reactive',
      'q-reactivity-track',
      'q-vue2-lifecycle',
      'q-vue2-nexttick',
      'q-vue2-computed-watch',
      // Vue2 组件与通信
      'q-vue2-vmodel',
      'q-vif-vfor',
      'q-slot',
      'q-vue2-communication',
      'q-vue2-keepalive',
      'q-vue-vdom-key',
      'q-style-deep',
      'q-vue2-vuex',
      // Vue3
      'q-vue3-vs-vue2-overview',
      'q-ref-reactive',
      'q-composition',
      'q-lifecycle-composition',
      'q-script-setup-define-props',
      'q-teleport',
      'q-pinia',
    ],
  },
  react: {
    order: [
      'q-hooks',
      'q-key',
      'q-controlled',
      'q-setstate-batch',
      'q-synthetic-event',
      'q-effect',
      'q-hooks-stale-closure',
      'q-use-layout-effect',
      'q-memo',
      'q-context',
      'q-use-reducer',
      'q-redux',
      'q-zustand',
      'q-forward-ref',
      'q-portal',
      'q-error-boundary',
      'q-suspense-lazy',
      'q-react18-strict',
      'q-fiber',
    ],
  },
  miniprogram: {
    order: [
      'q-mp-vs-h5',
      'q-mp-architecture',
      'q-mp-lifecycle',
      'q-mp-routing',
      'q-mp-setdata',
      'q-mp-component',
      'q-mp-login',
      'q-mp-request',
      'q-mp-storage',
      'q-mp-share',
      'q-mp-subpackage',
      'q-mp-performance',
      'q-mp-taro-uni',
      'q-mp-taro',
      'q-mp-uniapp',
      'q-mp-cloud-overview',
      'q-mp-cloud-function',
      'q-mp-cloud-db',
    ],
  },
  electron: {
    order: [
      'q-electron-why',
      'q-electron-process',
      'q-electron-security',
      'q-electron-ipc',
      'q-electron-pack',
      'q-electron-update',
      'q-electron-kiosk',
    ],
  },
  browser: {
    order: [
      'q-url',
      'q-defer-async',
      'q-repaint',
      'q-event-flow',
      'q-storage',
      'q-indexeddb',
      'q-cookie-samesite',
      'q-httponly',
      'q-cookie-session',
      'q-sop',
      'q-iframe-security',
      'q-cross-tab',
      'q-intersection-resize',
      'q-web-worker',
      'q-ric',
      'q-sw-pwa',
    ],
  },
  network: {
    order: [
      'q-dns',
      'q-get-post',
      'q-http-versions',
      'q-head-of-line',
      'q-http3',
      'q-https',
      'q-cache',
      'q-cdn',
      'q-redirect-codes',
      'q-cors',
      'q-preflight',
      'q-xss-csrf',
      'q-csp',
      'q-clickjacking',
      'q-jwt-basics',
      'q-biz-login-code',
      'q-fetch-abort',
      'q-websocket-basics',
    ],
  },
  performance: {
    order: [
      'q-perf-overview',
      'q-white-screen',
      'q-longtask',
      'q-gpu-composite',
      'q-image',
      'q-lazyload',
      'q-code-split',
      'q-long-list',
      'q-resource-hints',
      'q-third-party',
      'q-monitor',
      'q-observability',
    ],
  },
  engineering: {
    order: [
      'q-module',
      'q-vite-webpack',
      'q-loader-plugin',
      'q-hmr',
      'q-tree-shaking',
      'q-babel-swc',
      'q-sourcemap',
      'q-env-mode',
      'q-pnpm',
      'q-monorepo',
      'q-husky',
      'q-git-collab',
      'q-ci-quality',
      'q-frontend-test',
      'q-micro',
      'q-deploy-static',
      'q-sri',
      'q-release-gray',
    ],
  },
  scenario: {
    order: [
      'q-mvc-mvp-mvvm',
      'q-debounce-search',
      'q-infinite',
      'q-auth',
      'q-route-guard',
      'q-idempotent-submit',
      'q-upload-big',
      'q-fcp',
      'q-ssr-ssg',
      'q-error',
      'q-telemetry',
      'q-rich-text-xss',
      'q-multi-tab-sync',
      'q-ws-reconnect',
      'q-sse-ws',
      'q-saas-zero-to-one',
    ],
  },
  project: {
    order: [
      // 请求与鉴权
      'q-proj-request-layer',
      'q-proj-token-refresh',
      'q-proj-anti-replay',
      'q-proj-hybrid-login',
      'q-proj-micro-auth',
      'q-proj-rbac',
      // 多端与工程
      'q-proj-webview-sdk',
      'q-proj-monorepo-share',
      'q-proj-mp-ci',
      'q-proj-electron-delivery',
      'q-proj-kiosk-device',
      'q-proj-standard-custom',
      // 业务与实时
      'q-proj-order-state',
      'q-proj-order-sync',
      'q-proj-exam-state',
      'q-proj-ws-push',
      'q-proj-cs-realtime',
      'q-proj-sse-assistant',
      // UI / 配置化
      'q-proj-virtual-table',
      'q-proj-dynamic-form',
      'q-proj-tenant-theme',
      'q-proj-i18n',
      'q-proj-echarts',
      'q-proj-print',
    ],
  },
  coding: {
    order: [
      // 类型与原型手写
      'q-impl-get-type',
      'q-impl-instanceof',
      'q-impl-call-apply',
      'q-impl-bind',
      'q-impl-new',
      // 数据结构
      'q-impl-flatten',
      'q-impl-deep-clone',
      'q-impl-is-equal',
      'q-impl-list-tree',
      'q-impl-curry',
      // 防抖节流
      'q-impl-debounce',
      'q-impl-throttle',
      // Promise 族
      'q-impl-my-promise-lite',
      'q-impl-promise-race',
      'q-impl-promise-all',
      'q-impl-promise-allsettled',
      'q-impl-serial-async',
      'q-impl-concurrency',
      'q-impl-retry',
      // 事件
      'q-impl-event-emitter',
    ],
  },
  backend: {
    order: [
      'q-be-overview',
      'q-be-http-flow',
      'q-node-vs-browser',
      'q-node-event-loop',
      'q-stream-buffer',
      'q-node-middleware',
      'q-node-bff',
      'q-node-env',
      'q-node-security',
      'q-be-node-vs-python',
      'q-be-mysql-sqlite',
      'q-be-sql-basics',
      'q-be-pool-tx',
      'q-be-index',
      'q-be-acid',
      'q-be-db-lock',
      'q-be-sharding',
      'q-be-redis',
      'q-be-cache-problems',
      'q-be-cache-consistency',
      'q-be-mq',
      'q-be-idempotent',
      'q-be-rate-limit',
      'q-be-log-trace',
      'q-be-lb',
      'q-be-microservice',
      'q-be-rest-rpc',
      'q-be-api-agree',
    ],
  },
  ai: {
    order: [
      'q-ai-chat-e2e',
      'q-ai-stream-why-sse',
      'q-ai-stream-post-sse',
      'q-ai-stream-protocol',
      'q-ai-stream-append',
      'q-ai-reasoning-block',
      'q-ai-markdown-stream',
      'q-ai-stream-idle',
      'q-ai-stream-session',
      'q-ai-context-filter',
      'q-ai-stream-ux',
    ],
  },
  agent: {
    order: [
      'q-ai-complete-vs-agent',
      'q-ai-prompt',
      'q-ai-context',
      'q-ai-rules',
      'q-ai-review-code',
      'q-ai-hallucination',
      'q-ai-security',
      'q-ai-mcp',
      'q-agent-loop',
      'q-agent-plan-mode',
      'q-agent-hitl',
    ],
  },
}

function reorderChapter(fileBase, config) {
  const path = join(jsonDir, `${fileBase}.json`)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const byId = new Map(data.items.map((item) => [item.id, item]))

  const ordered = []
  const used = new Set()

  for (const id of config.order) {
    const item = byId.get(id)
    if (item) {
      ordered.push(item)
      used.add(id)
    } else {
      console.warn(`[${fileBase}] missing id in source: ${id}`)
    }
  }

  for (const [id, item] of byId) {
    if (!used.has(id)) {
      console.warn(`[${fileBase}] appended unordered item: ${id}`)
      ordered.push(item)
    }
  }

  if (ordered.length !== config.order.length || ordered.length !== byId.size) {
    console.warn(
      `[${fileBase}] count mismatch: order=${config.order.length} source=${byId.size} result=${ordered.length}`,
    )
  }

  data.items = ordered
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`✓ ${fileBase}.json → ${ordered.length} items`)
}

for (const [fileBase, config] of Object.entries(CHAPTERS)) {
  reorderChapter(fileBase, config)
}
