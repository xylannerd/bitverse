//TODO
export const changeChain = async () => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }],
    })
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881',
              chainName: 'Mumbai',
              rpcUrls: [
                'https://rpc-mumbai.matic.today',
                'https://matic-mumbai.chainstacklabs.com',
                'https://rpc-mumbai.maticvigil.com',
                'https://matic-testnet-archive-rpc.bwarelabs.com'
              ],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC', // 2-6 characters long
                decimals: 18,
              },
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        })
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}
