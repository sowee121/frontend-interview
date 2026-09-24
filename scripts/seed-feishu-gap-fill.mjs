/**
 * 飞书差缺补漏：将精选 40 题写入现有章（自写答案，不照抄飞书）。
 * 用法: node scripts/seed-feishu-gap-fill.mjs
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

function upsert(items, item) {
  const i = items.findIndex((x) => x.id === item.id)
  if (i >= 0) items[i] = item
  else items.push(item)
}

function p(...segs) {
  return segs
}

function t(value) {
  return { type: 'text', value }
}
function s(value) {
  return { type: 'strong', value }
}
function c(value) {
  return { type: 'code', value }
}

/** @type {Record<string, object[]>} */
const byChapter = {
  javascript: [
    {
      id: 'q-observer-pubsub',
      navLabel: '观察者与发布订阅',
      question: '观察者模式和发布订阅模式有何区别？前端常见落点是什么？',
      answer: [
        p(s('要点：'), t('观察者是主题直接通知观察者；发布订阅多一层调度中心，发布者与订阅者互不持有对方引用。')),
        p(t('1、观察者：被观察对象维护观察者列表，状态变化时同步调用；耦合在「认识彼此」这一层。')),
        p(t('2、发布订阅：双方只跟事件总线打交道，按事件名注册与派发，更易跨模块解耦。')),
        p(t('3、前端：'), c('EventTarget'), t(' / 自定义事件偏观察者；全局 event bus、消息中间件偏发布订阅。')),
      ],
    },
    {
      id: 'q-solid',
      navLabel: 'SOLID 原则',
      question: 'SOLID 五原则分别指什么？前端落地时怎么理解？',
      answer: [
        p(s('要点：'), t('五条面向对象设计原则，前端多落在模块边界、组件职责与依赖方向，而不是机械套类图。')),
        p(t('1、单一职责：一个模块只改一类原因，页面容器与纯展示拆开。')),
        p(t('2、开闭：优先扩展（策略、插件）而非改已有分支堆 if。')),
        p(t('3、里氏替换：子类型可替换父类型而不破坏约定，Hooks/组合优于脆弱继承树。')),
        p(t('4、接口隔离：组件 props / 服务 API 按场景拆细，避免上帝接口。')),
        p(t('5、依赖倒置：业务依赖抽象（接口、注入），细节（请求实现、存储）可替换。')),
      ],
    },
    {
      id: 'q-singleton',
      navLabel: '单例模式',
      question: '什么是单例模式？前端哪些场景会用到？',
      answer: [
        p(s('要点：'), t('保证某类全局只有一个实例，并提供统一访问入口。')),
        p(t('1、常见写法：模块顶级导出一份实例；或惰性创建（首次调用再 new）。')),
        p(t('2、场景：全局弹层/Toast 管理、请求层 axios 实例、少量真正的全局配置。')),
        p(t('3、边界：状态会随用户变化的对象慎用单例，易造成串数据；测试时注意重置。')),
      ],
    },
    {
      id: 'q-target-current',
      navLabel: 'target 与 currentTarget',
      question: '事件对象里 target 和 currentTarget 有何区别？',
      answer: [
        p(s('要点：'), t('target 是触发事件的源头节点；currentTarget 是当前正在处理监听的节点（绑定处）。')),
        p(t('1、委托场景：监听挂在父节点，'), c('e.target'), t(' 可能是子节点，'), c('e.currentTarget'), t(' 始终是父节点。')),
        p(t('2、回调里若异步再读事件对象，部分浏览器会清空字段，需先取出需要的引用。')),
      ],
    },
    {
      id: 'q-async-try-catch',
      navLabel: '异步错误捕获',
      question: 'try/catch 能否捕获异步错误？正确做法是什么？',
      answer: [
        p(s('要点：'), t('同步 try/catch 抓不到已离开当前调用栈的异步错误；要在 Promise 链或 async 函数内捕获。')),
        p(t('1、'), c('setTimeout'), t(' / 未 await 的 Promise 抛错不会进入外层 try。')),
        p(t('2、'), c('async'), t(' 函数内对 '), c('await'), t(' 用 try/catch，或 '), c('.catch()'), t('；未处理拒绝可听 '), c('unhandledrejection'), t('。')),
        p(t('3、事件回调里的抛错需在回调内处理，或统一包一层错误边界/上报。')),
      ],
    },
  ],
  scenario: [
    {
      id: 'q-mvc-mvp-mvvm',
      navLabel: 'MVC MVP MVVM',
      question: 'MVC、MVP、MVVM 分别如何分工？前端为何常谈 MVVM？',
      answer: [
        p(s('要点：'), t('三者都拆视图与数据，差异在「谁更新视图、中间层职责多重」。')),
        p(t('1、MVC：Controller 接收输入，改 Model，View 观察 Model 或由 Controller 刷新。')),
        p(t('2、MVP：Presenter 更厚，View 尽量被动，测试时常替身 View。')),
        p(t('3、MVVM：ViewModel 暴露状态与命令，经绑定与 View 同步；Vue/React 数据驱动接近这一思路。')),
        p(t('4、单页里关键是单向数据流与可测的状态层，不必纠结标签名。')),
      ],
    },
  ],
  network: [
    {
      id: 'q-csp',
      navLabel: 'CSP',
      question: '内容安全策略（CSP）解决什么问题？怎么配？',
      answer: [
        p(s('要点：'), t('内容安全策略（CSP）用白名单限制脚本、样式、连接等来源，降低 XSS 注入后的危害面。')),
        p(t('1、常见头：'), c('Content-Security-Policy'), t('；也可用 '), c('<meta http-equiv>'), t('（能力较少）。')),
        p(t('2、指令如 '), c('script-src'), t('、'), c('default-src'), t('；开发可先 '), c('Content-Security-Policy-Report-Only'), t(' 收集违规。')),
        p(t('3、与转义、HttpOnly Cookie 互补：CSP 挡「跑起来的脚本」，不能替代输入消毒。')),
      ],
    },
    {
      id: 'q-clickjacking',
      navLabel: '点击劫持',
      question: '什么是点击劫持？如何防范？',
      answer: [
        p(s('要点：'), t('攻击页用透明 iframe 覆盖诱导按钮，用户以为点的是可见 UI，实际点到了被嵌页面的敏感操作。')),
        p(t('1、响应头 '), c('X-Frame-Options: DENY'), t(' 或 '), c('SAMEORIGIN'), t(' 限制被嵌。')),
        p(t('2、CSP 的 '), c('frame-ancestors'), t(' 更灵活，可列允许嵌套的父页面来源。')),
        p(t('3、敏感操作加二次确认、关键作校验来源，降低误点后果。')),
      ],
    },
    {
      id: 'q-http3',
      navLabel: 'HTTP/3',
      question: 'HTTP/3 相对 HTTP/2 主要改进是什么？',
      answer: [
        p(s('要点：'), t('HTTP/3 基于快速 UDP 互联网连接（QUIC），跑在 UDP 上，连接迁移与多路复用更抗丢包。')),
        p(t('1、HTTP/2 多路复用仍受单条 TCP 丢包队头阻塞；QUIC 流之间更独立。')),
        p(t('2、常结合传输层安全协议（TLS）1.3，握手往返更少；弱网切换时连接迁移更友好。')),
        p(t('3、落地看内容分发网络（CDN）/网关是否开启；前端仍用 '), c('fetch'), t(' / '), c('XHR'), t('，由协议栈协商。')),
      ],
    },
    {
      id: 'q-head-of-line',
      navLabel: '队头阻塞',
      question: 'HTTP 队头阻塞指什么？HTTP/1.1 与 HTTP/2 如何缓解？',
      answer: [
        p(s('要点：'), t('队头阻塞指前面的请求/响应占住通道，后面的被卡住；要分清应用层与传输层。')),
        p(t('1、HTTP/1.1：同连接上响应须按请求顺序，常用多连接或管线化（坑多）缓解。')),
        p(t('2、HTTP/2：一连接多路流，应用层不再互相堵；但 TCP 丢包仍可能拖住整连接。')),
        p(t('3、HTTP/3 / QUIC 进一步减轻传输层队头阻塞。')),
      ],
    },
    {
      id: 'q-cdn',
      navLabel: 'CDN',
      question: '内容分发网络（CDN）是什么？静态资源为何常上 CDN？',
      answer: [
        p(s('要点：'), t('内容分发网络（CDN）把资源缓存在边缘节点，用户就近获取，降低延迟与源站压力。')),
        p(t('1、静态 JS/CSS/图、可缓存 API 响应适合；带用户隐私的动态接口慎共用边缘缓存。')),
        p(t('2、配合文件名哈希与长缓存；更新靠换 URL，避免边缘脏缓存难刷。')),
        p(t('3、注意跨域、HTTPS 证书与回源策略；核心接口可保留同源或专线。')),
      ],
    },
    {
      id: 'q-redirect-codes',
      navLabel: '重定向状态码',
      question: '301、302、303、307、308 有何区别？',
      answer: [
        p(s('要点：'), t('都表示换 URI 再请求，差异在是否永久、方法是否允许变成 GET。')),
        p(t('1、301 永久、302 临时；历史实现里不少客户端会把 POST 改成 GET。')),
        p(t('2、303 明确用 GET 去看结果（POST 后跳转结果页常见）。')),
        p(t('3、307/308 保持原方法与正文；308 为永久、307 为临时，语义更严。')),
      ],
    },
  ],
  browser: [
    {
      id: 'q-httponly',
      navLabel: 'HttpOnly',
      question: 'Cookie 的 HttpOnly、Secure 分别做什么？',
      answer: [
        p(s('要点：'), t('HttpOnly 禁止文档脚本读 Cookie；Secure 仅在 HTTPS 请求中携带。')),
        p(t('1、会话标识应设 HttpOnly，降低 XSS 偷 Cookie 的成功率（不能防 CSRF）。')),
        p(t('2、Secure 与 SameSite 常一起配；本地 http 调试时 Secure Cookie 可能带不上。')),
        p(t('3、前端可读的偏好类数据可用 '), c('localStorage'), t(' 等，勿把刷新令牌放非 HttpOnly Cookie 又给 JS 读。')),
      ],
    },
    {
      id: 'q-iframe-security',
      navLabel: 'iframe 安全',
      question: '嵌入 iframe 时有哪些安全注意点？',
      answer: [
        p(s('要点：'), t('iframe 扩大攻击面：点击劫持、跨域脚本、权限逃逸；用沙箱与通信白名单收敛。')),
        p(t('1、'), c('sandbox'), t(' 限制脚本、表单、顶层导航等；按需加 '), c('allow-scripts'), t(' 等令牌。')),
        p(t('2、跨域用 '), c('postMessage'), t(' 时校验 '), c('event.origin'), t('，不信任意来源。')),
        p(t('3、自身页面用 '), c('frame-ancestors'), t(' / '), c('X-Frame-Options'), t(' 防被恶意嵌套。')),
      ],
    },
    {
      id: 'q-cookie-session',
      navLabel: 'Cookie 与 Session',
      question: 'Cookie 和 Session 有何区别？前端鉴权里怎么配合？',
      answer: [
        p(s('要点：'), t('Cookie 是浏览器存的一小段数据；Session 通常指服务端会话状态，常靠 Cookie 里的会话 id 关联。')),
        p(t('1、Cookie 随请求自动带（受域、路径、SameSite 约束）；容量与明文可见性有限。')),
        p(t('2、纯前端存 Token 时常见 '), c('Authorization'), t(' 头；Cookie 方案则依赖 HttpOnly 会话。')),
        p(t('3、选型看 CSRF 面、多端与过期刷新；不要混用两套又互不同步。')),
      ],
    },
    {
      id: 'q-ric',
      navLabel: 'requestIdleCallback',
      question: 'requestIdleCallback 做什么？和 requestAnimationFrame 怎么选？',
      answer: [
        p(s('要点：'), t('requestIdleCallback 在浏览器空闲时跑低优先级任务；requestAnimationFrame 对齐下一帧绘制。')),
        p(t('1、适合上报、预取、非紧急计算；回调带 '), c('timeRemaining'), t('，超时可用 '), c('timeout'), t(' 兜底。')),
        p(t('2、动画与视觉相关更新用 '), c('requestAnimationFrame'), t('，保证跟帧。')),
        p(t('3、Safari 等支持不完整时需降级；框架调度器往往自建优先级，不直接依赖它。')),
      ],
    },
    {
      id: 'q-sw-pwa',
      navLabel: 'Service Worker 与 PWA',
      question: 'Service Worker 是什么？和 PWA 有何关系？',
      answer: [
        p(s('要点：'), t('Service Worker 是独立线程的网络代理脚本，可拦截请求、缓存资源；渐进式 Web 应用（PWA）常靠它做离线与安装体验。')),
        p(t('1、须 HTTPS（localhost 除外）；生命周期含安装、激活、fetch 事件。')),
        p(t('2、策略：缓存优先 / 网络优先 / stale-while-revalidate，按资源类型选。')),
        p(t('3、PWA 还涉及 Web App Manifest、推送等；SW 是能力底座而非全部。')),
      ],
    },
  ],
  engineering: [
    {
      id: 'q-sri',
      navLabel: 'SRI 完整性校验',
      question: '子资源完整性（SRI）是什么？何时使用？',
      answer: [
        p(s('要点：'), t('子资源完整性（SRI）让浏览器校验 CDN 脚本/样式的哈希，防止被篡改仍执行。')),
        p(t('1、标签写 '), c('integrity="sha384-..."'), t('，并配合合适的 '), c('crossorigin'), t('。')),
        p(t('2、哈希与文件内容绑定：发版换文件必须换 integrity，适合版本化第三方库。')),
        p(t('3、不能替代 HTTPS；只保证「拿到的字节是预期的那份」。')),
      ],
    },
    {
      id: 'q-hmr',
      navLabel: 'HMR',
      question: '热模块替换（HMR）大致如何工作？',
      answer: [
        p(s('要点：'), t('热模块替换（HMR）在开发时用 WebSocket 推送变更模块，运行时替换而不整页刷新，尽量保留状态。')),
        p(t('1、构建工具计算受影响模块图，浏览器端执行 '), c('accept'), t(' 回调更新导出。')),
        p(t('2、Vite 基于原生 ESM 按需编译，改动面通常更小；Webpack 依赖生成的 HMR runtime。')),
        p(t('3、不是所有模块都能热替（入口、部分副作用）；失败则回退全量刷新。')),
      ],
    },
    {
      id: 'q-loader-plugin',
      navLabel: 'Loader 与 Plugin',
      question: 'Webpack 里 Loader 和 Plugin 有何区别？',
      answer: [
        p(s('要点：'), t('Loader 转换单个文件内容；Plugin 挂在编译生命周期上做更广的事。')),
        p(t('1、Loader：链路右到左，如把 TS/SCSS 变成 JS/CSS；职责偏「文件进、文件出」。')),
        p(t('2、Plugin：听 '), c('compiler'), t(' / '), c('compilation'), t(' 钩子，做拆包、注入 HTML、压缩等。')),
        p(t('3、Vite 生产链多用 Rollup 插件模型；概念类似「转换」与「构建钩子」。')),
      ],
    },
  ],
  'html-css': [
    {
      id: 'q-two-three-column',
      navLabel: '两栏三栏布局',
      question: '如何实现右侧自适应的两栏、中间自适应的三栏布局？',
      answer: [
        p(s('要点：'), t('固定侧用定宽，自适应侧吃剩余空间；Flex 或 Grid 最直。')),
        p(t('1、两栏：容器 '), c('display:flex'), t('，侧栏定宽，主区 '), c('flex:1'), t('；或 Grid '), c('200px 1fr'), t('。')),
        p(t('2、三栏：左右定宽、中间 '), c('1fr'), t('；注意中间内容 min-width 防撑破。')),
        p(t('3、旧式 float + BFC 也可，维护成本更高，新项目优先 Flex/Grid。')),
      ],
    },
    {
      id: 'q-text-ellipsis',
      navLabel: '文本溢出省略',
      question: '单行和多行文本溢出省略怎么写？',
      answer: [
        p(s('要点：'), t('单行靠 nowrap + ellipsis；多行靠线盒裁剪（-webkit-line-clamp）或定高溢出。')),
        p(t('1、单行：'), c('overflow:hidden; white-space:nowrap; text-overflow:ellipsis'), t('。')),
        p(t('2、多行：'), c('display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:N'), t('，并 '), c('overflow:hidden'), t('。')),
        p(t('3、注意容器要有限宽；与 flex 子项时可能要 '), c('min-width:0'), t('。')),
      ],
    },
    {
      id: 'q-vertical-center',
      navLabel: '垂直居中',
      question: 'CSS 垂直居中有哪些常用写法？',
      answer: [
        p(s('要点：'), t('按是否已知宽高、是否单行，选 Flex/Grid/定位/行高。')),
        p(t('1、Flex：容器 '), c('align-items:center'), t('（主轴横向时）或双轴都 center。')),
        p(t('2、Grid：'), c('place-items:center'), t(' 一行居中。')),
        p(t('3、绝对定位 + '), c('translate(-50%,-50%)'), t('；单行文本也可用相等上下 padding 或 line-height。')),
      ],
    },
    {
      id: 'q-anim-transition',
      navLabel: 'animation 与 transition',
      question: 'animation、transition、transform 分别做什么？',
      answer: [
        p(s('要点：'), t('transform 描述形态变化；transition 在属性变化时过渡；animation 用关键帧做多段动画。')),
        p(t('1、'), c('transform'), t('：位移/缩放/旋转，常走合成层，利于性能。')),
        p(t('2、'), c('transition'), t('：适合 hover、状态切换的起终点过渡。')),
        p(t('3、'), c('animation'), t(' + '), c('@keyframes'), t('：循环、多关键帧、进场动效；可叠加二者。')),
      ],
    },
    {
      id: 'q-hide-element',
      navLabel: '隐藏元素',
      question: 'CSS 隐藏元素有哪些方式？有何差异？',
      answer: [
        p(s('要点：'), t('差异在是否占位、是否可点、是否被读屏/爬虫关注。')),
        p(t('1、'), c('display:none'), t('：不占位、不渲染；'), c('visibility:hidden'), t('：占位不可见。')),
        p(t('2、'), c('opacity:0'), t('：仍可命中事件（除非再 '), c('pointer-events:none'), t('）。')),
        p(t('3、移出视口 / '), c('clip'), t(' / 高 z-index 遮罩用于无障碍「可见隐藏」时要谨慎选型。')),
      ],
    },
  ],
  performance: [
    {
      id: 'q-gpu-composite',
      navLabel: '合成与硬件加速',
      question: '什么是合成层与硬件加速？位移为何常用 transform？',
      answer: [
        p(s('要点：'), t('部分样式变更可只做合成（composite），少触发布局与绘制；GPU 参与合成常被称作硬件加速。')),
        p(t('1、改 '), c('left/top'), t(' 易引发重排；'), c('transform'), t(' / '), c('opacity'), t(' 更易走合成。')),
        p(t('2、过度 '), c('will-change'), t(' 或盲目提层会占内存，应针对热路径。')),
        p(t('3、用 Performance 面板看 layers / paint，验证是否真减负。')),
      ],
    },
  ],
  es6: [
    {
      id: 'q-generator',
      navLabel: 'Generator',
      question: 'Generator 是什么？有哪些使用场景？',
      answer: [
        p(s('要点：'), t('Generator 是可暂停的函数，'), c('function*'), t(' + '), c('yield'), t(' 产出迭代序列，调用返回迭代器。')),
        p(t('1、同步写法表达异步流程曾是主流；现多用 async/await，底层仍与迭代协议相关。')),
        p(t('2、场景：自定义可迭代对象、惰性序列、可中断的任务步进。')),
        p(t('3、'), c('next(value)'), t(' 可向内传值；与 '), c('for...of'), t(' 配合消费。')),
      ],
    },
    {
      id: 'q-symbol',
      navLabel: 'Symbol',
      question: 'Symbol 有什么用？',
      answer: [
        p(s('要点：'), t('Symbol 是唯一的原始类型键，避免对象属性名冲突，并支撑若干元协议。')),
        p(t('1、'), c('Symbol()'), t(' 每次不同；'), c('Symbol.for'), t(' 可跨域共享同名。')),
        p(t('2、作对象私有/半私有字段、库内部标记，减少被枚举覆盖。')),
        p(t('3、协议：'), c('Symbol.iterator'), t('、'), c('Symbol.toStringTag'), t(' 等让内建行为可定制。')),
      ],
    },
    {
      id: 'q-cancel-promise',
      navLabel: '中断 Promise',
      question: '如何「中断」一个 Promise？和 AbortController 什么关系？',
      answer: [
        p(s('要点：'), t('Promise 本身不能从外部撤销已发起的工作；用竞态忽略结果，或让底层支持取消。')),
        p(t('1、包装：新 Promise 在 abort 时 '), c('reject'), t('，业务 '), c('catch'), t(' 后不再处理结果。')),
        p(t('2、'), c('fetch'), t(' 等传 '), c('AbortSignal'), t('，真正停掉网络；这是取消 IO 的正道。')),
        p(t('3、已 settled 的 Promise 无法变回 pending；取消的是后续副作用，不是时光机。')),
      ],
    },
  ],
  typescript: [
    {
      id: 'q-never-void',
      navLabel: 'never 与 void',
      question: 'never 和 void 有何区别？',
      answer: [
        p(s('要点：'), t('void 表示「无返回值」；never 表示「不可能有值」（走不到的类型）。')),
        p(t('1、函数无 return 或只 '), c('return;'), t(' 时，返回类型常为 '), c('void'), t('。')),
        p(t('2、永远抛错、死循环、穷尽检查的剩余分支用 '), c('never'), t('。')),
        p(t('3、'), c('never'), t(' 可赋给任意类型（底类型）；不要用 void 表达「不可达」。')),
      ],
    },
    {
      id: 'q-enum',
      navLabel: '枚举',
      question: 'TypeScript 枚举怎么用？和联合类型如何取舍？',
      answer: [
        p(s('要点：'), t('枚举给一组命名常量；简单字符串/数字集合也可用联合类型，更轻、易 tree-shake。')),
        p(t('1、'), c('enum'), t(' 可反向映射（数字枚举）；'), c('const enum'), t(' 内联但有边界。')),
        p(t('2、联合字面量 + '), c('as const'), t(' 对象在许多代码库更受欢迎。')),
        p(t('3、与后端约定稳定、要反射枚举名时再用 enum。')),
      ],
    },
    {
      id: 'q-type-assertion',
      navLabel: '类型断言',
      question: '类型断言是什么？和类型收窄有何不同？',
      answer: [
        p(s('要点：'), t('断言告诉编译器「按某类型看」，不产生运行时检查；收窄则由控制流证明类型。')),
        p(t('1、写法：'), c('value as Type'), t(' 或 '), c('<Type>value'), t('（TSX 中少用后者）。')),
        p(t('2、从 '), c('unknown'), t(' 出来应先收窄或校验，再断言；双重断言要极谨慎。')),
        p(t('3、优先 '), c('in'), t(' / 谓词 / 判别联合，断言留在边界层（DOM、JSON）。')),
      ],
    },
  ],
  react: [
    {
      id: 'q-error-boundary',
      navLabel: '错误边界',
      question: 'React 错误边界能捕获什么？怎么用？',
      answer: [
        p(s('要点：'), t('错误边界是类组件，捕获子树渲染/生命周期/构造中的错误，展示降级 UI。')),
        p(t('1、实现 '), c('getDerivedStateFromError'), t(' / '), c('componentDidCatch'), t('；函数组件本身不能做边界。')),
        p(t('2、捕不到：事件处理、异步回调、服务端、边界自身错误——那些要自行 try/catch 或上报。')),
        p(t('3、按路由或模块包裹，避免整树白屏；日志送监控。')),
      ],
    },
    {
      id: 'q-hooks-stale-closure',
      navLabel: 'Hooks 闭包陷阱',
      question: '什么是 Hooks 闭包陷阱？如何避免？',
      answer: [
        p(s('要点：'), t('effect/回调捕获了过期的 props/state，读到陈旧值或漏掉更新。')),
        p(t('1、依赖数组列全会触发的值；用 eslint 规则辅助。')),
        p(t('2、定时器/订阅里需要最新值时用 ref 存当前值，或函数式 '), c('setState'), t('。')),
        p(t('3、不必把所有函数塞进依赖；稳定回调用 '), c('useCallback'), t(' 时同样要列对其闭包值。')),
      ],
    },
    {
      id: 'q-synthetic-event',
      navLabel: '合成事件',
      question: 'React 合成事件与原生事件有何不同？',
      answer: [
        p(s('要点：'), t('React 在根上委托监听，回调收到的是合成事件包装，行为跨浏览器更一致。')),
        p(t('1、多数事件冒泡到根再分发；'), c('e.stopPropagation()'), t(' 停的是 React 树，未必停原生。')),
        p(t('2、与原生监听混用时注意顺序与是否 '), c('nativeEvent'), t('。')),
        p(t('3、现代版本减少池化复用；异步里直接用事件字段一般更安全，仍建议先取所需值。')),
      ],
    },
  ],
  vue: [
    {
      id: 'q-vif-vfor',
      navLabel: 'v-if 与 v-for',
      question: '为什么不建议在同一元素上同时用 v-if 和 v-for？',
      answer: [
        p(s('要点：'), t('同节点时优先级与预期易混，造成多余遍历或难读的渲染逻辑。')),
        p(t('1、Vue 3：'), c('v-if'), t(' 优先于 '), c('v-for'), t('，可能根本拿不到循环变量。')),
        p(t('2、做法：外层 '), c('template'), t(' 上 '), c('v-for'), t('，内层元素 '), c('v-if'), t('；或先 '), c('computed'), t(' 过滤再遍历。')),
        p(t('3、列表很大时先过滤能少造虚拟节点。')),
      ],
    },
    {
      id: 'q-slot',
      navLabel: '插槽 slot',
      question: 'Vue 插槽是什么？默认插槽与具名、作用域插槽怎么用？',
      answer: [
        p(s('要点：'), t('插槽让父组件向子组件预定位置填内容，实现布局型复用。')),
        p(t('1、默认插槽填无名内容；具名插槽对应 '), c('name'), t('。')),
        p(t('2、作用域插槽：子向父暴露数据，父用插槽 props 自定义行渲染（表格列）。')),
        p(t('3、'), c('v-slot'), t(' / '), c('#'), t(' 简写；和 props 分工：数据向下用 props，结构坑位用插槽。')),
      ],
    },
  ],
  coding: [
    {
      id: 'q-impl-concurrency',
      navLabel: '并发限制',
      question: '手写带并发上限的任务调度 pool(limit, tasks)',
      answer: [
        p(
          c(`const pool = async (limit, tasks) => {
  const ret = new Array(tasks.length);
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (i < tasks.length) {
      const cur = i++;
      ret[cur] = await tasks[cur]();
    }
  });
  await Promise.all(workers);
  return ret;
};`),
        ),
      ],
      questionNote:
        '多个 worker 抢下一个下标执行任务，同时运行数不超过 limit；结果按下标写回以保持顺序。注意 tasks 为返回 Promise 的函数数组，而不是已发起的 Promise。',
    },
    {
      id: 'q-impl-list-tree',
      navLabel: '数组与树互转',
      question: '手写 listToTree / treeToList（id、parentId）',
      answer: [
        p(
          c(`const listToTree = (list, rootPid = null) => {
  const map = new Map(list.map((x) => [x.id, { ...x, children: [] }]));
  const roots = [];
  for (const node of map.values()) {
    if (node.parentId == rootPid || !map.has(node.parentId)) roots.push(node);
    else map.get(node.parentId).children.push(node);
  }
  return roots;
};
const treeToList = (roots) => {
  const out = [];
  const walk = (nodes, parentId = null) => {
    for (const n of nodes || []) {
      const { children, ...rest } = n;
      out.push({ ...rest, parentId });
      walk(children, n.id);
    }
  };
  walk(roots, null);
  return out;
};`),
        ),
      ],
      questionNote:
        'listToTree 先建 id→节点映射再挂 children；treeToList 深度优先展开。根判定按业务约定 parentId（null/0），注意环与孤儿节点。',
    },
  ],
  backend: [
    {
      id: 'q-stream-buffer',
      navLabel: 'Stream 与 Buffer',
      question: 'Node 里 Stream 和 Buffer 分别解决什么问题？',
      answer: [
        p(s('要点：'), t('Buffer 处理二进制内存块；Stream 用流动方式读写，避免一次性装入大文件。')),
        p(t('1、'), c('Buffer'), t('：固定字节序列，编解码、抠协议头常见。')),
        p(t('2、'), c('Readable'), t(' / '), c('Writable'), t(' / '), c('Transform'), t('：管道拼接上传、压缩、代理。')),
        p(t('3、注意背压：下游慢时暂停上游，防止内存涨爆。')),
      ],
    },
  ],
}

let total = 0
for (const [slug, items] of Object.entries(byChapter)) {
  const { data, path } = load(slug)
  for (const item of items) {
    upsert(data.items, item)
    total++
  }
  save(path, data)
  console.log(`updated ${slug}: +${items.length} (now ${data.items.length})`)
}
console.log('done, upserted', total)
