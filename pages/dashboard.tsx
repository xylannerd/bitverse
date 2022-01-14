import Navbar from './components/navbar'
import { useEffect, useState } from 'react'
import Modal from './components/dashboard/modal'
import NftModal from './components/dashboard/nftModal'
import Lottie from 'react-lottie'

//interfaces
import { Content } from './components/interfaces'
//components
import DisplayUserContent from './components/dashboard/displayUserContent'

import loadingAnimation from '../public/79943-spiral-dots-preloader.json'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import bitverseAbi from '../build/contracts/Bitverse.json'

import store from './store/rootstore'
import { observer } from 'mobx-react-lite'
import IPFS from 'ipfs-core'

const Dashboard: React.FC = observer(() => {
  //ganache chainID - 0x539 || 1337
  const ganache_networkId = 5777
  const ethereum_networkId = 1

  //ENTER THE NETWORK HERE
  //THE CONTRACT DEPLOYMENT NETWORK
  const RIGHT_NETWORK = ethereum_networkId

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

  setIsNftModalOpen
  // const projectId = ''
  // const projectSecret = ''
  // const auth =
  //   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.setAddress(ethereum.selectedAddress)
    }
  }, [store.address])

  // init bitverse contract here
  useEffect(() => {
    initBitverseAndGetContent()
  }, [])

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
    if (provider && ipfsNode) {
      setMetaProvider(provider)

      const ethersProvider = new ethers.providers.Web3Provider(provider)
      const network = await provider.networkVersion

      setEthProvider(ethersProvider)

      console.log('network version: ' + network)

      //only move forward if the user has linked their wallet
      if (store.address) {
        //Only fetch if the user is connected to a network where the contract is deployed
        //else it may throw an ambiguous error
        //ganache networkId - 5777
        //ganache chainID - 0x539 || 1337
        //CHECK FOR THE RIGHT NETWORK HERE!
        if (network == RIGHT_NETWORK) {
          setRightNetwork(true)
          setIsLoadingNetwork(false)

          // var contractBitverse = new ethers.Contract(
          //   bitverseAbi.networks[network].address,
          //   bitverseAbi.abi,
          //   ethersProvider,
          // )

          // if (contractBitverse) {
          //   setIsLoadingContent(true)
          //   setBitverse(contractBitverse)

          //   //get all the indices that belongs to the user
          //   //get all the cids
          //   //then get all the content for those cids from the contentMapping

          //   //well the solidity mapping cannot return the whole array
          //   //but it can return the length of the array
          //   //so get array's length then iterate through it!
          //   var authorToCidIndicesArrayLength = await contractBitverse.authorToCidIndicesLength()
          //   // console.log('indices: ' + authorToCidIndicesArrayLength)

          //   if (authorToCidIndicesArrayLength > 0) {
          //     setUserContentCount(authorToCidIndicesArrayLength)

          //     var contentArray = []
          //     var metadataArray = []
          //     const metadataMap = new Map()

          //     for (var i = 0; i < authorToCidIndicesArrayLength; i++) {
          //       var cidIndex = await contractBitverse.authorToCidIndices(
          //         store.address,
          //         i,
          //       )
          //       var theCid = await contractBitverse.cidsArray(cidIndex)
          //       //now get the content from the contentsMapping[] array
          //       var content = await contractBitverse.contentsMapping(theCid)
          //       contentArray.push(content)
          //       var res = await ipfsNode.cat(content.metadataCid)
          //       // console.log(res)
          //       //sets the metadata for every Cid

          //       metadataMap.set(theCid, res)
          //     }

          //     if (contentArray) {
          //       setUserContent(contentArray)
          //       console.log(contentArray)
          //       setIsLoadingContent(false)
          //     }

          //     if (metadataMap) {
          //       console.log('metadata map stuff: ')

          //       console.log(metadataMap)
          //       setContentMetadata(metadataMap)
          //       // console.log(metadataMap.get(contentArray[0].cid))
          //     }
          //   } else {
          //     //author has no content yet!
          //     //message: Your dashboard looks empty, Lets add something!
          //     console.log('NO CONTENT FOUND')
          //     setIsLoadingContent(false)
          //   }
          //   //contentsMapping
          // } else {
          //   setIsLoadingNetwork(false)
          //   setRightNetwork(false)

          //   console.log('no contract found')
          // }
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

  function Loading() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }
    return <Lottie options={defaultOptions} height={180} width={180} />
  }

  function AddNft() {
    return (
      <div
        className="flex py-4 flex-col w-10/12 lg:w-8/12 xl:w-7/12 select-none cursor-pointer  rounded-md items-center justify-center shadow-xl relative overflow-hidden"
        onClick={() => setIsNftModalOpen(!isNftModalOpen)}
      >
        <img
          className="-z-50 absolute"
          src="/deer-nft.jpg"
          object-fit="cover"
        />
        <div className="z-10 flex flex-col justify-center items-center text-white font-bold  ">
          <p>+</p>
          <p>Add NFT</p>
        </div>
      </div>
    )
  }

  function AddContent() {
    return (
      <div
        className="mt-4 py-4 flex flex-col w-10/12 lg:w-8/12 xl:w-7/12 bg-black text-white font-bold border-dashed border-2 border-gray-400 select-none cursor-pointer rounded-md items-center justify-center shadow-md"
        onClick={() => setisModalOpen(!isModalOpen)}
      >
        <p>+</p>
        <p>Add Content</p>
      </div>
    )
  }

  function HandleDashboard() {
    if (store.address) {
      return (
        <>
          {isLoadingNetwork ? (
            <Loading />
          ) : (
            <div className="div">
              {rightNetwork && (
                <div className="div">
                  <div className="flex flex-col items-center justify-center mt-8">
                    <AddNft />
                    <AddContent />

                    <div className="w-10/12 lg:w-8/12 xl:w-7/12  mt-11">
                      <h1 className="text-gray-200 font-bold text-xl">
                        My Uploads
                      </h1>
                    </div>
                  </div>

                  {isLoadingContent ? (
                    <Loading />
                  ) : (
                    <div className="flex mt-8 w-full h-full bg-opacity-50 justify-center">
                      {/* {contentMetadata && <p>{contentMetadata.get(userContent[0].cid)}</p>} */}
                      <DisplayUserContent
                        userContentCount={userContentCount}
                        userContent={userContent}
                        userMetadata={contentMetadata}
                      />
                    </div>
                  )}
                </div>
              )}

              {!rightNetwork && (
                <p className="text-white mt-8 text-center ">
                  {' '}
                  Please connect to the Ganache Network
                </p>
              )}
            </div>
          )}
        </>
      )
    } else {
      return (
        <p className="text-white mt-8 text-center ">
          {' '}
          Please link your wallet to see your content{' '}
        </p>
      )
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
          ethProvider={ethProvider}
        />
      )}

      <Navbar />

      <div className="mx-8 mb-32">
        <HandleDashboard />
      </div>
    </div>
  )
})

export default Dashboard
