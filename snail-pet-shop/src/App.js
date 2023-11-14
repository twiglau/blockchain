// 1. 链接合约
// 2. 执行一下合约内部函数
// 3. 添加 ant.design UI库支持
// 4. 完成项目
import { useEffect } from "react";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import AdoptionJson from "@/truffle/build/contracts/Adoption.json";

import Counter from "./test-redux/counter";
import Movie from "./test-redux/movie";

function App() {
  useEffect(() => {
    async function start() {
      const webInfo = await initialFunc();
      window.WEBS = webInfo;
      await markAdopted();
      await markAdopted2();
    }
    start();
  }, []);
  // 获取基本信息
  const initialFunc = async () => {
    let web3Provider;
    if (typeof window.web3 !== "undefined") {
      web3Provider = window.web3.currentProvider;
    } else {
      alert("请安装metaMask");
    }
    const web3 = new Web3(web3Provider);
    // 初始化合约
    // 1. 方式一:
    const adoption = TruffleContract(AdoptionJson);
    adoption.setProvider(web3Provider);
    // 2. 方式二:
    const networkId = await web3.eth.net.getId();
    const AdoptionContract = await new web3.eth.Contract(AdoptionJson.abi, AdoptionJson.networks[networkId].address)
    return {
      web3,
      web3Provider,
      adoption,
      AdoptionContract
    };
  };
  // 测试是否拿到信息
  const markAdopted = async () => {
    const { adoption } = window.WEBS;
    // 部署链接下

    const adoptionInstance = await adoption.deployed();
    const adopters = await adoptionInstance.getAdopters.call();
    console.log("adopters: ", adopters);
    return adopters;
  };
  const markAdopted2 = async () => {
    const { AdoptionContract } = window.WEBS
    const adopters = await AdoptionContract.methods.getAdopters().call();
    console.log('adopters2: ', adopters)
    return adopters;
  }
  const doAdopt = async (petId) => {
    const { adoption, web3 } = window.WEBS;
    const accounts = await web3.eth.requestAccounts()
    const account = accounts[0]
    const adoptionInstance = await adoption.deployed()
    await adoptionInstance.adopt(petId, {from: account })
    markAdopted()
  }
  return (
    <div className="App">
      <button onClick={e => doAdopt(1)}>领养第二个</button>
      <Counter />
      <Movie />
    </div>
  );
}

export default App;
