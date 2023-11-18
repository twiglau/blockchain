// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseList {
    address public ceo;
    address[] public courses;

    constructor() {
        ceo = msg.sender;
    }

    function createCourse(string memory _name) public {
        // 这里语义不明确
        // TODO: 是否有问题
        address newCourse = address(new Course(_name));
        courses.push(newCourse);
    }

    // 获取课程所有地址
    function getCourse() public view returns (address[] memory) {
        return courses;
    }
}

contract Course {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}
