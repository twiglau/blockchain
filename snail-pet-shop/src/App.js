// 1. 链接合约
// 2. 执行一下合约内部函数
// 3. 添加 ant.design UI库支持
// 4. 完成项目
import { useEffect, useReducer } from "react";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import AdoptionJson from "@/truffle/build/contracts/Adoption.json";
const PROVIDER = "web3/provider";
const WEB3 = "web3/name";
const ADOPTION = "web3/adoption";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const { adoption: truffleAdoption, web3Provider } = state;
    if (typeof window.web3 !== "undefined") {
      dispatch({ type: PROVIDER, web3Provider: window.web3.currentProvider });
    } else {
      alert("请安装metaMask");
    }
    const web3 = new Web3(web3Provider);
    dispatch({ type: WEB3, web3 });
    // 初始化合约
    const adoption = TruffleContract(AdoptionJson);
    dispatch({ type: ADOPTION, adoption });
    console.log("web3: ", web3, adoption);
    truffleAdoption && truffleAdoption.setProvider(web3Provider);

    truffleAdoption && markAdopted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAdopted = async () => {
    const { adoption } = state;
    // 部署链接下

    const adoptionInstance = await adoption.deployed();
    const adopters = await adoptionInstance.getAdopters.call();
    console.log("adopters: ", adopters);
    return adopters;
  };
  return <div className="App"></div>;
}

export default App;

const initialState = {
  web3: null,
  web3Provider: null,
};
function reducer(state, action) {
  switch (action.type) {
    case WEB3:
      return { ...state, web3: action.web3 };
    case PROVIDER:
      return { ...state, web3Provider: action.web3Provider };
    case ADOPTION:
      return { ...state, adoption: action.adoption };
    default:
      break;
  }
}
