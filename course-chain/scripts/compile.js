const fs = require("fs");
const path = require("path");
const solc = require("solc");

const fileName = "Imooc.sol";

const contractPath = path.resolve(__dirname, `../contracts/${fileName}`);
// 获取合约文件内容
const source = fs.readFileSync(contractPath, "utf-8");
const Input = {
  language: "Solidity",
  sources: {
    [fileName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

// 编译
const ret = JSON.parse(solc.compile(JSON.stringify(Input)));

if (Array.isArray(ret.errors) && ret.errors.length > 0) {
  // 出错了
  console.log(ret.errors[0]);
} else {
  // 合约写入文件
  const contracts = ret.contracts[fileName];

  Object.keys(contracts).forEach((name) => {
    console.log("name: ", name);
    const contractName = name;
    const filePath = path.resolve(
      __dirname,
      `../src/compile/${contractName}.json`
    );
    fs.writeFileSync(filePath, JSON.stringify(contracts[name]));
    console.log(`${contractName}.json BingGo!`);
  });
}
