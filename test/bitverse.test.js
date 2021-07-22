const Bitverse = artifacts.require('Bitverse')
const IPFS = require('ipfs-core')
const ethers = require('ethers')

var chai = require('chai')
var expect = chai.expect
var should = chai.should()

const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

contract('Bitverse', (addresses) => {
  let bitverse
  let ipfs
  let cid

  before(async () => {
    bitverse = await Bitverse.deployed()
    ipfs = await IPFS.create()
  })

  it('Smart Contract deployed with right parameters', async () => {
    console.log('\nContract Address: ' + bitverse.address + "\n")
    assert(bitverse.address != '', 'Invalid Contract address!!!')
  })

  describe('Adds content to Bitverse', async () => {
    it('Add content to IPFS and get the Cid', async () => {
      result = await ipfs.add('Hello world')
      cid = result.cid.toString()
      assert.equal(
        cid,
        'QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve',
        'Invalid Cid!',
      )
      console.log('\nIPFS CID: ' + cid + "\n")
      console.log("\n" + result + "\n")
    })

    it('Adds to smart Contract', async () => {
      console.log(cid)
      let result = await bitverse._addContent(cid, '', { from: addresses[1] })

      assert.equal(result.logs[0].args[0], cid, 'Cid mismatch!')
      assert.equal(result.logs[0].args[1], addresses[1], 'Invalid Author')

      expectEvent(result, 'NewContentAdded', {
        cid: cid,
        author: addresses[1],
      })

      let indices = await bitverse.authorToCidIndices(addresses[1], 0)
      console.log("\nAuthor's contents indices: " + indices.toString() + "\n")

      assert.equal(indices.toString(), 0, 'Author has no content')
    })

    it('Must return correct array length', async () => {
      const cidArray = await bitverse.getCidArray()
      console.log('\nItems in CidArray: ' + cidArray.length + "\n")

      assert.lengthOf(cidArray, 1, 'Invalid length')
    })

    it('Must return correct cid from the array', async () => {
      const cidArray = await bitverse.getCidArray()
      assert.equal(
        cidArray[0],
        'QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve',
        'Cid Mismatch in the cidArray',
      )
    })

    it('Cid must return the correct author', async () => {
      let author = await bitverse.cidToAuthor(
        'QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve',
      )
      console.log('\nAuthor: ' + author + "\n")
      assert.equal(author, addresses[1], 'Author doesnt match.')
    })

    describe('Must initialize the Content struct with correct arguments', async () => {
      let content
      // console.log(content);

      before(async () => {
        content = await bitverse.contentsMapping(cid)
      })

      it('Must contain correct cid', async () => {
        console.log("\n" + content.cid + "\n")
        content.cid.should.be.a('string')
        expect(content.cid).to.equal(
          'QmNRCQWfgze6AbBCaT1rkrkV5tJ2aP4oTNPb5JZcXYywve',
        )
      })
      it('Must contain correct author', async () => {
        expect(content.author).to.equal(addresses[1])
      })
      it('Must contain correct metadataCid', async () => {
        expect(content.metadataCid).to.be.empty
      })
      it('Must initiliaze with 0 likes', async () => {
        // console.log(content.likes.toNumber());
        expect(content.likes.toNumber()).to.equal(0)
      })
      it('Must initialize with 0 dislikes', async () => {
        expect(content.dislikes.toNumber()).to.equal(0)
      })
      it('Must initialize with 0 netLikes', async () => {
        expect(content.netlikes.toNumber()).to.equal(0)
      })
      it('Must initialize with milestone = 0', async () => {
        expect(content.milestone.toNumber()).to.equal(0)
      })
    })
  })

  describe('The Like and mint function works properly', async () => {
    let result
    let content

    before(async () => {
      result = await bitverse.like(cid, { from: addresses[2] })
      content = await bitverse.contentsMapping(cid)
    })

    it('Increase the likes-count of the Content', async () => {
      //Increase the likes-count of the Content
      expect(content.likes.toNumber()).to.equal(1)
    })

    it('Increase the netLikes-count of the Content', async () => {
      //Increase the netLikes-count of the Content
      expect(content.netlikes.toNumber()).to.equal(1)
    })

    it('Emits the like event', async () => {
      expectEvent(result, 'ContentLiked', {
        cid: cid,
        liker: addresses[2],
      })
    })
  })

  describe('The Dislike function works properly', async () => {
    let result
    let content

    before(async () => {
      result = await bitverse.dislike(cid, { from: addresses[3] })
      content = await bitverse.contentsMapping(cid)
    })

    it('Increase the dislikes-count of the Content', async () => {
      //Increase the dislikes-count of the Content
      expect(content.dislikes.toNumber()).to.equal(1)
    })

    it('Decrease the netLikes-count of the Content', async () => {
      //Decrease the netLikes-count of the Content
      expect(content.netlikes.toNumber()).to.equal(0)
    })

    it('Emits the dislike event', async () => {
      expectEvent(result, 'ContentDisliked', {
        cid: cid,
        disliker: addresses[3],
      })
    })
  })

    describe('Mints token for likes given', async () => {

      let results = [];
      let content;

      // async function likesTx() {
      //   let i = 4;
      //   while (i < 7) {
      //    yield bitverse.like(cid, {from: addresses[i++]});
      //    yield r;
      //   }
      // }

      //give 5 net-likes to the content
      before(async () => {
        for (let i = 4; i < 10; i++){
          await bitverse.like(cid, {from: addresses[i]})
        }

        // result = await bitverse.like(cid, {from: addresses[4]})
      })

      beforeEach(async () => {
        content = await bitverse.contentsMapping(cid)
      })

      it("Mints a token for the 5th Like to the Author's address", async () => {

        //assert content author's balance == 1
        const balance = await bitverse.balanceOf(addresses[1]);
        expect(balance.toNumber()).to.equal(1);
        console.log("\nAuthor's balance: " + balance.toNumber()+ "\n");

      })

    //   it('Should not mint the token for same milestone', async () => {
    //     //the net like reaches 100 again
    //     //the milestone remains 1
    //     //no token is minted to the author's address
    //   })

  })
})
