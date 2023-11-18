# 正式项目

## 项目合约配置

1. truffle 相当于 create-react-app 或者 vue-cli
2. 正式使用,还是需要配置下 webpack

- 使用 js 测试合约,测试驱动开发
- 需要外部调用 生命周期 函数类型为 `public`

### solc [https://github.com/ethereum/solc-js]

- JavaScript bindings for the [Solidity compiler].
- solc 编译 .sol 文件, 生成一个 json (后面部署, 测试 等需要的数据)

1. bytecode : 部署合约用的数据
2. interface 接口声明: 测试使用

- 完善流程

1. 每次 compile 清空文件,重新生成
2. 报错信息打印
3. 最好能监听,并自动 compile

### rimraf

- 动态删除 文件夹

```js
"compile": "rimraf src/compiled/* && node scripts/compile"
```

### onchange 模块

### web-worker [https://www.npmjs.com/package/worker-plugin]

- 对浏览器来说,用 Solc 编译合约,是一个繁重的工作.所以需要用到 WebWorker.
- 在 webpack 中配置插件 `worker-plugin`
- 如何在 webpack5 中配置该插件:

1. webpack.config.js 中:

```js
new WorkerPlugin({
  preserveTypeModule: true,
  globalObject: "self", // 当接收热更新时, 使用 self 作为全局对象
});
```

2. webpack5 中已包含 worker bundling. 所以在初始化时,需要用不同的语法来初始化.

```js
const worker = new Worker(new URL("./my_worker.js", import.meta.url));
```

3. `my_worker.js` 中

```js
// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", (e) => {
  console.log("e: ", e.data);
});
```

## 合约需求

- 课程列表

1. 每个课程, 是一个单独的合约
2. 使用 CourseList 来控制

```js
// 数据结构
[
    {name: 'React':content:'xxxx'},
    {name: 'Vue':content:'xxxx'}
]
```

## 测试驱动开发

Jest 是一个 JavaScript 的单元测试框架，它使用 jsdom 来模拟浏览器环境。在使用 Jest 进行单元测试时，如果遇到"ReferenceError: TextEncoder is not defined"错误，这通常是因为 jsdom 不支持 TextEncoder 对象。

TextEncoder 是一个 Web API，它可以将字符串编码为二进制数据。但是，由于 jsdom 没有实现 TextEncoder，所以在使用 Jest 进行单元测试时会出现这个错误。

解决方案：

使用其他编码库，例如 TextEncoderLite，它是一个纯 JavaScript 实现的 TextEncoder。
使用 Jest 的 transform 选项来配置 babel 来模拟 TextEncoder。
使用 node.js 中的 Buffer 对象来替代 TextEncoder。
如果在您的代码中使用了 TextEncoder，并且您正在使用 Jest 进行单元测试，则可能需要采取以上措施之一来解决这个问题。
