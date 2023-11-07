// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// contract 关键字 新建合约
contract Counter {
	// 变量必须声明类型
	uint num;
	address owner; // 类型为address
  //数组
	uint[] arr = [1,2,3];
	// mapping => js对象
	mapping(string=>uint) users;
	// 结构体
	struct Students {
		uint age;
		uint id;
		string name;
		uint phone;
	}
	// 枚举
	enum sex {male, female}
	constructor() {
		num = 0;
		// 结构体赋值

		// 数组赋值
		arr.push(4);
		// 结构体赋值
		users['name'] = 18;
		// msg.sender 谁部署合约,这个值就是谁的
		owner = msg.sender;
	}
	// 函数类型 public 公用函数
	function increment() public {
		if(owner == msg.sender) {
		  num += 1;
		}
	}
	// view函数 只读取变量,不写
	// 声明返回值类型
	function getNum() view public returns (uint) {
		return num;
	}

}

