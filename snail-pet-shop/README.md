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

3. 命令端: `truffle migrate --reset --all` 部署合约
