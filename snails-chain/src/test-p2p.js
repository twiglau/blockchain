const dgram = require("dgram");
const udp = dgram.createSocket("udp4");

// 收信息
udp.on("message", (data, remote) => {
  console.log("accept message:", data.toString(), remote.toString());
});
udp.on("listening", function () {
  const addrInfo = udp.address();
  console.log("udp server is listening: ", addrInfo.address, addrInfo.port);
});

// udp.bind(0); // 随机分配,不会出现被占用的情况
udp.bind(8002);

// 发送信息
function send(message, port, host) {
  console.log("send message", message, port, host);
  udp.send(Buffer.from(message), port, host);
}

// 判断命令行有没有输入 port 和 host
const port = Number(process.argv[2]);
const host = process.argv[3];
if(port && host) {
  send('内侯啊', port, host)
}
