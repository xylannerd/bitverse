const Bitverse = artifacts.require("Bitverse");

module.exports = function (deployer) {
  // const initialSupply = new BN('10000');

  deployer.deploy(Bitverse, 1111);
};
