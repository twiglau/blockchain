// 命令行引入
const vorpal = require("vorpal")();
const Table = require("cli-table");
const SnailsChain = require("./blockchain");
const blockChain = new SnailsChain();
const rsa = require('./rsa')

// cli-table 格式化输出
function formatLog(data) {
  if(!data || data.length === 0) return;
  if (!(data instanceof Array)) {
    data = [data];
  }
  const first = data[0];
  const TableHead = Object.keys(first);
  const table = new Table({
    head: TableHead,
    colWidths: new Array(TableHead.length).fill(20),
  });
  const TableValues = data.map((ele) => {
    return TableHead.map((key) => JSON.stringify(ele[key], null, 1)); // 一个空格的间隔
  });
  table.push(...TableValues);
  console.log(table.toString());
}
// 命令 mine
vorpal.command("mine", "挖矿").action(function (args, callback) {
  const newBlock = blockChain.mine(rsa.KEYS.pub);
  if (newBlock) {
    formatLog(newBlock);
  }
  callback();
});
// 命令 detail
vorpal
  .command("detail <index>", "查看区块详情")
  .action(function (args, callback) {
    const block = blockChain.blockchain[args.index];
    this.log(JSON.stringify(block, null, 2));
    callback(); // 作用: 一直处于命令行下,没有回调,就会退出
  });
// 命令 balance
vorpal
  .command("balance <address>", "查询地址余额")
  .action(function (args, callback) {
    const { address } = args;
    const balance = blockChain.balance(address);
    if (balance) formatLog({ balance, address });
    callback();
  });
// 命令 chain
vorpal.command("blockchain", "查看区块链").action(function (args, callback) {
  formatLog(blockChain.blockchain);
  callback();
});
// 命令 trans
vorpal
  .command("trans <to> <amount>", "转账")
  .action(function (args, callback) {
    // 本地公钥当做转出地址
    const {to, amount } = args;
    const trans = blockChain.transfer(rsa.KEYS.pub, to, amount);
    formatLog(trans);
    callback();
  });
// 命令 pub
vorpal.command("pub", "查看本地地址").action(function (args, callback) {
  console.log('地址:', rsa.KEYS.pub);
  callback();
});
// 命令 peers
vorpal.command('peers', '查看网络节点列表').action(function(args, callback) {
  formatLog(blockChain.peers);
  callback()
})
// 命令 chat
vorpal.command('chat <msg>', '跟别的节点Hi一下').action(function(args, callback) {
  blockChain.boardCast({
    type: 'Hi',
    data: args.msg
  })
  callback()
})
// 命令 pending
vorpal.command('pending', '查看还没有被打包的交易').action(function(args, callback) {
  formatLog(blockChain.data)
  callback()
})

console.log("welcome to snails chain");
vorpal.exec("help");
vorpal.delimiter("snails chain =>").show();
