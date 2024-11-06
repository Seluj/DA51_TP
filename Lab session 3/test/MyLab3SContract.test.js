const assert = require('assert'); 
const ganache = require('ganache-cli');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
//const web3 = new Web3('http://localhost:8545');
//const web3 = new Web3(ganache.provider(), null, { transactionConfirmationBlocks: 1 }); 
//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let accounts; 
beforeEach(async () => { 
	accounts = await web3.eth.getAccounts()
});
describe('MyLab3SContract', () => {
	it('Deploy a contract', () => { 
		console.log(accounts) 
	});
});