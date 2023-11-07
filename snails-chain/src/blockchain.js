// 1. 迷你区块链 - snails chain
// 2. 区块链生成,新增,校验
// 3. 交易
// 4. 非对称加密
// 5. 挖矿
// 6. p2p网络

const crypto = require("crypto");
const dgram = require("dgram");
const rsa = require("./rsa");
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
    this.peers = []; // 所有的网络节点信息, { address, port}
    this.remote = {};
    this.seed = { port: 8001, address: "localhost" }; // 种子节点
    this.udp = dgram.createSocket("udp4");
    this.init();
  }
  init() {
    this.bindP2p();
    this.bindExit();
  }
  bindP2p() {
    this.udp.on("message", (data, remote) => {
      const { address, port } = remote;
      const action = JSON.parse(data);
      // {type:'要干啥', data:{} // 具体传递的信息}
      if (action.type) {
        this.dispatch(action, { address, port });
      }
    });
    this.udp.on("listening", () => {
      const address = this.udp.address();
      console.log("[信息]: udp 监听完毕 端口是: " + address.port);
    });
    // 区分种子节点和普通节点(端口0即可,随机分配)
    // 种子节点端口必须约定
    console.log(process.argv);
    const port = Number(process.argv[2] || 0);
    this.startNode(port);
  }
  startNode(port) {
    this.udp.bind(port);
    // 如果不是种子节点
    // 需要发送一个消息告诉种子节点:我来了
    if (port !== 8001) {
      this.send(
        {
          type: "new-peer",
        },
        this.seed.port,
        this.seed.address
      );
      // 把种子节点加入到本地节点中
      this.peers.push(this.seed);
    }
  }
  send(message, port, address) {
    // console.log('send: ',message, port, address);
    this.udp.send(JSON.stringify(message), port, address);
  }
  boardCast(action) {
    // 广播全场
    this.peers.forEach((v) => {
      this.send(action, v.port, v.address);
    });
  }
  dispatch(action, remote) {
    const { port, address } = remote;
    console.log("接收到P2P网络的消息:", address, port);
    // 接收到网络的消息在这里处理
    switch (action.type) {
      case "new-peer":
        // 种子节点要做的事情
        // 1. 你的公网ip和port是啥
        this.send(
          {
            type: "remote-address",
            data: remote,
          },
          port,
          address
        );
        // 2. 现在全部节点的列表
        this.send(
          {
            type: "peer-list",
            data: this.peers,
          },
          port,
          address
        );
        // 3. 告诉所有已知节点,来了个新朋友,块打招呼
        this.boardCast({
          type: "say-hi",
          data: remote,
        });
        // 4. 告诉你现在区块链的数据
        this.send(
          {
            type: "block-chain",
            data: JSON.stringify({
              blockchain: this.blockchain,
              // trans: this.data
            }),
          },
          port,
          address
        );
        this.peers.push(remote);
        console.log("你好啊, 新朋友,请你喝茶", remote);
        break;
      case "block-chain":
        // 同步本地链
        let allData = JSON.parse(action.data);
        let newChain = allData.blockchain;
        this.replaceChain(newChain);
        break;
      case "remote-address":
        // 存储远程信息,退出的时候用到
        this.remote = action.data;
        break;
      case "peer-list":
        // 远程告诉,现在的节点列表
        const newPeers = action.data;
        this.addPeers(newPeers);
        break;
      case "say-hi":
        let remotePeer = action.data;
        this.peers.push(remotePeer);
        console.log("[信息] 新朋友你好, 相识就是缘!");
        this.send(
          { type: "Hi", data: "Hi, Refresher" },
          remotePeer.port,
          remotePeer.address
        );
        break;
      case "Hi":
        console.log(`${remote.address}:${remote.port}: ${action.data}`);
        break;
      case "trans":
        // 网络上收到的交易请求
        // 是不是有重复交易
        let getP = this.data.find((v) => this.isEqualObj(v, action.data));
        if (!getP) {
          console.log("[有新的交易] 请注意查收");
          this.addTrans(action.data);
          this.boardCast({ type: "trans", data: action.data });
        }
        break;
      case "mine":
        // 网络上有人挖矿成功
        const lastBlock = this.getLastBlock();
        if (lastBlock.hash === action.data.hash) return; // 重复的消息
        if (this.isValidBlock(action.data, lastBlock)) {
          console.log("[信息] 有朋友挖矿成功, 让我们一起给他喝彩 💐");
          this.blockchain.push(action.data);
          //清空本地消息
          this.data = [];
          // 再次广播全场 - 保证可靠
          this.boardCast({
            type: "mine",
            data: action.data,
          });
        } else {
          console.log("[错误] 挖矿区块不合法");
        }
        break;
      default:
        console.log("传入到default里面了");
        break;
    }
  }
  isEqualObj(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    return keys1.every((key) => obj1[key] === obj2[key]);
  }
  addPeers(peers) {
    console.log("peers: ", peers);
    peers.forEach((p) => {
      // 新节点如果不存在
      // 就添加一个到peers
      let getP = this.peers.find((v) => this.isEqualObj(p, v));

      console.log("getP: ", getP);
      if (!getP) {
        this.peers.push(p);
      }
    });
  }
  bindExit() {
    process.on("exit", () => {
      console.log("[信息]: 网络一线牵,珍惜这段缘! 👋🏻");
    });
  }
  // 获取最新区块
  getLastBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  // 转账
  transfer(from, to, amount) {
    const timestamp = new Date().getTime();
    // 签名校验
    const signature = rsa.sign({ from, to, amount, timestamp });
    console.log("transfer sign:", signature);
    const sigTrans = { from, to, amount, timestamp, signature };

    let nonAutoMine = from !== "0";
    if (nonAutoMine) {
      // 交易非挖矿
      const balance = this.balance(from);
      if (balance < amount) {
        console.log("Insufficient balance", from, balance, amount);
        return;
      }
      // 广播
      this.boardCast({
        type: "trans",
        data: sigTrans,
      });
    }
    this.data.push(sigTrans);
    return sigTrans;
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
  isValidTransfer(trans) {
    // 是不是合法的转账
    return rsa.verify(trans, trans.from);
  }
  addTrans(trans) {
    if (this.isValidTransfer(trans)) {
      this.data.push(trans);
    }
  }
  //挖矿
  mine(address) {
    // 校验所欲交易合法性
    let everyValid = this.data.every((d) => this.isValidTransfer(d));
    if (!everyValid) {
      console.log("transfer Invalid");
      return;
    }

    // 1.生成新区块  一页新的记账加入了区块链
    // 2.不停的计算Hash,直到符合难度条件,获得记账权

    // 挖矿结束 矿工奖励 每次挖矿成功给 100
    this.transfer("0", address, 100);
    const newBlock = this.generateNewBlock();
    // 区块合法 并且区块链和方法 就新增一下
    if (this.isValidBlock(newBlock) && this.isValidChain(this.blockchain)) {
      this.blockchain.push(newBlock);
      this.data = [];
      console.log("[消息]: 挖矿成功");
      // 广播全场
      this.boardCast({
        type: "mine",
        data: newBlock,
      });
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
  replaceChain(newChain) {
    // 先不校验交易
    if (newChain.length === 1) return;
    if (
      this.isValidChain(newChain) &&
      newChain.length > this.blockchain.length
    ) {
      // 拷贝一份
      this.blockchain = JSON.parse(JSON.stringify(newChain));
    } else {
      console.log("[错误]: 不合法链");
    }
  }
}

module.exports = Blockchain;
