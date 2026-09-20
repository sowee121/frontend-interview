# 答案文案写作规范

面向约 **5 年经验**的前端工程师复习面试，要求：**通俗易懂、专业精炼**，可用来口述 1～2 分钟。

## 读者与语气

- 默认读者写过业务、用过 Vue/React，不是零基础。
- 先给结论，再补机制或场景；口语化，不堆术语墙。
- 单段中文叙述不宜超过约 **120 字**（`lint-qa-copy` 在单段超 **140 字** 时拦截），过长必须拆成多个 `answer[]` 项。
- 单题叙事（`text` / `strong`，不含 `code`）建议 **200～450 字**；`lint-qa-copy` 在超 **520 字** 时提示压缩到口述体量。

## ES6 专有名词（对齐阮一峰《ES6 入门》）

复习时可对照 https://es6.ruanyifeng.com/ 。推荐写法：**中文释义 + 英文术语**（与书中一致）。

| 主题 | 书中常用说法 |
|------|----------------|
| let/const | 块级作用域、封闭作用域、暂时性死区（TDZ）：**存在声明提升，但声明前不可访问** |
| 数据结构 | Set 和 Map、WeakMap / WeakSet |
| Iterator | 部署 Iterator 接口、遍历器（指针对象）、`for...of` 循环、可遍历结构 |
| Generator | Generator 函数、`function*`、`yield` |
| Promise | Promise 对象、`pending` / `fulfilled` / `rejected`、`resolve` / `reject`、`then`、settled（已落定，成功或失败都算） |
| async | async 函数、Generator 的语法糖、`await` |
| Class | 类、`constructor` |
| Module | Module 语法、`import`/`export`、编译阶段、动态引用（live binding） |
| Proxy | 代理器、`handler` 配置对象、Reflect 对象 |
| 其它 | 扩展运算符、解构赋值、箭头函数（无自己的 this/arguments/super/new.target） |

## Promise / async-await 状态（中英文结合）

规范三态与动作名**保留英文**，紧跟中文释义，便于面试口述又对得上 MDN：

| 英文 | 建议写法 |
|------|----------|
| pending | 等待中（pending） |
| fulfilled | 已成功（fulfilled） |
| rejected | 已失败（rejected） |
| settled | 已落定（settled，成功或失败都算） |
| resolve / reject | 动词：resolve（兑现成功）、reject（拒绝失败） |

示例：`等 Promise settled（fulfilled 得值，rejected 抛错）`、`全部 fulfilled 才 resolve`。

不要用纯中文替代状态名（如只写「整体成功」），也不要裸写 `await expr` 这类伪代码。

## 缩写与英文术语

1. **首次出现**必须带中文释义，任选一种：
   - `中文全称（英文缩写）`，如「跨站脚本攻击（XSS）」
   - `动作 + code`，如「发同步报文 `SYN`」「进入已连接状态 `ESTABLISHED`」
2. **同一题后续**可只用缩写或 `code` 片段。
3. **禁止**连续 3 个以上未解释的缩写（如裸写 `DNS → TCP → TLS → QUIC` 而不说明各自作用）。
4. API、标识符、规范名用 `{ "type": "code", "value": "..." }`，叙述用 `{ "type": "text" }`。

### 常见缩写对照（首处按此展开）

| 缩写 | 建议首处写法 |
|------|-------------|
| SYN / ACK | 同步报文 / 确认报文 |
| XSS / CSRF / CSP | 跨站脚本 / 跨站请求伪造 / 内容安全策略 |
| SSR / CSR | 服务端渲染 / 客户端渲染 |
| HMR | 热模块替换（HMR） |
| TDZ | 暂时性死区（TDZ） |
| FOIT / FOUT | 字体阻塞显示 / 字体闪烁 |
| DNS / TLS / QUIC | 域名解析 / 传输层安全 / 基于 UDP 的快速传输协议 |
| GC | 垃圾回收（勿裸写「延迟 GC」「不阻止 GC」） |
| payload | 接口返回数据 / 响应体 |
| SPA | 单页应用（SPA） |
| 强引用 / 弱引用 | 会阻止对象被回收 / 不阻止对象被回收（配合 Map、WeakMap 说明） |

## 单题结构

1. **首段**：可选 `{ "type": "strong", "value": "一句话：" }` + 结论。
2. **分步**：`1）` `2）` `3）` 每步占 **一个** `answer` 外层数组元素，段内不用 `；2）` 串联。
3. **收尾**：一句面试边界或业务场景（可选单独一段）。
4. **禁止答题提示段**：不写「答题时可以先说 X 再说 Y」「面试官追问可延伸」这类非知识内容的备考提示，只有知识本身才进答案。

## 跨章去重

同一考点在多章出现时，**只在所属专业章写一处详述**，其他章节删题或瘦身为本视角（项目题写落地取舍、场景题写业务约束）。

- **正文不写指回提示**：不要写「见 X 章『某题』」「此处不展开」「这里只说…」这类编辑口吻。它们不提供知识，还会打断复习连贯性；读者按章顺序读下去自然会读到目标章。
- **删减后保持自足**：被瘦身的题仍要能独立回答自己的题干，不依赖读者去别章找答案。
- 不要复制粘贴同段落：重复题只保留一处完整口径，避免两处答案随维护逐步分叉。
- 项目章不重复讲机制，只讲「我为什么这么选、踩过什么边界」。
- `lint-qa-copy` 的 `cross-chapter-ref` 会拦截 `answer` / `questionNote` 中的指回文案。

## 隐私与时效（lint 会拦截）

- **禁止真实公司 / 产品 / 机构名**（如具体电商平台、医疗寄递、医院、大厂名），一律换成「小程序 / ERP / SaaS / 自助终端 / 中后台 / 电商平台云打印组件」等通用系统词。公开技术工具名（Nginx、Rollup、vxe-table 等）可保留。
- **禁止已废弃用法**（如 `.cursorrules`、`wx.getUserProfile`、`Server Push`、以 FID 作为核心指标），除确需说明「已废弃」的语境。
- 同一章内 `navLabel` 不得重复。

## RichSegment 约定

- `text`：叙述；**段内禁止写反引号与 `**` 加粗**，标识符一律用 `code` segment，强调一律用 `strong` segment。
- `strong`：小标题、强调结论；同样不要写 markdown 记号。
- `code`：API、关键字、报文名、代码片段
- 不要产出空 `text` 段（`value` 为空字符串）。

编程题（`coding` 章）：`answer` 通常为单段 `code`，逻辑不改，**注释**与 `questionNote` 通俗化。

## 章节字段

- `description` / `lead`：与上表语气一致，避免缩写墙。
- `question`：默认不改；与答案严重脱节时微调并注明。
- `id` / `slug` / `navLabel`：不改。

## 禁止写法（易读性差）

- 伪代码变量：`await expr`、`expr`、`resolve(该值)`、`下一节 resolve`
- 英文教材腔：`success 回调`、`pending 的 Promise`（改用「成功回调」「一直处于等待中的 Promise」）
- 裸缩写：`executor(`（题面说明里写「执行器函数 executor」）；`thenable` 可与 Promise 连用（如 `Promise/thenable`）
- 裸写 `GC`：改用「垃圾回收」；勿写「不阻止 GC」这类中英混搭（强引用会阻止回收，WeakMap 弱引用才不阻止）
- 英文-only 的 `strong` 小标题（如单独写 Layout / track，应写「布局（Layout）」「依赖收集（track）」）

## 提交前自检

```sh
node scripts/lint-qa-copy.mjs
pnpm run type-check
pnpm run build
```
