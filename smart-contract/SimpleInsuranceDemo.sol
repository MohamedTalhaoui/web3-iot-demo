pragma solidity ^0.5.0;

contract SimpleInsuranceDemo {

    address private admin;
    address payable[] public holders;
    mapping (address => uint256) public balanceOf;
    mapping (address => string) public name;

    uint256 public pool;

    event HolderUpdate(address holder, string name, uint256 balance);

    constructor() public {
        admin = msg.sender;
    }

    function getHoldersCount() public view returns(uint holderCount) {
        return holders.length;
    }

    function subscribe(string memory _name) public payable {
        if(balanceOf[msg.sender]==0x0) {
            holders.push(msg.sender);
        }
        balanceOf[msg.sender] += msg.value;
        name[msg.sender] = _name;
        pool += msg.value;
        emit HolderUpdate(msg.sender, _name, balanceOf[msg.sender]);
	}

    function payout(uint _index) public payable {
        address payable holder = holders[_index];
        string memory holderName = name[holder];
        uint256 balance = balanceOf[holder];
        holder.transfer(balance);
        pool -= balanceOf[holder];
        delete holders[_index];
        delete balanceOf[holder];
        delete name[holder];
        emit HolderUpdate(holder, holderName, 0);
    }

    function kill() public {
        require(msg.sender == admin, "Sender not Authorized");
        selfdestruct(msg.sender);
    }
}
