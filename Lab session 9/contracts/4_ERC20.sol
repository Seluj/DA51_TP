// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "Utils.sol";

contract Lab9Token {
    using Utils for *;
    string public constant name = "DA51-Lab9";
    string public constant symbol = "Lab9";
    uint8 public constant decimals = 18;

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint token);
    mapping(address => uint256) balances;
    mapping(address => mapping(address=> uint256)) allowed;
    uint256 totalSupply_;


    constructor(uint256 initialSupply) {
        totalSupply_ = initialSupply * 10 ** uint256(decimals);
        balances[msg.sender] = totalSupply_;
    }

    function transfer(address to, uint tokens) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(balances[msg.sender] >= tokens, "Insufficient balance");

        balances[msg.sender] -= tokens;
        balances[to] += tokens;
        emit Transfer(msg.sender, to, tokens);
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool) {
        require(spender != address(0), "Invalid spender address");

        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool) {
        require(to != address(0), "Invalid to address");
        require(from != address(0), "Invalid from address");
        require(balances[from] >= tokens, "Insufficient balance");
        require(allowed[from][msg.sender] >= tokens, "Allowance exceeded");

        balances[from] -= tokens;
        balances[to] += tokens;
        allowed[from][msg.sender] -= tokens;
        emit Transfer(from, to, tokens);
        return true;
    }

    function allowedT(address tokenOwner, address spender) public view returns (uint256) 
    {
        return allowed[tokenOwner][spender];
    }
}