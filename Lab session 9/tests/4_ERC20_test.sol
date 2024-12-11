// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

import "remix_tests.sol"; 
import "../contracts/4_ERC20.sol";

contract testLab9Token {
    Lab9Token lab9Token;

    address owner;
    address account1 = address(0x123);
    address account2 = address(0x456);


    function beforeAll() public {
        lab9Token = new Lab9Token(1000);
        owner = address(this);
    }

    function testApprove() public {
        uint approveAmount = 1000;
        bool success = lab9Token.approve(account1, approveAmount);
        Assert.equal(success, true, "Approval should succeed");

        uint allowance = lab9Token.allowedT(owner, account1);
        Assert.equal(allowance, approveAmount, "Allowance is not set correctly");
    }

    function testTransfer() public {
        uint initialOwnerBalance = lab9Token.balanceOf(owner);
        uint transferAmount = 500;

        bool success = lab9Token.transfer(account1, transferAmount);
        Assert.equal(success, true, "Transfer should succeed");

        uint newOwnerBalance = lab9Token.balanceOf(owner);
        uint recipientBalance = lab9Token.balanceOf(account1);

        Assert.equal(
            newOwnerBalance,
            initialOwnerBalance - transferAmount,
            "Owner balance incorrect after transfer"
        );
        Assert.equal(
            recipientBalance,
            transferAmount,
            "Recipient balance incorrect after transfer"
        );
    }

    function testTransferFailsOnInsufficientBalance() public {
        uint transferAmount = 10000;

        try lab9Token.transfer(account1, transferAmount) {
            
        } catch Error(string memory reason) {
            Assert.equal(reason, "Insufficient balance", "Incorrect revert reason");
        }
    }
}

