// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.8.0;

import "truffle/Assert.sol";

import "truffle/DeployedAddresses.sol";

import {Adoption} from "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    uint expectedPetId = 8;

    address expectedAdopter = address(this);

    function testAdopt() public {
        uint returnedId = adoption.adopt(expectedPetId);

        Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
    }

    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.getAdopter(expectedPetId);

        Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
}
