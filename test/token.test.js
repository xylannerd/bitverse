
const Bitverse = artifacts.require('Bitverse');



contract("Bitverse", ([owner, user1, user2, user3]) => {

    let bitverse;
    
    before(async () => {
        bitverse = await Bitverse.deployed();
    });


    describe("ERC20 Token Deployment", async () => {

        it("Correct token name", async () => {
            const tokenName = await bitverse.name();
            console.log("Token Name: " + tokenName);
            assert.equal(tokenName, "Bitstone", "Incorrect token name");
          
    
        });
    
        it("Correct token symbol", async () => {
            const tokenSymbol = await bitverse.symbol();
            console.log("Token Symbol: " + tokenSymbol);
            assert.equal(tokenSymbol, "BIT", "Incorrect token symbol.");
        });
    
        it('Initial supply of 10000 Bitstones', async() => {
            const balance = await bitverse.balanceOf(owner);
            console.log(balance);
            assert.equal(balance, 10000, "Initial Supply isnt 10000");
        })

    });

  
   
})