#!/usr/bin/env node
/**
 * 一次性拆分：从 javascript.json 迁题到 es6.json，并写入两章新题与元信息。
 * 运行：node scripts/split-es6-chapter.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const jsonDir = path.join(__dirname, '../src/data/qa/json')
const jsPath = path.join(jsonDir, 'javascript.json')

const js = JSON.parse(fs.readFileSync(jsPath, 'utf8'))
const byId = Object.fromEntries(js.items.map((i) => [i.id, i]))

const ES6_NEW_ITEMS = [
  {
    id: 'q-destructuring',
    navLabel: '解构赋值',
    question: '解构赋值能解哪些结构？剩余参数和展开运算符啥关系？',
    answer: [
      [
        { type: 'text', value: 'ES6 ' },
        { type: 'strong', value: '解构赋值' },
        {
          type: 'text',
          value: '可从数组、对象、函数参数里按模式取值，右侧一般是可遍历结构或对象。',
        },
      ],
      [
        { type: 'text', value: '1、数组：' },
        { type: 'code', value: 'const [a, , b] = arr' },
        { type: 'text', value: '；可设默认值、' },
        { type: 'code', value: '...rest' },
        { type: 'text', value: ' 收剩余元素。' },
      ],
      [
        { type: 'text', value: '2、对象：' },
        { type: 'code', value: 'const { x, y: renamed } = obj' },
        { type: 'text', value: '；可嵌套、可默认值。' },
      ],
      [
        { type: 'text', value: '3、函数参数解构 + 默认值常一起用，便于配置对象。' },
      ],
      [
        { type: 'strong', value: '剩余 vs 展开：' },
        { type: 'text', value: '解构里的 ' },
        { type: 'code', value: '...rest' },
        { type: 'text', value: ' 是「收拢」；字面量/调用里的 ' },
        { type: 'code', value: '...arr' },
        { type: 'text', value: ' 是「展开」，二者互为逆操作（阮一峰扩展运算符一章）。' },
      ],
    ],
  },
  {
    id: 'q-arrow-and-params',
    navLabel: '箭头函数与默认参数',
    question: '箭头函数和普通函数有啥区别？默认参数怎么用？',
    answer: [
      [
        { type: 'strong', value: '箭头函数（阮一峰）：' },
        { type: 'text', value: '没有自己的 ' },
        { type: 'code', value: 'this' },
        { type: 'text', value: '、' },
        { type: 'code', value: 'arguments' },
        { type: 'text', value: '、' },
        { type: 'code', value: 'super' },
        { type: 'text', value: '、' },
        { type: 'code', value: 'new.target' },
        { type: 'text', value: '；不能当构造函数（无 ' },
        { type: 'code', value: '[[Construct]]' },
        { type: 'text', value: '）。' },
      ],
      [
        { type: 'code', value: 'this' },
        {
          type: 'text',
          value: ' 由定义时外层词法环境决定，适合回调、定时器；不适合需要动态绑定的对象方法（可改类字段箭头或 bind）。',
        },
      ],
      [
        { type: 'text', value: '默认参数在形参列表写 ' },
        { type: 'code', value: 'function fn(a = 1, b = a)' },
        {
          type: 'text',
          value: '；未传或传 `undefined` 时生效。与解构默认值可组合处理「配置对象」参数。',
        },
      ],
    ],
  },
  {
    id: 'q-template-literal',
    navLabel: '模板字符串',
    question: '模板字符串比字符串拼接强在哪？标签模板了解吗？',
    answer: [
      [
        { type: 'text', value: '反引号 `` ` `` 包裹的' },
        { type: 'strong', value: '模板字符串' },
        { type: 'text', value: '支持多行、嵌入 ' },
        { type: 'code', value: '${expr}' },
        { type: 'text', value: ' 插值，可读性优于 `+` 拼接。' },
      ],
      [
        { type: 'text', value: '标签模板：' },
        { type: 'code', value: 'tag`hello ${name}`' },
        {
          type: 'text',
          value: ' 把字符串片段数组与插值传给函数，用于 styled-components、i18n 等；面试知道概念即可。',
        },
      ],
    ],
  },
  {
    id: 'q-symbol',
    navLabel: 'Symbol',
    question: 'Symbol 解决什么问题？和字符串属性名有啥区别？',
    answer: [
      [
        { type: 'text', value: 'ES6 ' },
        { type: 'strong', value: 'Symbol' },
        {
          type: 'text',
          value: ' 是唯一、不可变的基本类型，常用作对象「不会撞名」的键（如内置遍历器 ',
        },
        { type: 'code', value: 'Symbol.iterator' },
        { type: 'text', value: '）。' },
      ],
      [
        { type: 'text', value: '1、' },
        { type: 'code', value: 'Symbol.for(key)' },
        { type: 'text', value: ' 全局登记；' },
        { type: 'code', value: 'Symbol.keyFor' },
        { type: 'text', value: ' 反查。' },
      ],
      [
        {
          type: 'text',
          value: '2、`for...in` / `Object.keys` 枚举不到 Symbol 键；需要 `Object.getOwnPropertySymbols`。',
        },
      ],
      [
        {
          type: 'text',
          value: '3、Well-known Symbol 定制语言行为（迭代、toStringTag 等），与 Iterator 接口强相关。',
        },
      ],
    ],
  },
  {
    id: 'q-set-map',
    navLabel: 'Set 与 Map',
    question: 'Set / Map 和数组、对象有啥区别？什么时候用？',
    answer: [
      [
        { type: 'code', value: 'Set' },
        { type: 'text', value: '：值唯一，去重、集合运算；' },
        { type: 'code', value: 'new Set(arr)' },
        { type: 'code', value: '[...set]' },
        { type: 'text', value: ' 与数组互转。' },
      ],
      [
        { type: 'code', value: 'Map' },
        {
          type: 'text',
          value: '：键可为任意类型（含对象），有 size、可遍历；频繁增删键值对、键非字符串时优于普通对象。',
        },
      ],
      [
        {
          type: 'text',
          value: '对象当「哈希表」只有字符串/Symbol 键；Map 保持插入顺序，语义更清晰。弱引用版本见 WeakMap/WeakSet 题。',
        },
      ],
    ],
  },
  {
    id: 'q-generator',
    navLabel: 'Generator',
    question: 'Generator 函数是干啥的？和 Iterator 啥关系？',
    answer: [
      [
        { type: 'code', value: 'function*' },
        { type: 'text', value: ' 定义 ' },
        { type: 'strong', value: 'Generator 函数' },
        { type: 'text', value: '，执行返回遍历器对象，通过 ' },
        { type: 'code', value: 'yield' },
        { type: 'text', value: ' 暂停/产出值（阮一峰 Generator 一章）。' },
      ],
      [
        {
          type: 'text',
          value: '自带 Iterator 接口：`next()` 返回 `{ value, done }`；可配合 `for...of` 遍历。',
        },
      ],
      [
        {
          type: 'text',
          value: '场景：惰性序列、可控异步流程（早期 co 风格）；现代业务多用 async/await，但面试仍会问与 Promise、迭代协议的关系。',
        },
      ],
    ],
  },
  {
    id: 'q-class',
    navLabel: 'Class 语法',
    question: 'ES6 class 和构造函数有啥区别？继承怎么写？',
    answer: [
      [
        { type: 'text', value: 'ES6 ' },
        { type: 'strong', value: 'class' },
        {
          type: 'text',
          value: ' 大多是语法糖，底层仍基于原型：`class` 的 `prototype` 在 `constructor` 上，`extends` 建立原型链。',
        },
      ],
      [
        { type: 'text', value: '1、`constructor` 初始化实例；类字段、静态方法 `static` 支持声明式写法。' },
      ],
      [
        { type: 'text', value: '2、`extends` + `super()` 调用父构造；`super.method()` 调父类原型方法。' },
      ],
      [
        {
          type: 'text',
          value: '3、不存在变量提升；本质仍是 `typeof Class === "function"`。手写继承实现见 JavaScript 章「继承」题。',
        },
      ],
    ],
  },
]

const ES6_ORDER = [
  'q-let-const-tdz',
  'q-destructuring',
  'q-arrow-and-params',
  'q-template-literal',
  'q-symbol',
  'q-set-map',
  'q-weakmap',
  'q-copy',
  'q-for-in-of',
  'q-iterator',
  'q-promise',
  'q-promise-chain-error',
  'q-async-await',
  'q-generator',
  'q-class',
  'q-proxy-reflect',
  'q-esm-cjs',
  'q-dynamic-import',
  'q-optional-nullish',
]

const JS_KEEP_IDS = [
  'q-null-undefined',
  'q-loose-equality',
  'q-type-detection',
  'q-hoisting',
  'q-execution-context',
  'q-closure',
  'q-strict-mode',
  'q-new',
  'q-proto',
  'q-inheritance',
  'q-call-bind',
  'q-this',
  'q-single-thread',
  'q-eventloop',
  'q-debounce',
  'q-float-precision',
  'q-boxed-primitive',
  'q-event-delegation',
  'q-json-limit',
  'q-memory-leak',
]

const JS_NEW_ITEMS = [
  {
    id: 'q-type-detection',
    navLabel: '类型判断',
    question: '怎么判断数组、null、日期？typeof 和 instanceof 够用吗？',
    answer: [
      [
        { type: 'code', value: 'typeof' },
        { type: 'text', value: ' 适合原始类型；' },
        { type: 'code', value: 'typeof null === "object"' },
        { type: 'text', value: ' 是历史 bug，需单独判 null。' },
      ],
      [
        { type: 'code', value: 'instanceof' },
        {
          type: 'text',
          value: ' 看原型链，跨 iframe 或改 prototype 会失效；基本类型无意义。',
        },
      ],
      [
        { type: 'strong', value: '更稳：' },
        { type: 'code', value: 'Object.prototype.toString.call(x)' },
        { type: 'text', value: ' 得 `[object Array]` 等；`Array.isArray(x)` 判数组。手写见 coding 章。' },
      ],
    ],
  },
  {
    id: 'q-hoisting',
    navLabel: '变量与函数提升',
    question: 'var 和 function 声明是怎么“提升”的？和 let 的 TDZ 啥区别？',
    answer: [
      [
        { type: 'code', value: 'var' },
        { type: 'text', value: '：编译阶段提升声明，初始化为 ' },
        { type: 'code', value: 'undefined' },
        { type: 'text', value: '，同作用域可重复声明。' },
      ],
      [
        { type: 'text', value: '函数声明整体提升（可先于声明调用）；函数表达式只提升变量名，值为 ' },
        { type: 'code', value: 'undefined' },
        { type: 'text', value: ' 直到赋值。' },
      ],
      [
        { type: 'code', value: 'let' },
        { type: 'text', value: ' / ' },
        { type: 'code', value: 'const' },
        { type: 'text', value: ' 有提升但处于' },
        { type: 'strong', value: '暂时性死区（TDZ）' },
        { type: 'text', value: '，声明前访问抛 ReferenceError，详见 ES6 章。' },
      ],
    ],
  },
  {
    id: 'q-execution-context',
    navLabel: '执行上下文与作用域链',
    question: '执行上下文、作用域链和原型链分别管啥？',
    answer: [
      [
        { type: 'strong', value: '执行上下文' },
        { type: 'text', value: '：代码运行时的环境（变量、this、外层引用），调用栈一层一层压入弹出。' },
      ],
      [
        { type: 'strong', value: '作用域链' },
        { type: 'text', value: '：查找标识符时沿词法环境向外层找，和闭包、' },
        { type: 'code', value: 'let' },
        { type: 'text', value: ' 块级作用域相关。' },
      ],
      [
        { type: 'strong', value: '原型链' },
        { type: 'text', value: '：查找对象属性时沿 `[[Prototype]]` 向上，和 `new`、继承相关；别和作用域链混为一谈。' },
      ],
    ],
  },
  {
    id: 'q-strict-mode',
    navLabel: '严格模式',
    question: '严格模式改了哪些行为？this 有啥不同？',
    answer: [
      [
        { type: 'text', value: '文件或函数顶部 `' },
        { type: 'code', value: "'use strict'" },
        { type: 'text', value: '` 开启；禁止静默失败（未声明变量赋值抛错）、删除不可删属性等。' },
      ],
      [
        { type: 'text', value: '独立调用的函数里 ' },
        { type: 'code', value: 'this' },
        { type: 'text', value: ' 为 ' },
        { type: 'code', value: 'undefined' },
        { type: 'text', value: '（非严格常为全局对象）；箭头函数仍看词法 this。' },
      ],
      [
        { type: 'text', value: '模块、class 方法体默认严格。' },
      ],
    ],
  },
  {
    id: 'q-inheritance',
    navLabel: '继承实现方式',
    question: '除了 class，ES5 里怎么实现继承？',
    answer: [
      [
        { type: 'text', value: '1、原型链：子类 `prototype` 指向父类实例，问题：父构造执行两次、引用类型共享。' },
      ],
      [
        { type: 'text', value: '2、盗用构造函数：`Parent.call(this)` 拷属性，拿不到父类原型方法。' },
      ],
      [
        { type: 'text', value: '3、组合：上面两种结合。' },
      ],
      [
        { type: 'text', value: '4、寄生组合：`Object.create(Parent.prototype)` + `call`，常用教科书写法。' },
      ],
      [
        { type: 'text', value: '日常用 ES6 `class extends` 即可，见 ES6 章。' },
      ],
    ],
  },
  {
    id: 'q-float-precision',
    navLabel: '浮点数精度',
    question: '为什么 0.1 + 0.2 !== 0.3？怎么规避？',
    answer: [
      [
        { type: 'text', value: 'JS 数字是 IEEE 754 双精度浮点，很多十进制小数无法精确表示，比较会出现误差。' },
      ],
      [
        { type: 'text', value: '金额等场景：用整数分存储，或 `decimal.js` / `big.js`；比较时用误差范围而非 `===`。' },
      ],
    ],
  },
  {
    id: 'q-boxed-primitive',
    navLabel: '包装类型',
    question: '基本类型和包装对象啥关系？`new String("a")` 和 `"a"` 一样吗？',
    answer: [
      [
        { type: 'text', value: '访问 `' },
        { type: 'code', value: 'str.length' },
        { type: 'text', value: '` 时会临时装箱成 `String` 对象，用完丢弃。' },
      ],
      [
        { type: 'code', value: 'new String("a")' },
        { type: 'text', value: ' 是对象，`typeof` 为 `object`；`' },
        { type: 'code', value: '"a"' },
        { type: 'text', value: '` 是原始字符串。`==` 可能隐式转换，面试注意类型。' },
      ],
    ],
  },
  {
    id: 'q-event-delegation',
    navLabel: '事件委托',
    question: '事件委托是啥？适合什么场景？',
    answer: [
      [
        { type: 'text', value: '把监听绑在父节点，利用' },
        { type: 'strong', value: '冒泡' },
        { type: 'text', value: '统一处理子节点（含后续动态插入）事件，少绑多个监听器。' },
      ],
      [
        { type: 'text', value: '用 `event.target` 区分真实点击源；捕获/冒泡顺序、阻止传播见 browser 章 DOM 事件题。' },
      ],
    ],
  },
  {
    id: 'q-single-thread',
    navLabel: '单线程模型',
    question: '为什么说 JavaScript 是单线程？和异步啥关系？',
    answer: [
      [
        { type: 'text', value: '主线程一条调用栈，长时间同步任务会阻塞渲染与交互，所以 I/O、定时器交给宿主环境，完成后回调进任务队列。' },
      ],
      [
        { type: 'text', value: '宏任务/微任务调度见「事件循环」题；重计算可放 Web Worker（browser 章）。' },
      ],
    ],
  },
  {
    id: 'q-json-limit',
    navLabel: 'JSON 序列化局限',
    question: 'JSON.stringify 有哪些坑？为啥不能当通用深拷贝？',
    answer: [
      [
        { type: 'text', value: '会忽略 `undefined`、`function`、`Symbol`；`Date` 变字符串；`Map`/`Set` 等不能直接序列化。' },
      ],
      [
        { type: 'text', value: '对象循环引用会抛错；不能处理 `RegExp` 等特殊类型。' },
      ],
      [
        { type: 'text', value: '适合接口传输与简单数据持久化；可靠深拷贝见 coding 章或 `structuredClone`（注意环境支持）。' },
      ],
    ],
  },
]

// Build ES6 chapter
const es6Items = []
for (const id of ES6_ORDER) {
  const fromNew = ES6_NEW_ITEMS.find((i) => i.id === id)
  if (fromNew) {
    es6Items.push(fromNew)
    continue
  }
  const migrated = byId[id]
  if (!migrated) throw new Error(`Missing ES6 item: ${id}`)
  es6Items.push(migrated)
}

const es6 = {
  slug: 'es6',
  title: 'ES6',
  documentTitle: 'ES6',
  description:
    'ES6 语法与内置对象面试必考，专有名词对齐阮一峰《ES6 入门》。',
  lead: '按教程章节对照复习：',
  leadLink: {
    href: 'https://es6.ruanyifeng.com',
    label: '阮一峰《ES6 入门》',
  },
  items: es6Items,
}

// Build JavaScript chapter
const jsNewById = Object.fromEntries(JS_NEW_ITEMS.map((i) => [i.id, i]))
const jsItems = []
for (const id of JS_KEEP_IDS) {
  if (jsNewById[id]) {
    jsItems.push(jsNewById[id])
    continue
  }
  const kept = byId[id]
  if (!kept) throw new Error(`Missing JS item: ${id}`)
  jsItems.push(kept)
}

const javascript = {
  slug: 'javascript',
  title: 'JavaScript',
  documentTitle: 'JavaScript',
  description:
    '语言机制与运行时：类型、作用域、原型、this、事件循环与常见坑；ES6+ 语法见 ES6 章。',
  lead: '先掌握 JS 核心机制，再对照 ES6 章复习 let/const、Promise、Module 等新特性。',
  items: jsItems,
}

fs.writeFileSync(path.join(jsonDir, 'es6.json'), JSON.stringify(es6, null, 2) + '\n')
fs.writeFileSync(path.join(jsonDir, 'javascript.json'), JSON.stringify(javascript, null, 2) + '\n')

console.log(`es6.json: ${es6.items.length} items`)
console.log(`javascript.json: ${javascript.items.length} items`)
