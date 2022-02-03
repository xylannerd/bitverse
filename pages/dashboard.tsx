import * as IPFS from 'ipfs-core'
// // //ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//change to '../build/contracts/Bitverse.json'
import bitverseAbi from '../temporaryStuff/bitverse.json'
import { contractAddress } from '../temporaryStuff/contractAddress'
// // //
import { useSnapshot } from 'valtio'
import store from './stateGlobal/blockchain.state'
import Navbar from './components/navComponent/navbar'
import { useContext, useEffect, useState } from 'react'
import Modal from './components/dashboard/modal'
import NftModal from './components/dashboard/nftModal'

//interfaces
import { Content } from './components/interfaces'
//components
import DisplayUserContent from './components/dashboard/displayUserContent'

import { RIGHT_NETWORK } from './utils/constants'
import { HandleDashboard } from './components/dashboard/handleDashboard'

const DashboardPage: React.FC = () => {
  const snapshot = useSnapshot(store)

  //toggle rightNetwork when on other network
  const [rightNetwork, setRightNetwork] = useState(false)

  const [userContent, setUserContent] = useState([])
  const [contentMetadata, setContentMetadata] = useState(null)
  const [userContentCount, setUserContentCount] = useState(0)
  const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [bitverse, setBitverse] = useState(null)
  const [ethProvider, setEthProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isModalOpen, setisModalOpen] = useState(false)
  const [isNftModalOpen, setIsNftModalOpen] = useState(false)

  // keep this useEffect
  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.userAddress = ethereum.selectedAddress
      console.log('inside dashboard: ' + snapshot.userAddress)
      console.log(ethereum.selectedAddress)
    }
  }, [snapshot.userAddress])

  // init bitverse contract here
  useEffect(() => {
    initBitverseAndIpfs()
  }, [snapshot.userAddress])

  useEffect(() => {
    console.log('contentMetadata: ')

    console.log(contentMetadata)
  }, [contentMetadata])

  // just init bitverse and ipfs here
  async function initBitverseAndIpfs() {
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    var ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })
    if (!ipfs) {
      setIpfs(ipfsNode)
    }

    if (provider) {
      setMetaProvider(provider)
      const ethersProvider = new ethers.providers.Web3Provider(provider)
      const ethSigner = ethersProvider.getSigner()

      const network = await provider.networkVersion

      console.log('network version: ' + network)

      //only move forward if the user has linked their wallet
      if (snapshot.userAddress) {
        //Only fetch if the user is connected to a network where the contract is deployed
        //else it may throw an ambiguous error
        //ganache networkId - 5777
        //ganache chainID - 0x539 || 1337
        //CHECK FOR THE RIGHT NETWORK HERE!
        if (network == RIGHT_NETWORK) {
          setRightNetwork(true)
          setIsLoadingNetwork(false)

          //bitverseAbi.networks[network].address,

          var contractBitverse = new ethers.Contract(
            contractAddress,
            bitverseAbi.abi,
            ethSigner,
          )
          setBitverse(contractBitverse)
        } else {
          setRightNetwork(false)
          setIsLoadingNetwork(false)

          console.log('please select the correct network')
        }
      }
    }
  }

  return (
    <div className="div">
      {isModalOpen && (
        <Modal closeModal={setisModalOpen} ipfs={ipfs} bitverse={bitverse} />
      )}
      {isNftModalOpen && (
        <NftModal
          modalOpen={setIsNftModalOpen}
          bitverse={bitverse}
          userAddress={snapshot.userAddress}
        />
      )}

      <Navbar />

      <div className="mx-8 mb-32">
        <HandleDashboard
          bitverse={bitverse}
          ipfs={ipfs}
          isLoadingNetwork={isLoadingNetwork}
          rightNetwork={rightNetwork}
          userAddress={snapshot.userAddress}
          setIsNftModalOpen={setIsNftModalOpen}
          isNftModalOpen={isNftModalOpen}
          isModalOpen={isModalOpen}
          setisModalOpen={setisModalOpen}
        />
      </div>
    </div>
  )
}

export default DashboardPage
