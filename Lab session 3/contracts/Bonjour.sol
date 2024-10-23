pragma solidity >=0.8.0 <0.9.0;

contract MyLab3SContract {
    string message;


    constructor (string memory initialMessage) {
        message = initialMessage;
    }
    function setMyLab3SContract(string memory newMessage) public {
        message = newMessage;
    }

    function getMyLab3SContract() public view returns (string memory) {
        return (message);
    }
}