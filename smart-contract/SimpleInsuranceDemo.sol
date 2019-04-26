pragma solidity ^0.5.0;

contract SimpleInsuranceDemo {

address private admin;
address payable [] public subscribers;
uint256 public pool;

    constructor() public {
        admin = msg.sender;
    }

    function subscribe() public payable {
        subscribers.push(msg.sender);
        pool += msg.value;
	}

    function payout() public {
        uint256 amount = pool / subscribers.length;
        for (uint index = 0; index < subscribers.length; index++) {
            subscribers[index].transfer(amount);
        }
    }
    function kill() public {
        require(msg.sender == admin);
        selfdestruct(msg.sender);
    }

}
