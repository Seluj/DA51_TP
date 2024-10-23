// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract DocumentUpload {

    struct Document {
        string documentHash;
        uint256 timestamp;
    }

    mapping(address => mapping(string => Document)) public documents;

    function uploadDocument(string memory _documentHash) public {
        require(bytes(_documentHash).length > 0, "Document hash is required");

        Document storage document = documents[msg.sender][_documentHash];
        document.documentHash = _documentHash;
        document.timestamp = block.timestamp;

    }

    function verifyDocument(address _uploader, string memory _documentHash) public view returns (uint256) {
        Document storage document = documents[_uploader][_documentHash];
        if (bytes(document.documentHash).length == 0) {
            return 0;
        } else {
            return document.timestamp;
        }
    }
}
