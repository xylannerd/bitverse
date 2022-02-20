import * as IPFS from 'ipfs-core'
// // //ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//change to '../build/contracts/Bitverse.json'
import bitverseAbi from '../contract-mumbai-testnet/bitverse.json'
import { contractMumbaiAddress } from '../contract-mumbai-testnet/contractAddress'
// // //
import { useSnapshot } from 'valtio'
import store from '../stateGlobal/blockchain.state'
import Navbar from './components/navComponent/navbar'
import { useContext, useEffect, useState } from 'react'
import ContentModal from './components/dashboard/addContentModal/addContentModal'
import NftModal from './components/dashboard/addNftModal/addNftModal'

//interfaces
import { Content } from '../utils/interfaces'
//components
import DisplayUserContent from './components/dashboard/userContentPreview/displayUserContent'

import { RIGHT_NETWORK } from '../utils/constants'
import  HandleDashboard  from './components/dashboard/handleDashboard'

const DashboardPage: React.FC = () => {
  const snapshot = useSnapshot(store)

  //toggle rightNetwork when on other network
  const [rightNetwork, setRightNetwork] = useState(false)

  const [userContent, setUserContent] = useState([])
  const [contentMetadata, setContentMetadata] = useState(null)
  const [userContentCount, setUserContentCount] = useState(0)
  // const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [bitverseSigner, setBitverseSigner] = useState(null)
  const [ethProvider, setEthProvider] = useState(null)
  const [ethSigner, setEthSigner] = useState(null)

  const [isModalOpen, setisModalOpen] = useState(false)
  const [isNftModalOpen, setIsNftModalOpen] = useState(false)

  // keep this useEffect
  useEffect(() => {
    //@ts-ignore
    if (ethereum.selectedAddress) {
      //@ts-ignore
      store.userAddress = ethereum.selectedAddress
      // console.log('inside dashboard: ' + snapshot.userAddress)
      // console.log(ethereum.selectedAddress)
    }
  }, [snapshot.userAddress])

  // init bitverse contract here
  useEffect(() => {
    initBitverseAndIpfs()
  }, [snapshot.userAddress])

  // useEffect(() => {
  //   // console.log('contentMetadata: ')

  //   // console.log(contentMetadata)
  // }, [contentMetadata])

 

  // just init bitverse and ipfs here
  async function initBitverseAndIpfs() {
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    try {
      var ipfsNode = snapshot.ipfs
        ? snapshot.ipfs
        : await IPFS.create({ repo: 'ok' + Math.random() })
    } catch (error) {
      console.log(error)
    }
    if (!snapshot.ipfs) {
      store.ipfs = ipfsNode
    }

    if (provider) {
      setMetaProvider(provider)
      try {
        var ethersProvider = new ethers.providers.Web3Provider(provider)
        var eSigner = ethersProvider.getSigner()
        //@ts-ignore
        var network = await provider.networkVersion
        setEthProvider(ethersProvider)
        setEthSigner(eSigner)
      } catch (error) {
        console.log(error)
      }
      // console.log('network version: ' + network)

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
          //initializing bitverse with signer coz the user must be present to access dashboard
          try {
            var contractBitverse = new ethers.Contract(
              contractMumbaiAddress,
              bitverseAbi.abi,
              eSigner,
            )
          } catch (error) {
            console.log(error)
          }
          setBitverseSigner(contractBitverse)
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
        <ContentModal
          closeModal={setisModalOpen}
          ipfs={snapshot.ipfs}
          bitverseSigner={bitverseSigner}
        />
      )}
      {isNftModalOpen && (
        <NftModal
          setIsNftModalOpen={setIsNftModalOpen}
          bitverseSigner={bitverseSigner}
          userAddress={snapshot.userAddress}
        />
      )}

      <Navbar />

      <div className="mx-8 mb-32">
        <HandleDashboard
          ethSigner={ethSigner}
          bitverseSigner={bitverseSigner}
          ipfs={snapshot.ipfs}
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
