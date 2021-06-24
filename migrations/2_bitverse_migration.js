const Bitverse = artifacts.require("Bitverse");

module.exports = function (deployer) {
  // const initialSupply = new BN('10000');
  
  // const defaultOperators = ["0x854539D46883d9830194Ca9C7f703C735b415981"];

  deployer.deploy(Bitverse, 10000);
};
