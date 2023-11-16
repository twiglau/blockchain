// 1. 链接合约
// 2. 执行一下合约内部函数
// 3. 添加 ant.design UI库支持
// 4. 完成项目
import { useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import AdoptionJson from "@/truffle/build/contracts/Adoption.json";
import pets from "@/truffle/src/pets.json";

import Counter from "./test-redux/counter";
import Movie from "./test-redux/movie";

import { Layout, Space, Button, Col, Row, Card, Avatar } from "antd";
import "./App.css";

const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const InitAddress = '0x' + '0'.repeat(40)
function App() {
  const [adopters, setAdopters] = useState([])
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
    const AdoptionContract = await new web3.eth.Contract(
      AdoptionJson.abi,
      AdoptionJson.networks[networkId].address
    );
    return {
      web3,
      web3Provider,
      adoption,
      AdoptionContract,
    };
  };
  // 测试是否拿到信息
  const markAdopted = async () => {
    const { adoption } = window.WEBS;
    // 部署链接下

    const adoptionInstance = await adoption.deployed();
    const adopters = await adoptionInstance.getAdopters.call();
    setAdopters(adopters)
    console.log("adopters: ", adopters);
    return adopters;
  };
  const markAdopted2 = async () => {
    const { AdoptionContract } = window.WEBS;
    const adopters = await AdoptionContract.methods.getAdopters().call();
    setAdopters(adopters)
    return adopters;
  };
  const doAdopt = async (petId) => {
    const { adoption, web3 } = window.WEBS;
    const accounts = await web3.eth.requestAccounts();
    const account = accounts[0];
    const adoptionInstance = await adoption.deployed();
    await adoptionInstance.adopt(petId, { from: account });
    markAdopted();
  };
  const doAdopt2 = async (petId) => {
    const { AdoptionContract, web3 } = window.WEBS;
    try {
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];
      // TODO: 如何调用
      const res = await AdoptionContract.methods.adopt(petId, account).call();
      console.log("res: ", res);
      markAdopted2();
    } catch (error) {
      console.log(error);
    }
  };
  const isBtnDisabled = (index) => {
     return adopters[index] !== InitAddress
  };
  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
      size={[0, 0]}
    >
      <Layout>
        <Header style={headerStyle}>Welcome, Snail Pet Shop!</Header>
        <Content style={contentStyle}>
          <Row gutter={[16, 24]}>
            {pets.map((pet) => {
              return (
                <Col span="6" key={pet.id}>
                  <Card
                    hoverable
                    cover={<img alt={pet.Frieda} src={pet.picture} />}
                    actions={[<Button type="primary" onClick={e => doAdopt(pet.id)} disabled={isBtnDisabled(pet.id)}>领养</Button>]}
                  >
                    <Meta
                      avatar={<Avatar src={pet.picture} />}
                      title={pet.name}
                      description={pet.location}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Space>
  );
}
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
};
const contentStyle = {
  minHeight: 120,
  color: "#fff",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#7dbcea",
};
export default App;
