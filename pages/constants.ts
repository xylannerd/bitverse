//Only fetch if the user is connected to a network where the contract is deployed
//else it may throw an ambiguous error
//ganache networkId - 5777
//ganache chainID - 0x539 || 1337
//CHECK FOR THE RIGHT NETWORK HERE!

//ganache chainID - 0x539 || 1337
const ganache_networkId = 5777
const ethereum_networkId = 1

//ENTER THE NETWORK HERE
//THE CONTRACT DEPLOYMENT NETWORK
export const RIGHT_NETWORK = ganache_networkId //Replace this to change network id
