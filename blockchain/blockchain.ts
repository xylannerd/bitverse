import detectEthereumProvider from '@metamask/detect-provider'

import { ethers } from 'ethers'




export function getMetamaskProvider(){
    detectEthereumProvider().then((provider) => {
      return provider
      })
}

export function getEthersProvider(){
    detectEthereumProvider().then((provider) => {
        const ethProvider = new ethers.providers.Web3Provider(provider)
        return ethProvider
        })
}


export function getEthersSigner(){
    detectEthereumProvider().then((provider) => {
        const ethProvider = new ethers.providers.Web3Provider(provider)
         const ethSigner = ethProvider.getSigner()

        return ethSigner
        })
}


export function getCurrentChainId(){
    detectEthereumProvider().then((provider) => {
        return provider.chainId
        })
  }
}


export function getCurrentAccount(){
    
}


export function requestForAccount() {
    detectEthereumProvider().then((provider) => {
        provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => handleAccountsChanged(accounts))
        .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.')
        } else {
          console.error(err)
        }
      })

  }
}



function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.')
    } else if (accounts[0] !== activeAccount) {
      // setActiveAccount(accounts[0])
      // Do any other work!
    }
  }
