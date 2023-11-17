import * as wrapper from "solc/wrapper";
// eslint-disable-next-line no-restricted-globals
const ctx = self;

// eslint-disable-next-line no-undef
importScripts(
  "https://solc-bin.ethereum.org/bin/soljson-v0.8.6+commit.11564f7e.js"
);

ctx.addEventListener("message", ({ data }) => {
  const solc = wrapper(ctx.module);
  const compileResult = solc.compile(
    createCompileInput(data.contractFileName, data.content)
  );
  ctx.postMessage(compileResult);
});

function createCompileInput(fileName = "storage.sol", fileContent = "") {
  const CompileInput = {
    language: "Solidity",
    sources: {
      [fileName]: {
        content: fileContent,
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
  return JSON.stringify(CompileInput);
}
