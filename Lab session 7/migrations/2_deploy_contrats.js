const DocumentUpload = artifacts.require("DocumentUpload");

module.exports = function(deployer) {
    deployer.deploy(DocumentUpload);
}