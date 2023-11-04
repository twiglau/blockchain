// 1. 迷你区块链 - snails chain
// 2. 区块链生成,新增,校验
// 3. 交易
// 4. 非对称加密
// 5. 挖矿
// 6. p2p网络

const crypto = require("crypto");

// 创世区块 Genesis Block
const InitBlock = {
  index: 0,
  data: "Hello snail chain",
  prevHash: "0",
  timestamp: 1699079122231,
  nonce: 1180,
  hash: "000052a482c5af097f3444da28ebddf540299d5fc8046d2006bf2b2f04c1343b",
};
class Blockchain {
  constructor() {
    this.blockchain = [InitBlock]; // 区块链条
    this.data = []; // 当前区块信息
    this.difficulty = 4; // 当前区块的难度
  }
  // 获取最新区块
  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  // 转账
  transfer(from, to, amount) {
    let nonAutoMine = from !== "0";
    if (nonAutoMine) {
      // 交易非挖矿
      const balance = this.balance(from);
      if (balance < amount) {
        console.log("Insufficient balance", from, balance, amount);
        return;
      }
    }
    // 签名校验
    const transObj = { from, to, amount };
    this.data.push(transObj);
    return transObj;
  }
  // 查看余额
  balance(address) {
    let balance = 0;
    this.blockchain.forEach((block) => {
      if (!Array.isArray(block.data)) return; // 创世区块不需要查询
      block.data.forEach((trans) => {
        const { to, from } = trans;
        if (address == from) {
          balance -= trans.amount;
        }
        if (address == to) {
          balance += trans.amount;
        }
      });
    });
    return balance;
  }
  //挖矿
  mine(address) {
    // 1.生成新区块  一页新的记账加入了区块链
    // 2.不停的计算Hash,直到符合难度条件,获得记账权

    // 挖矿结束 矿工奖励 每次挖矿成功给 100
    this.transfer("0", address, 100);
    const newBlock = this.generateNewBlock();
    // 区块合法 并且区块链和方法 就新增一下
    if (this.isValidBlock(newBlock) && this.isValidChain(this.blockchain)) {
      this.blockchain.push(newBlock);
      this.data = [];
      return newBlock;
    } else {
      console.log("error, invalid Block", newBlock);
    }
  }
  //生成新区块
  generateNewBlock() {
    let nonce = 0; // 通过随机数递增,不停计算Hash
    const index = this.blockchain.length; // 区块索引值
    const data = this.data;
    const prevHash = this.getLastBlock().hash;
    let timestamp = new Date().getTime();
    let hash = this.computeHash(index, prevHash, timestamp, data, nonce);
    // 挖矿行为
    while (hash.slice(0, this.difficulty) !== "0".repeat(this.difficulty)) {
      nonce += 1;
      hash = this.computeHash(index, prevHash, timestamp, data, nonce);
    }

    return {
      index,
      data,
      prevHash,
      timestamp,
      nonce,
      hash,
    };
  }
  computeHashForBlock({ index, prevHash, timestamp, data, nonce }) {
    return this.computeHash(index, prevHash, timestamp, data, nonce);
  }
  //计算哈希
  computeHash(index, prevHash, timestamp, data, nonce) {
    return crypto
      .createHash("sha256")
      .update(index + prevHash + timestamp + data + nonce)
      .digest("hex");
  }
  //校验区块
  isValidBlock(newBlock, prevBlock = this.getLastBlock()) {
    const lastBlick = prevBlock;
    // 1. 区块的index等于最新区块的index+1
    // 2. 区块的time 大于最新区块
    // 3. 最新区块的 prevHash 等于最新区块的 hash
    // 4. 区块的哈希值, 符合难度要求
    if (newBlock.index !== lastBlick.index + 1) {
      return false;
    } else if (newBlock.timestamp <= lastBlick.timestamp) {
      return false;
    } else if (newBlock.prevHash !== lastBlick.hash) {
      return false;
    } else if (
      newBlock.hash.slice(0, this.difficulty) !== "0".repeat(this.difficulty)
    ) {
      return false;
    } else if (newBlock.hash !== this.computeHashForBlock(newBlock)) {
      return false;
    }
    return true;
  }
  //校验区块链
  isValidChain(chain = this.blockchain, prevBlock = this.getLastBlock()) {
    // 校验区块,除了创世区块
    for (let i = chain.length - 1; i >= 1; i = i - 1) {
      if (!this.isValidBlock(chain[i], chain[i - 1])) {
        return false;
      }
    }
    // 校验创世区块
    if (JSON.stringify(chain[0]) !== JSON.stringify(InitBlock)) {
      return false;
    }
    return true;
  }
}

module.exports = Blockchain;
