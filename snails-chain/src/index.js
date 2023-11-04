// 命令行引入
const vorpal = require("vorpal")();
const Table = require("cli-table");
const SnailsChain = require("./blockchain");
const blockChain = new SnailsChain();

// cli-table 格式化输出
function formatLog(data) {
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
vorpal.command("mine <address>", "挖矿").action(function (args, callback) {
  const newBlock = blockChain.mine(args.address);
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
vorpal.command("chain", "查看区块链").action(function (args, callback) {
  formatLog(blockChain.blockchain);
  callback();
});
// 命令 trans
vorpal
  .command("trans <from> <to> <amount>", "转账")
  .action(function (args, callback) {
    const { from, to, amount } = args;
    const trans = blockChain.transfer(from, to, amount);
    formatLog(trans);
    callback();
  });
console.log("welcome to snails chain");
vorpal.exec("help");
vorpal.delimiter("snails chain =>").show();
