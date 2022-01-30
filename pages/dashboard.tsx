import * as IPFS from 'ipfs-core'
// // //ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import bitverseAbi from '../build/contracts/Bitverse.json'
// // //
import {useSnapshot} from 'valtio'
import store from './stateGlobal/blockchainState'
import Navbar from './navbar'
import { useContext, useEffect, useState } from 'react'
import Modal from './components/dashboard/modal'
import NftModal from './components/dashboard/nftModal'

//interfaces
import { Content } from './components/interfaces'
//components
import DisplayUserContent from './components/dashboard/displayUserContent'

import { RIGHT_NETWORK } from './constants'
import { HandleDashboard } from './components/dashboard/handleDashboard'

const DashboardPage: React.FC = () => {

const snapshot = useSnapshot(store)

  // const { rootStore } = useContext(StoreContext)

  //toggle rightNetwork when on other network
  const [rightNetwork, setRightNetwork] = useState(false)

  const [userContent, setUserContent] = useState([])
  const [contentMetadata, setContentMetadata] = useState(null)
  const [userContentCount, setUserContentCount] = useState(0)
  const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
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
    initBitverseAndGetContent()
  }, [snapshot.userAddress])

  useEffect(() => {
    console.log('contentMetadata: ')

    console.log(contentMetadata)
  }, [contentMetadata])

  async function initBitverseAndGetContent() {
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    var ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })

    if (provider) {
      setMetaProvider(provider)
      const ethersProvider = new ethers.providers.Web3Provider(provider)
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

          const contractAddress = '0xaFEd7206fd95689edf4eFc0A718146bbb028ABC0'
          //bitverseAbi.networks[network].address,

          var contractBitverse = new ethers.Contract(
            contractAddress,
            bitverseAbi.abi,
            ethersProvider,
          )

          if (contractBitverse) {
            setIsLoadingContent(true)
            setBitverse(contractBitverse)

            //get all the indices that belongs to the user
            //get all the cids
            //then get all the content for those cids from the contentMapping

            //well the solidity mapping cannot return the whole array
            //but it can return the length of the array
            //so get array's length then iterate through it!
            var authorToCidIndicesArrayLength = await contractBitverse.authorToCidIndicesLength()
            console.log('indices: ' + authorToCidIndicesArrayLength)

            if (
              ipfsNode &&
              authorToCidIndicesArrayLength &&
              authorToCidIndicesArrayLength > 0
            ) {
              setUserContentCount(authorToCidIndicesArrayLength)

              var contentArray = []
              var metadataArray = []
              const metadataMap = new Map()

              for (var i = 0; i < authorToCidIndicesArrayLength; i++) {
                var cidIndex = await contractBitverse.authorToCidIndices(
                  snapshot.userAddress,
                  i,
                )
                var theCid = await contractBitverse.cidsArray(cidIndex)
                //now get the content from the contentsMapping[] array
                var content = await contractBitverse.contentsMapping(theCid)
                contentArray.push(content)
                var res = await ipfsNode.cat(content.metadataCid)
                // console.log(res)
                //sets the metadata for every Cid

                metadataMap.set(theCid, res)
              }

              if (contentArray) {
                setUserContent(contentArray)
                console.log(contentArray)
                setIsLoadingContent(false)
              }

              if (metadataMap) {
                console.log('metadata map stuff: ')

                console.log(metadataMap)
                setContentMetadata(metadataMap)
                // console.log(metadataMap.get(contentArray[0].cid))
              }
            } else {
              //author has no content yet!
              //message: Your dashboard looks empty, Lets add something!
              console.log('NO CONTENT FOUND')
              setIsLoadingContent(false)
            }
            //contentsMapping
          } else {
            setIsLoadingNetwork(false)
            setRightNetwork(false)

            console.log('no contract found')
          }
        } else {
          setRightNetwork(false)
          setIsLoadingNetwork(false)
          setIsLoadingContent(false)

          console.log('please select the correct network')
        }
      }
      if (!ipfs) {
        setIpfs(ipfsNode)
      }
    }
  }

  // async function getMetadata(mCid: string) {
  //   var res = await ipfs.get(mCid)
  //   var metadata = await res.json(res)
  //   return metadata
  // }

  return (
    <div className="div">
      {isModalOpen && (
        <Modal closeModal={setisModalOpen} ipfs={ipfs} bitverse={bitverse} />
      )}
      {isNftModalOpen && (
        <NftModal modalOpen={setIsNftModalOpen} bitverse={bitverse} userAddress={snapshot.userAddress} />
      )}

      <Navbar />

      <div className="mx-8 mb-32">
        <HandleDashboard
          contentMetadata={contentMetadata}
          isLoadingNetwork={isLoadingNetwork}
          rightNetwork={rightNetwork}
          userAddress={snapshot.userAddress}
          userContent={userContent}
          userContentCount={userContentCount}
          setIsNftModalOpen={setIsNftModalOpen}
          isNftModalOpen={isNftModalOpen}
          isLoadingContent={isLoadingContent}
          isModalOpen={isModalOpen}
        />
      </div>
    </div>
  )
}

export default DashboardPage
