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


//IPFS GATEWAYS

//`https://${IPFS_PUBLIC_GATEWAY}/ipfs/${content.cid}`
  // `ipfs://${content.cid}`
  //`http://localhost:48084/ipfs/${content.cid}`
  // https://{CID}.ipfs.infura-ipfs.io/{optional path to resource}

  ///SUB-DOMAIN Format
  //https://{CID}.ipfs.{gatewayURL}/{optional path to resource}

/* IPFS GATEWAYS */  
//ipfs.mihir.ch
//ipfs.io
//ipfs.dweb.link
export const IPFS_GATEWAY_URL = "ipfs.dweb.link"