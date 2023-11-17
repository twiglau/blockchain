// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseList {
    address public ceo;
    address[] public courses;

    constructor() public {
        ceo = msg.sender;
    }

    function createCourse(string _name) public {
        address newCourse = new Course(_name);
        courses.push(newCourse);
    }

    // 获取课程所有地址
    function getCourse() public view return $(address[]) {
        return courses;
    }
}

contract Course {
    string public name;

    constructor(string _name) public {}
}
