
const Bitverse = artifacts.require('Bitverse');

contract('Bitverse', (accounts) => {
    it('Smart Contract deployed properly', async () => {
        const bitverse = await Bitverse.deployed();
        console.log(bitverse.address);
        assert(bitverse.address != '', 'Invalid address!!!');
    })
})