
const Bitverse = artifacts.require('Bitverse');
const IPFS = require('ipfs-core')

contract("Bitverse", ([owner, user1, user2, user3]) => {

    let bitverse;

    before(async () => {
        bitverse = await Bitverse.deployed();
    });

    it("Smart Contract deployed with right parameters", async () => {
        console.log("Contract Address: " + bitverse.address);
        assert(bitverse.address != '', "Invalid Contract address!!!");
    });

 describe("IPFS Content", async () => {
     
    it("Add content to IPFS and get the Cid", async () => {
        const ipfs = await IPFS.create();
        const { cid } = await ipfs.add('Hello world');
        assert.equal(cid, "QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve", "Invalid Cid!");
        console.log("IPFS CID: " + cid);
    });
 });

   
})