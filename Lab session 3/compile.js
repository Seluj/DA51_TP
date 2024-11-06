const path = require('path'); 
const fs = require('fs');
const solc = require('solc');
const MyLab3SContractPath = path.resolve(__dirname, "contracts", "Bonjour.sol");

const compilerInput = { 
	language: "Solidity", 
	sources: {
		'MyLab3SContract': { 
			content: fs.readFileSync(MyLab3SContractPath, 'utf8') 
		}
	},
	settings: { 
		outputSelection: { 
			"*": {
				"*": [ "abi", "evm.bytecode" ] 
			}
		} 
	}
};

//console.log(solc.compile(JSON.stringify(compilerInput))); 
//module.exports = solc.compile(JSON.stringify(compilerInput).conracts[':evm']) 
module.exports = solc.compile(JSON.stringify(compilerInput));