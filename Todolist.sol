pragma solidity ^0.8.13;

contract TodoList {
	Todo[] public _Todo;


	struct Todo {
		string task;
		bool done;
	}

	function create_todo(string memory task, bool doneOrNot) public  {
		_Todo.push();
		uint256 newIndex = _Todo.length - 1;

		_Todo[newIndex].task = task;
		_Todo[newIndex].done = doneOrNot;
	}

	function get_todos() public returns(Todo[] memory) {
		return _Todo;
	}
 
}