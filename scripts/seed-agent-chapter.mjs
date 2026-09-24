/**
 * 生成「Agent」章 agent.json
 * 用法: node scripts/seed-agent-chapter.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/data/qa/json/agent.json')

const chapter = {
  slug: 'agent',
  title: 'Agent',
  documentTitle: 'Agent',
  description:
    '以 Cursor、OpenAI Codex app（ChatGPT 编程 Agent 桌面端）、Claude Code 为主线：选型分工、提问与上下文、审代码、安全，以及 MCP/RAG。',
  lead: '偏「会用、会验、会控风险」。大模型流式回复的前端实现见场景题「流式对话输出」。',
  items: [
    {
      id: 'q-ai-tools',
      navLabel: '三工具分工',
      question: 'Cursor（IDE）、Codex app（OpenAI 桌面 Agent）、Claude Code（终端 Agent）分别适合什么场景？你怎么配合？',
      questionNote: 'Cursor 主编辑；Codex app 并行派活+worktree；Claude Code 终端大改；别和 2021 老 Codex API 混淆。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          {
            type: 'text',
            value: 'Cursor 负责日常在仓里写和改；Codex app 负责桌面端并行 Agent；Claude Code 负责终端读仓跑命令，三者别同时改同一文件。',
          },
        ],
        [
          { type: 'text', value: '1、' },
          { type: 'strong', value: 'Cursor' },
          { type: 'text', value: '：IDE 内 Tab + Agent，@ 文件、.cursorrules、MCP，前端主战场。' },
        ],
        [
          { type: 'text', value: '2、' },
          { type: 'strong', value: 'Codex app' },
          { type: 'text', value: '：桌面 Agent 指挥中心；多线程、worktree；读 AGENTS.md，适合旁路派活。' },
        ],
        [
          { type: 'text', value: '3、' },
          { type: 'strong', value: 'Claude Code' },
          { type: 'text', value: '：终端 Agent，读 CLAUDE.md；大范围重构、脚本化常用。' },
        ],
      ],
    },
    {
      id: 'q-ai-complete-vs-agent',
      navLabel: 'Cursor Tab vs Agent',
      question: '在 Cursor / Codex / Claude Code 这些工具里，你怎么理解 Cursor 的 Tab 补全和 Agent 模式区别？',
      questionNote: 'Tab=单点预测；Agent=多步+多文件；和 Codex app 并行 Agent 是不同产品。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          { type: 'text', value: 'Tab 像猜下一句代码，Agent 像按目标连续改多个文件。' },
        ],
        [
          { type: 'text', value: '1、Tab：光标处 inline 建议，快，适合样板、补类型、小函数。' },
        ],
        [
          { type: 'text', value: '2、Agent：可读多文件、跑命令、出 diff；适合加功能、重构。' },
        ],
        [
          { type: 'text', value: '3、Agent 改动面大，要小步 + 人审；长并行任务可交给 Codex app worktree。' },
        ],
      ],
    },
    {
      id: 'q-ai-prompt',
      navLabel: '怎么提问',
      question: '跟 AI 提需求时（Cursor、Codex app 或 Claude Code），怎样写 prompt 更容易做对？',
      questionNote: '目标/约束/上下文/验收；@文件 或指明路径。',
      answer: [
        [
          { type: 'strong', value: '四件套：' },
          { type: 'text', value: '目标、约束、上下文（@文件/路径）、验收标准。' },
        ],
        [
          { type: 'text', value: '1、给示例输入输出、报错栈，比「帮我优化」有效。' },
        ],
        [
          { type: 'text', value: '2、一次一事；大需求先 Plan 再执行。' },
        ],
        [
          { type: 'text', value: '3、让 AI 先复述理解并列将改动的文件。' },
        ],
      ],
    },
    {
      id: 'q-ai-context',
      navLabel: '上下文窗口',
      question: '在 Cursor / Codex / Claude Code 里，为什么对话长了会「忘」？你怎么控上下文？',
      questionNote: 'token 上限；新会话、摘要、只带必要文件。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          { type: 'text', value: '上下文窗口有上限，历史+文件占满后旧内容会被截断。' },
        ],
        [
          { type: 'text', value: '1、子任务新开线程/会话；结论用短摘要带到下一轮。' },
        ],
        [
          { type: 'text', value: '2、只 @ 相关文件，大文件指明函数或行号。' },
        ],
        [
          { type: 'text', value: '3、.cursorrules / CLAUDE.md / AGENTS.md 自动注入，三份宜对齐。' },
        ],
      ],
    },
    {
      id: 'q-ai-rules',
      navLabel: '三份规则文件',
      question: 'Cursor 的 .cursorrules、Claude Code 的 CLAUDE.md、Codex 的 AGENTS.md 各干什么？怎么写才不鸡肋？',
      questionNote: '三工具各一份项目级 Agent 说明；宜内容对齐、可执行。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          { type: 'text', value: '进仓库就被 Agent 读到的持久说明，减少每轮重复交代。' },
        ],
        [
          { type: 'text', value: '1、Cursor：' },
          { type: 'code', value: '.cursorrules' },
          { type: 'text', value: '（或 .cursor/rules）' },
        ],
        [
          { type: 'text', value: '2、Claude Code：' },
          { type: 'code', value: 'CLAUDE.md' },
        ],
        [
          { type: 'text', value: '3、Codex：' },
          { type: 'code', value: 'AGENTS.md' },
          { type: 'text', value: '；三份核心约定建议同步维护。' },
        ],
      ],
    },
    {
      id: 'q-ai-task-split',
      navLabel: '任务拆分',
      question: '用 Cursor / Codex / Claude Code 跟 Agent 协作时，大需求你怎么拆任务才安全？',
      questionNote: '小 PR、worktree 隔离、每步可验证。',
      answer: [
        [
          { type: 'strong', value: '原则：' },
          { type: 'text', value: '每步可 review、可过 CI；Codex worktree 与主分支并行时也要说清楚合并点。' },
        ],
        [
          { type: 'text', value: '1、先只读列影响文件与风险。' },
        ],
        [
          { type: 'text', value: '2、按层或垂直切片拆；并行线程各干一件事。' },
        ],
        [
          { type: 'text', value: '3、每步验收：type-check、主路径可点。' },
        ],
      ],
    },
    {
      id: 'q-ai-review-code',
      navLabel: '审 AI 代码',
      question: '在 Cursor / Codex / Claude Code 协作下，AI 生成的代码提交前你会重点看哪几类问题？',
      questionNote: '边界、安全、幻觉 API、过度抽象。',
      answer: [
        [
          { type: 'strong', value: '必看：' },
          { type: 'text', value: '是否真解决问题、scope 是否偷偷变大、错误与空状态。' },
        ],
        [
          { type: 'text', value: '1、正确性：类型、异步、竞态；跑测试。' },
        ],
        [
          { type: 'text', value: '2、安全：XSS、密钥、权限只藏 UI。' },
        ],
        [
          { type: 'text', value: '3、可维护：是否多余抽象、是否符合项目模式。' },
        ],
      ],
    },
    {
      id: 'q-ai-hallucination',
      navLabel: '幻觉与验证',
      question: '在 Cursor / Codex / Claude Code 用 AI 写代码时，遇到编造不存在的 API/库，你怎么发现和避免？',
      questionNote: '查文档、类型、build；不信口述。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          { type: 'text', value: '幻觉=说得像真的但仓库里没有；要验证。' },
        ],
        [
          { type: 'text', value: '1、查官方文档与 ' },
          { type: 'code', value: 'node_modules' },
          { type: 'text', value: ' 类型声明。' },
        ],
        [
          { type: 'text', value: '2、' },
          { type: 'code', value: 'pnpm run build' },
          { type: 'text', value: ' / 测试跑一遍。' },
        ],
        [
          { type: 'text', value: '3、固定依赖版本，复杂逻辑补单测。' },
        ],
      ],
    },
    {
      id: 'q-ai-debug',
      navLabel: 'AI 辅助调试',
      question: '用 Cursor / Codex / Claude Code 辅助查 bug 时，怎样提供信息最有效？',
      questionNote: '栈、复现、已尝试；小步验证假设。',
      answer: [
        [
          { type: 'strong', value: '信息包：' },
          { type: 'text', value: '期望 vs 实际、复现步骤、完整报错、@相关代码、环境。' },
        ],
        [
          { type: 'text', value: '1、最小复现；说明已试过什么。' },
        ],
        [
          { type: 'text', value: '2、让 AI 列假设再逐个验证。' },
        ],
        [
          { type: 'text', value: '3、时序类附日志时间点、框架版本。' },
        ],
      ],
    },
    {
      id: 'q-ai-security',
      navLabel: '安全与合规',
      question: '用 Cursor / Codex / Claude Code 写公司业务代码，要注意哪些安全点？',
      questionNote: '密钥、隐私、公司 AI 政策；Codex 用 ChatGPT 账号需注意数据策略。',
      answer: [
        [
          { type: 'strong', value: '红线：' },
          { type: 'text', value: '生产密钥、用户隐私、未公开源码按公司规定是否可上云。' },
        ],
        [
          { type: 'text', value: '1、' },
          { type: 'code', value: '.env.local' },
          { type: 'text', value: ' 且进 ' },
          { type: 'code', value: '.gitignore' },
          { type: 'text', value: '；聊天不贴 token。' },
        ],
        [
          { type: 'text', value: '2、日志截图脱敏。' },
        ],
        [
          { type: 'text', value: '3、了解订阅版数据与训练政策，以法务/安全口径为准。' },
        ],
      ],
    },
    {
      id: 'q-ai-mcp',
      navLabel: 'MCP 是什么',
      question: 'MCP 是什么？在 Cursor / Codex / Claude Code 里能接哪些前端相关能力？',
      questionNote: 'Model Context Protocol；浏览器、文档、Issue 等。',
      answer: [
        [
          { type: 'strong', value: '一句话：' },
          { type: 'text', value: '模型上下文协议（MCP）让 AI 通过标准接口调外部工具，不只靠训练记忆。' },
        ],
        [
          { type: 'text', value: '1、例如读文档、开浏览器、拉 GitHub Issue；Codex app 也支持插件与 MCP。' },
        ],
        [
          { type: 'text', value: '2、前端：对照设计稿、看控制台/网络、跑 eslint，少手动复制。' },
        ],
        [
          { type: 'text', value: '3、和 RAG 互补：MCP 偏执行动作，RAG 偏检索知识。' },
        ],
      ],
    },
    {
      id: 'q-ai-rag',
      navLabel: 'RAG 与代码库',
      question: 'RAG 和 Cursor / Codex / Claude Code 的「代码库检索」能力有啥区别？',
      questionNote: '检索增强生成；索引质量决定上限。',
      answer: [
        [
          { type: 'strong', value: 'RAG：' },
          { type: 'text', value: '先搜文档/代码片段再拼进 prompt，适合私有仓与最新文档。' },
        ],
        [
          { type: 'text', value: '1、@codebase 本质是项目内检索+上下文，要问得具体。' },
        ],
        [
          { type: 'text', value: '2、局限：索引不全就答错；大文件仍占窗口。' },
        ],
        [
          { type: 'text', value: '3、和整文件 @ 比更省 token，检索质量是关键。' },
        ],
      ],
    },
    {
      id: 'q-ai-pr-workflow',
      navLabel: '小步提交',
      question: '用 Cursor / Codex / Claude Code 和 Agent 协作时，你怎么控制 diff 方便 Code Review？',
      questionNote: '小 PR、人 merge；Codex worktree 合并前也要人看。',
      answer: [
        [
          { type: 'strong', value: '习惯：' },
          { type: 'text', value: '每轮列改动文件与原因；按文件过 diff。' },
        ],
        [
          { type: 'text', value: '1、不顺手重构无关模块。' },
        ],
        [
          { type: 'text', value: '2、提交前跑 lint/test；CI 红就打回。' },
        ],
        [
          { type: 'text', value: '3、鉴权、支付等敏感目录必须人工重点看。' },
        ],
      ],
    },
  ],
}

writeFileSync(out, `${JSON.stringify(chapter, null, 2)}\n`, 'utf8')
console.log('wrote', out, chapter.items.length, 'items')
