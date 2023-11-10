## 合约

- 编译合约 `truffle compile`

1. 编译完成后 `build` 文件夹下
   > 编译完成后的合约

## 部署合约

1. 重启 Ganache
2. 在`Truffle`文件夹下,`migrations` 中新建`2_deploy_contracts.js` 文件

```js
var Adoption = artifacts.require("./Adoption.sol");

module.exports = function (deployer) {
  deployer.deploy(Adoption);
};
```

3. 命令端: 部署 -`truffle migrate` 部署重置 - `truffle migrate --reset --all` 部署合约
4. 部署一个合约消耗 2 个区块

## 部署后合约如何体现效果?

1. 使用 Web 端来展现
2. 依赖的库: `web3` `truffle-contract`

# 配置项目

1. `webpack5`安装 node 的核心模块后无法安装后直接使用，需要自己手动配置否则会报错(如果没有遇到则忽略)，安装`npm i node-polyfill-webpack-plugin -D`后在 craco 中追加配置实现自动化

```js
webpack: {
    alias: {
      "@": resolve("src"),
      components: resolve("src/components"),
    },
    plugins: {
      add: [
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
      ],
    },
}
```
