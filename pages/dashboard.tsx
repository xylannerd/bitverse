import Navbar from './components/navbar'
import { useEffect, useState } from 'react'
import Modal from './components/modal'
import Image from 'next/image'
import Lottie from 'react-lottie'

import loadingAnimation from '../public/79943-spiral-dots-preloader.json'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import bitverseAbi from '../build/contracts/Bitverse.json'

import store from './store/rootstore'
import { observer } from 'mobx-react-lite'
import IPFS from 'ipfs-core'
import { CID } from 'multiformats/cid'

const Dashboard: React.FC = observer(() => {
  //ganache networkId - 5777
  //ganache chainID - 0x539 || 1337
  const RIGHT_NETWORK = 5777

  const IPFS_GATEWAY = 'ipfs.io'
  const IPFS_PUBLIC_GATEWAY = 'dweb.link'
  const PINATA_PUBLIC_GATEWAY = 'gateway.pinata.cloud'

  const [rightNetwork, setRightNetwork] = useState(false)

  const [userContent, setUserContent] = useState([])
  const [contentMetadata, setContentMetadata] = useState(null)
  const [userContentCount, setUserContentCount] = useState(0)
  const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [bitverse, setBitverse] = useState(null)
  const [ethProvider, setEthProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isModalOpen, setisModalOpen] = useState(false)

  // const projectId = ''
  // const projectSecret = ''
  // const auth =
  //   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

  interface Content {
    cid: string
    metadataCid: string
    author: string
    likes: number
    dislikes: number
    netLikes: number
    milestone: number
    timeStamp: number
  }

  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.setAddress(ethereum.selectedAddress)
    }
  }, [store.address])

  // init bitverse contract here
  useEffect(() => {
    initBitverseAndGetContent()
  }, [])

  async function initBitverseAndGetContent() {
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()
    var ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })
    if (provider && ipfsNode) {
      const ethersProvider = new ethers.providers.Web3Provider(provider)
      const network = await provider.networkVersion

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

          var contractBitverse = new ethers.Contract(
            bitverseAbi.networks[network].address,
            bitverseAbi.abi,
            ethersProvider,
          )

          if (contractBitverse) {
            setIsLoadingContent(true)
            //get all the indices that belongs to the user
            //get all the cids
            //then get all the content for those cids from the contentMapping

            //well the solidity mapping cannot return the whole array
            //but it can return the length of the array
            //so get array's length then iterate through it!
            var authorToCidIndicesArrayLength = await contractBitverse.authorToCidIndicesLength()
            // console.log('indices: ' + authorToCidIndicesArrayLength)

            if (authorToCidIndicesArrayLength > 0) {
              setUserContentCount(authorToCidIndicesArrayLength)

              var contentArray = []
              var metadataArray = []
              const metadataMap = new Map()

              for (var i = 0; i < authorToCidIndicesArrayLength; i++) {
                var cidIndex = await contractBitverse.authorToCidIndices(
                  store.address,
                  i,
                )
                var theCid = await contractBitverse.cidsArray(cidIndex)
                //now get the content from the contentsMapping[] array
                var content = await contractBitverse.contentsMapping(theCid)
                contentArray.push(content)
                var res = await ipfsNode.cat(content.metadataCid)
                // console.log(res)
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

          console.log('please select the correct network')
        }
      }
      setMetaProvider(provider)
      setEthProvider(ethersProvider)
      setBitverse(contractBitverse)
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
    return <Lottie options={defaultOptions} height={200} width={200} />
  }

  function DisplayUserContent() {
    if (userContentCount > 0 && userContent) {
      //fetch and display content
      return (
        <div className="div">
          {userContent.map((content: Content) => (
            <ContentCard key={content.cid} content={content} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="text-white font-semibold text-center py-4  bg-red-400 rounded-md">
          Seems like you have no uploads yet
        </div>
      )
    }
  }

  function ContentCard({ content }) {
    //`https://${IPFS_PUBLIC_GATEWAY}/ipfs/${content.cid}`
    // `ipfs://${content.cid}`
    //`http://localhost:48084/ipfs/${content.cid}`
    // https://{CID}.ipfs.infura-ipfs.io/{optional path to resource}

    ///SUB-DOMAIN Format
    //https://{CID}.ipfs.{gatewayURL}/{optional path to resource}

    let cid
    //cid v1 is new and better than cid v0, lookup up the reasons yourself
    if (CID.parse(content.cid).version == 0) {
      cid = CID.parse(content.cid).toV1().toString()
    } else {
      cid = content.cid
    }

    const imageSource = `https://${cid}.ipfs.${IPFS_PUBLIC_GATEWAY}`

    return (
      <div className="flex w-full h-56 border-b border-opacity-40">
        <div className="flex flex-row items-center">
          <div
            id="imageBackground"
            className="flex w-44 h-5/6 shrink-0 items-center z-10 mx-4 justify-items-start bg-gray-700 bg-opacity-50 rounded-sm overflow-hidden "
          >
            <div className="relative">
              <Image
                className="object-contain"
                src={imageSource}
                unoptimized={true}
                layout="fill"
              />
            </div>
          </div>
          <div
            id="cardBody"
            className="flex grow h-full p-4 bg-blue-900 bg-opacity-20"
          >
            <div className="flex flex-col text-white">
              <div className="div">title</div>
              <div className="div">Description</div>
              <div className="div">woooooooo</div>
              <div className="align-bottom">
                Cid: {CID.parse(content.cid).toV1().toString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function HandleDashboard() {
    if (store.address) {
      return (
        <>
          {isModalOpen && <Modal closeModal={setisModalOpen} ipfs={ipfs} />}

          {isLoadingNetwork ? (
            <Loading />
          ) : (
            <div className="div">
              {rightNetwork && (
                <div className="div">
                  <div className="flex flex-col items-center justify-center mt-8">
                    <div
                      className="flex flex-col w-10/12 bg-black text-white border-dashed border-2 border-gray-400 select-none  cursor-pointer py-8 rounded-md items-center justify-center shadow-md"
                      onClick={() => setisModalOpen(!isModalOpen)}
                    >
                      <p>+</p>
                      <p>Add Content</p>
                    </div>

                    <div className="w-10/12 mt-11">
                      <h1 className="text-gray-200 font-bold text-xl">
                        My Uploads
                      </h1>
                    </div>
                  </div>

                  {isLoadingContent ? (
                    <Loading />
                  ) : (
                    <div className="flex mt-8 w-full h-full bg-yellow-500 bg-opacity-50 justify-center">
                      <DisplayUserContent />
                    </div>
                  )}
                </div>
              )}

              {!rightNetwork && (
                <p className="text-white mt-8 text-center ">
                  {' '}
                  Please connect to the Ganache Network{' '}
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
    <div className="bg-black">
      <Navbar />
      <HandleDashboard />
    </div>
  )
})

export default Dashboard
