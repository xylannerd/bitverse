
const Bitverse = artifacts.require('Bitverse');
const IPFS = require('ipfs-core')
const ethers = require('ethers')

var chai = require('chai')
var expect = chai.expect
var should = chai.should();

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

contract("Bitverse", ([owner, user1, user2, user3]) => {

    let bitverse;
    let ipfs;

    before(async () => {
        bitverse = await Bitverse.deployed();
        ipfs = await IPFS.create();
    });

    it("Smart Contract deployed with right parameters", async () => {
        console.log("Contract Address: " + bitverse.address);
        assert(bitverse.address != '', "Invalid Contract address!!!");
    });

 describe("Adds content to Bitverse", async () => {
     
     let cid;
     
    it("Add content to IPFS and get the Cid", async () => {
        result = await ipfs.add('Hello world');
        cid = result.cid.toString();
        assert.equal(cid, "QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve", "Invalid Cid!");
        console.log("IPFS CID: " + cid);
        console.log(result);
    });

    it("Adds to smart Contract", async () => {
        console.log(cid);
        let result = await bitverse._addContent(cid, "", {from: user1});
        console.log("")
        console.log("")
        console.log("------------ **** -------------")
        console.log("")
        console.log("")
        assert.equal(result.logs[0].args[0], cid, "Cid mismatch!");
        assert.equal(result.logs[0].args[1], user1, "Invalid Author");

        expectEvent(result, 'NewContentAdded', {
            cid: cid,
            author: user1,
          });

        let indices = await bitverse.authorToCidIndices(user1, 0);
        console.log("Author's contents indices: " + indices.toString());
     

        assert.equal(indices.toString(), 0, "Author has no content");

        
       
    });

    it("Must return correct array length", async () => {
        const cidArray = await bitverse.getCidArray();
        console.log("Items in CidArray: " + cidArray.length);

        assert.lengthOf(cidArray, 1, "Invalid length");
       

    })

    it("Must return correct cid from the array", async () => {
        const cidArray = await bitverse.getCidArray();
        assert.equal(cidArray[0], "QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve", "Cid Mismatch in the cidArray");
    })

    it("Cid must return the correct author",  async () => {
        let author = await bitverse.cidToAuthor("QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve");
        console.log("Author: " + author);
        assert.equal(author, user1, "Author doesnt match.");

    })

    describe("Must initialize the Content struct with correct arguments", async () => {
        let content;
        // console.log(content);
        
        before(async () => {
            content = await bitverse.contentsMapping(cid);
        });
    
        it("Must contain correct cid", async () => {
            console.log(content.cid);
            content.cid.should.be.a('string');
            expect(content.cid).to.equal("QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve");


        });
        it("Must contain correct author", async () => {
            expect(content.author).to.equal(user1);
        });
        it("Must contain correct metadataCid", async () => {
            expect(content.metadataCid).to.be.empty;
        });
        it("Must initiliaze with 0 likes", async () => {
            // console.log(content.likes.toNumber());
            expect(content.likes.toNumber()).to.equal(0);
        });
        it("Must initialize with 0 dislikes", async () => {
            expect(content.dislikes.toNumber()).to.equal(0);
        });
        it("Must initialize with 0 netLikes", async () => {
            expect(content.netlikes.toNumber()).to.equal(0);
        });
        it("Must initialize with milestone = 0", async () => {
            expect(content.milestone.toNumber()).to.equal(0);
        });

    });


 });

 describe("The Like function works properly", async () => {

    it("Increase the likes-count of the Content", async () => {
        //Increase the likes-count of the Content

        

    });

    it("Increase the netLikes-count of the Content", async () => {
        //Increase the netLikes-count of the Content
        
    })

    it("Mints a token for the 100th Like to the Author's address", async () =>{
        //give 100 net-likes to the content
        //assert content author's balance == 1
    });

    it("Should not mint the token for same milestone", async () => {
        
        //the net like reaches 100 again
        //the milestone remains 1

        //no token is minted to the author's address
    });


 })

 describe("The Dislike function works properly", async () => {

    it("Increase the dislikes-count of the Content", async () => {
        //Increase the dislikes-count of the Content


    });

    it("Decrease the netLikes-count of the Content", async () => {
        
        //Decrease the netLikes-count of the Content
    })



    
 })

   
});