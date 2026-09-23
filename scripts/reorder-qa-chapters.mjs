/**
 * 按知识点聚合 + 由易到难重排各章 items，并合并新增题目。
 * 用法: node scripts/reorder-qa-chapters.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonDir = join(__dirname, '../src/data/qa/json')

/** @type {Record<string, { order: string[], newItems?: object[] }>} */
const CHAPTERS = {
  typescript: {
    order: [
      'q-why',
      'q-type-interface',
      'q-any-unknown',
      'q-type-narrowing',
      'q-generics',
      'q-utility',
      'q-strict-config',
      'q-module-declare',
      'q-basic-types',
      'q-optional-union',
    ],
    newItems: [
      {
        id: 'q-type-narrowing',
        navLabel: '类型收窄',
        question: 'TypeScript 类型收窄（narrowing）常见手段有哪些？',
        answer: [
          [
            { type: 'text', value: '在分支里把宽类型缩成更具体的类型，TS 才能安全访问属性。常见手段：' },
            { type: 'code', value: 'typeof x === "string"' },
            { type: 'text', value: '、' },
            { type: 'code', value: 'Array.isArray(x)' },
            { type: 'text', value: '、' },
            { type: 'code', value: 'x instanceof Date' },
            { type: 'text', value: '、' },
            { type: 'code', value: 'in' },
            { type: 'text', value: ' 操作符（' },
            { type: 'code', value: '"name" in obj' },
            { type: 'text', value: '）、可辨识联合的 ' },
            { type: 'code', value: 'switch (x.status)' },
            { type: 'text', value: '。' },
          ],
          [
            { type: 'text', value: '自定义守卫：' },
            { type: 'code', value: 'function isUser(x: unknown): x is User { return ... }' },
            { type: 'text', value: '；断言 ' },
            { type: 'code', value: 'as' },
            { type: 'text', value: ' / ' },
            { type: 'code', value: '!' },
            { type: 'text', value: ' 是逃生舱，面试应说「优先用收窄，断言要有依据」。接接口数据可配合 zod 等运行时校验再收窄。' },
          ],
        ],
      },
    ],
  },
  'html-css': {
    order: [
      'q-semantic',
      'q-box',
      'q-flex',
      'q-grid',
      'q-position',
      'q-bfc',
      'q-specificity',
      'q-stacking',
      'q-dark-mode',
      'q-mobile-1px',
      'q-safe-area',
      'q-mobile-viewport',
      'q-rem-em',
      'q-css-preprocessor',
      'q-tailwind',
    ],
    newItems: [
      {
        id: 'q-rem-em',
        navLabel: 'rem / em / vw',
        question: 'rem、em、vw/vh 分别适合什么场景？',
        answer: [
          [
            { type: 'code', value: 'rem' },
            { type: 'text', value: '：相对根元素 ' },
            { type: 'code', value: 'html' },
            { type: 'text', value: ' 的 font-size，改一处可整体缩放，适合间距、字号体系。' },
            { type: 'code', value: 'em' },
            { type: 'text', value: '：相对当前元素或父级 font-size，嵌套组件内 padding 会层层放大，要小心。' },
          ],
          [
            { type: 'code', value: 'vw/vh' },
            { type: 'text', value: '：相对视口宽高，全屏 Hero、移动端 100vh 常见；注意移动端地址栏导致 ' },
            { type: 'code', value: '100vh' },
            { type: 'text', value: ' 溢出，可用 ' },
            { type: 'code', value: 'dvh/svh' },
            { type: 'text', value: " 或 JS 变量 '--vh'" },
            { type: 'text', value: ' 兜底。' },
          ],
        ],
      },
    ],
  },
  browser: {
    order: [
      'q-url',
      'q-defer-async',
      'q-repaint',
      'q-event-flow',
      'q-storage',
      'q-cookie-samesite',
      'q-cross-tab',
      'q-sop',
      'q-web-worker',
      'q-intersection-resize',
      'q-indexeddb',
    ],
    newItems: [
      {
        id: 'q-indexeddb',
        navLabel: 'IndexedDB',
        question: 'IndexedDB 和 localStorage 怎么选？',
        answer: [
          [
            { type: 'code', value: 'localStorage' },
            { type: 'text', value: '：同步 API、字符串键值、容量约 5～10MB，适合主题、简单配置。' },
            { type: 'code', value: 'IndexedDB' },
            { type: 'text', value: '：异步、可存对象/Blob、容量大得多，适合离线缓存大量结构化数据、草稿、媒体。' },
          ],
          [
            { type: 'text', value: '操作通过 ' },
            { type: 'code', value: 'indexedDB.open' },
            { type: 'text', value: ' + 事务；可用 Dexie 等封装。Service Worker 离线包、PWA 常配合 IndexedDB；注意版本迁移与配额超限处理。' },
          ],
        ],
      },
    ],
  },
  network: {
    order: [
      'q-dns',
      'q-http-versions',
      'q-https',
      'q-get-post',
      'q-cache',
      'q-cors',
      'q-preflight',
      'q-jwt-basics',
      'q-xss-csrf',
      'q-fetch-abort',
      'q-websocket-basics',
      'q-biz-login-code',
    ],
    newItems: [
      {
        id: 'q-fetch-abort',
        navLabel: 'AbortController',
        question: 'fetch 怎么取消请求？竞态怎么处理？',
        answer: [
          [
            { type: 'code', value: 'const ctrl = new AbortController(); fetch(url, { signal: ctrl.signal }); ctrl.abort()' },
            { type: 'text', value: ' 会 reject，需在 catch 里区分用户取消与真实错误（' },
            { type: 'code', value: 'e.name === "AbortError"' },
            { type: 'text', value: '）。' },
          ],
          [
            { type: 'text', value: '搜索框、路由切换：每次新请求 abort 上一次，或维护递增 requestId，响应回来时比对 id 再 setState，避免慢请求覆盖新结果。React Strict Mode 双挂载时注意清理。' },
          ],
        ],
      },
    ],
  },
  performance: {
    order: [
      'q-longtask',
      'q-image',
      'q-code-split',
      'q-long-list',
      'q-third-party',
      'q-monitor',
      'q-observability',
      'q-resource-hints',
      'q-perf-overview',
      'q-white-screen',
      'q-lazyload',
    ],
    newItems: [
      {
        id: 'q-resource-hints',
        navLabel: '资源提示',
        question: 'dns-prefetch、preconnect、preload、prefetch 怎么选？',
        answer: [
          [
            { type: 'code', value: 'dns-prefetch' },
            { type: 'text', value: '：仅解析 DNS；' },
            { type: 'code', value: 'preconnect' },
            { type: 'text', value: '：DNS + TCP + TLS，适合马上要用第三方 API/CDN。' },
            { type: 'code', value: 'preload' },
            { type: 'text', value: '：高优先级拉本页关键资源（LCP 图、关键 CSS）；' },
            { type: 'code', value: 'prefetch' },
            { type: 'text', value: '：空闲时预取下一路由 chunk。' },
          ],
          [
            { type: 'text', value: '滥用 preload 会抢带宽；' },
            { type: 'code', value: 'as' },
            { type: 'text', value: ' 类型必须与真实请求一致。与网络安全章的 DNS/TLS 优化可一起答。' },
          ],
        ],
      },
    ],
  },
  engineering: {
    order: [
      'q-module',
      'q-vite-webpack',
      'q-tree-shaking',
      'q-env-mode',
      'q-sourcemap',
      'q-pnpm',
      'q-monorepo',
      'q-husky',
      'q-git-collab',
      'q-ci-quality',
      'q-frontend-test',
      'q-micro',
      'q-babel-swc',
      'q-deploy-static',
      'q-release-gray',
    ],
    newItems: [
      {
        id: 'q-babel-swc',
        navLabel: 'Babel 与 SWC',
        question: 'Babel 和 SWC/esbuild 在工程里各干什么？',
        answer: [
          [
            { type: 'text', value: '它们做语法降级与部分转换：把 JSX、TypeScript、新语法转成目标环境能跑的 JS。' },
            { type: 'code', value: 'Babel' },
            { type: 'text', value: ' 插件生态最全，定制 AST 转换方便；' },
            { type: 'code', value: 'SWC/esbuild' },
            { type: 'text', value: ' 用 Rust/Go 实现，' },
            { type: 'strong', value: '编译快' },
            { type: 'text', value: '，Vite 开发态常用 esbuild 转 TS。' },
          ],
          [
            { type: 'text', value: '类型检查仍靠 ' },
            { type: 'code', value: 'tsc' },
            { type: 'text', value: ' / ' },
            { type: 'code', value: 'vue-tsc' },
            { type: 'text', value: "，Babel 默认不擦类型需 @babel/preset-typescript 只剥类型。生产打包 tree-shaking 在 bundler 阶段，不是 Babel 单独完成。" },
          ],
        ],
      },
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
      'q-mp-subpackage',
      'q-mp-performance',
      'q-mp-share',
      'q-mp-taro-uni',
      'q-mp-taro',
      'q-mp-uniapp',
      'q-mp-cloud-overview',
      'q-mp-cloud-function',
      'q-mp-cloud-db',
    ],
  },
  react: {
    order: [
      'q-hooks',
      'q-key',
      'q-controlled',
      'q-setstate-batch',
      'q-memo',
      'q-effect',
      'q-use-layout-effect',
      'q-context',
      'q-use-reducer',
      'q-redux',
      'q-zustand',
      'q-forward-ref',
      'q-portal',
      'q-suspense-lazy',
      'q-react18-strict',
      'q-fiber',
    ],
  },
  vue: {
    order: [
      'q-ref-reactive',
      'q-composition',
      'q-teleport',
      'q-style-deep',
      'q-reactivity-track',
      'q-vue2-lifecycle',
      'q-vue2-reactivity-core',
      'q-vue2-set-delete',
      'q-vue2-array-reactive',
      'q-vue2-communication',
      'q-vue2-vuex',
      'q-vue2-vmodel',
      'q-vue2-computed-watch',
      'q-vue2-nexttick',
      'q-vue2-keepalive',
      'q-vue-vdom-key',
      'q-vue3-vs-vue2-overview',
      'q-lifecycle-composition',
      'q-script-setup-define-props',
      'q-pinia',
    ],
    newItems: [
      {
        id: 'q-reactivity-track',
        navLabel: '依赖收集',
        question: 'Vue 3 响应式「依赖收集」面试怎么说？',
        answer: [
          [
            { type: 'code', value: 'reactive' },
            { type: 'text', value: ' 用 Proxy 拦截 get/set；组件 render 或 ' },
            { type: 'code', value: 'computed' },
            { type: 'text', value: ' 执行时访问到的属性会 ' },
            { type: 'strong', value: 'track' },
            { type: 'text', value: ' 到当前活跃的 effect；属性变更时 ' },
            { type: 'code', value: 'trigger' },
            { type: 'text', value: ' 通知相关 effect 重新跑。' },
          ],
          [
            { type: 'code', value: 'ref' },
            { type: 'text', value: ' 包一层对象，.value 读写走同一套；' },
            { type: 'code', value: 'WeakMap' },
            { type: 'text', value: ' 关联原始对象与代理。不必背每一行源码，能说清「get 收集、set 触发、effect 调度 + 组件更新队列」即可。' },
          ],
        ],
      },
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
  scenario: {
    order: [
      'q-debounce-search',
      'q-infinite',
      'q-error',
      'q-fcp',
      'q-auth',
      'q-route-guard',
      'q-idempotent-submit',
      'q-upload-big',
      'q-ws-reconnect',
      'q-sse-ws',
      'q-multi-tab-sync',
      'q-rich-text-xss',
      'q-telemetry',
      'q-ssr-ssg',
      'q-saas-zero-to-one',
    ],
  },
  coding: {
    order: [
      'q-impl-promise-race',
      'q-impl-promise-all',
      'q-impl-promise-allsettled',
      'q-impl-serial-async',
      'q-impl-retry',
      'q-impl-my-promise-lite',
      'q-impl-get-type',
      'q-impl-call-apply',
      'q-impl-bind',
      'q-impl-new',
      'q-impl-instanceof',
      'q-impl-is-equal',
      'q-impl-curry',
      'q-impl-debounce',
      'q-impl-throttle',
      'q-impl-flatten',
      'q-impl-deep-clone',
      'q-impl-event-emitter',
    ],
  },
  javascript: {
    order: [
      'q-null-undefined',
      'q-loose-equality',
      'q-type-detection',
      'q-hoisting',
      'q-execution-context',
      'q-closure',
      'q-new',
      'q-proto',
      'q-call-bind',
      'q-this',
      'q-eventloop',
      'q-debounce',
      'q-float-precision',
      'q-event-delegation',
      'q-memory-leak',
    ],
  },
  backend: {
    order: [
      'q-be-overview',
      'q-be-http-flow',
      'q-node-vs-browser',
      'q-node-event-loop',
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
      'q-be-mq',
      'q-be-cache-consistency',
      'q-be-idempotent',
      'q-be-rate-limit',
      'q-be-log-trace',
      'q-be-lb',
      'q-be-microservice',
      'q-be-rest-rpc',
      'q-be-api-agree',
    ],
  },
  es6: {
    order: [
      'q-let-const-tdz',
      'q-destructuring',
      'q-arrow-and-params',
      'q-set-map',
      'q-weakmap',
      'q-copy',
      'q-for-in-of',
      'q-promise',
      'q-promise-chain-error',
      'q-async-await',
      'q-class',
      'q-proxy-reflect',
      'q-dynamic-import',
      'q-optional-nullish',
    ],
  },
}

function reorderChapter(fileBase, config) {
  const path = join(jsonDir, `${fileBase}.json`)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const byId = new Map(data.items.map((item) => [item.id, item]))

  for (const item of config.newItems ?? []) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item)
    }
  }

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

  data.items = ordered
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log(`✓ ${fileBase}.json → ${ordered.length} items`)
}

for (const [fileBase, config] of Object.entries(CHAPTERS)) {
  reorderChapter(fileBase, config)
}
