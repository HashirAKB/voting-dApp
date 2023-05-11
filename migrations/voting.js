const Election = artifacts.require("Election");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Election);
};