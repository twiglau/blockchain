// 加密 安全 非堆成加密
// 公钥(所有人都知道) 私钥(只有你自己才知道)
// 用私钥加密信息  用公钥验证信息是否合法

// {
// 	msg: '你好啊,您吃了没',
// 	sign: '用私钥加密后的信息',
// 	公钥: 'xxxx'
// }

// 1. 生成公私钥对
// 2. 公钥直接当成地址用(或者截取公钥前20位)
// 3. 公钥可以通过私钥计算出来
let fs = require("fs");
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var keyPair = ec.genKeyPair();

function getPub(prv) {
  return ec.keyFromPrivate(prv).getPublic("hex").toString();
}
const KEYS = generatekeys();
// 1. 获取公私钥对 (持久化)
function generatekeys() {
  const fileName = "./wallet.json";
  try {
    let res = JSON.parse(fs.readFileSync(fileName));
    if (res.prv && res.pub && getPub(res.prv) === res.pub) {
      keyPair = ec.keyFromPrivate(res.prv);
      return res;
    } else {
      // 验证失败, 重新生成
      throw "Invalid wallet.json";
    }
  } catch (error) {
    // 文件不存在 或者不合法,重新生成
    const res = {
      prv: keyPair.getPrivate("hex").toString(),
      pub: keyPair.getPublic("hex").toString(),
    };
    fs.writeFileSync(fileName, JSON.stringify(res));
    return res;
  }
}
// 2. 签名
function sign({ from, to, amount, timestamp }) {
  const bufferMsg = Buffer.from(`${timestamp}-${amount}-${from}-${to}`);
  let signature = Buffer.from(keyPair.sign(bufferMsg).toDER()).toString("hex");
  return signature;
}
// 3. 校验签名
function verify({ from, to, amount, signature }, pub) {
  // 校验是没有私钥的
  const keyPairTemp = ec.keyFromPublic(pub, "hex");
  const bufferMsg = Buffer.from(`${signature}-${amount}-${from}-${to}`);
  return keyPairTemp.verify(bufferMsg, signature);
}

// const trans = {from:'snail', to:'me', amount:100}
// const signature = sign(trans)
// console.log('signature: ', signature)
// trans.signature = signature
// const res = verify(trans, KEYS.pub)
// console.log(signature, res)

module.exports = {
  sign,
  verify,
  KEYS,
};
