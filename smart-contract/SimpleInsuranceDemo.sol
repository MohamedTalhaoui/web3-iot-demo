pragma solidity ^0.5.0;

contract SimpleInsuranceDemo {

    address private admin;
    address payable [] public subscribers;
    mapping (address => uint256) public balanceOf;

    uint256 public pool;

    event PremiumReceived(address _from, uint256 _value);

    constructor() public {
        admin = msg.sender;
    }

    function subscribe() public payable {
        if(balanceOf[msg.sender]==0x0) {
            subscribers.push(msg.sender);
        }
        balanceOf[msg.sender] += msg.value;
        pool += msg.value;
        emit PremiumReceived(msg.sender, msg.value);
	}

    function payout(uint _index) public {
        address payable subscriber = subscribers[_index];
        subscriber.transfer(balanceOf[subscriber]);
        pool -= balanceOf[subscriber];
        balanceOf[subscriber] = 0;
    }

    function kill() public {
        require(msg.sender == admin);
        selfdestruct(msg.sender);
    }
}
