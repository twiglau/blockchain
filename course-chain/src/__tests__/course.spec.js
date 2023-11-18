/**
 * @jest-environment jest-environment-jsdom
 */
const path = require("path");
const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache");

const web3 = new Web3(ganache.provider());
// 引入合约的json
const CourseList = require(path.resolve(
  __dirname,
  "../compile/CourseList.json"
));
const Course = require(path.resolve(__dirname, "../compile/Course.json"));

// 定义几个全局变量, 所有测试需要
let accounts;
// 实例
let courseList;
let course;
describe("测试课程=>", () => {
  beforeEach(async () => {
    // 初始化 - 操作
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
  });
  it("1 + 2 = 2", () => {
    assert.equal(1 + 2, 3);
  });
});
