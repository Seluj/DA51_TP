// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.8.0;

contract Adoption {
    address[16] public adopters;

    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15, "Pet-Id out of range");
        adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    function getAdopter(uint petId) public view returns (address) {
        return adopters[petId];
    }
}
