## 智能合约

- 区块链上的代码
- 语言是类 JavaScript 的 solidity

## 工具/插件

- VSCode 插件: `solidity`
- 合约编辑器: `remix`[https://remix.ethereum.org/]
- 本地工具: `Ganache` 模拟本地网络
- truffle: 合约开发套件[]

1. 全局安装 `npm install -g truffle`
2. 查看示例项目 `truffle unbox pet-shop`

## 基本数据类型

1. 布尔值
   true false
   && || !
2. 整型
   uint 无符号整型 只能表示正数
   int 和 js 里的 number 类似
3. 地址
   以太坊的地址 40 位,每个 16 进制占 4 个字节, 所以整个长度为 160

- 合约里面全局变量 msg.sender 部署合约的地址(合约的拥有者)
- 地址有很多方法, balance 查看余额, transfer 转账

4. 字符串
   string name = 'snails';
5. 数组

   ```js
   uint [] arr = [];
    arr.push(6);
    for(uint i = 0; i<arr.length;i++) {

    }
   ```

6. mapping
   所谓的 mapping, 和 js 的对象是一个东西

7. struct
8. 枚举
