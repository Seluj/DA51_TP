// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

import {DocumentUpload} from "../contracts/DocumentUpload.sol";

contract TestDocumentUpload {

    DocumentUpload documentUpload = new DocumentUpload();

    function testUploadDocument() public {
        documentUpload.uploadDocument("hash1");
        uint256 timestamp = documentUpload.verifyDocument(address(this), "hash1");
        assert(timestamp > 0);
    }

    function testVerifyDocument() public {
        uint256 timestamp = documentUpload.verifyDocument(address(this), "hash2");
        assert(timestamp == 0);
    }
}
