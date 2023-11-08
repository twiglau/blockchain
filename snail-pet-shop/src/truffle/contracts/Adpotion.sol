// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Adpotion {
	address[16] public adopters;

	function adopt(uint petId) public returns(uint) {
		// 断言
		require(petId>=0 && petId<16);
		adopters[petId] = msg.sender;
	}
	function getAdopters() public view returns(address[16] memory) {
		return adopters;
	}
}