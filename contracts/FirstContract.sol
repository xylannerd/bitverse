pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    address public owner = msg.sender;
    uint public data;

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

    function setData(uint _data) public external {
        data = _data;
    }
}
