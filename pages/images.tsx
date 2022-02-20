import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Navbar from './components/navComponent/navbar'
import store from '../stateGlobal/blockchain.state'
import { RIGHT_NETWORK } from '../utils/constants'
import * as IPFS from 'ipfs-core'
import { ethers } from 'ethers'
//temporary
import bitverseAbi from '../contract-mumbai-testnet/bitverse.json'
import { contractMumbaiAddress } from '../contract-mumbai-testnet/contractAddress'
import detectEthereumProvider from '@metamask/detect-provider'
import LoadingAnimation from './components/sharedComponents/loadingAnimation'
import { Content } from '../utils/interfaces'
import ImageCard from './components/imagesPage/imageCard'
import { AlchemyProvider } from '@ethersproject/providers'
import NetworkChangePopUp from './components/sharedComponents/networkChangePopUp'

export default function Images({ alchemy_key }) {
  //get images from the blockchain
  //preview them
  const snapshot = useSnapshot(store)

  const [rightNetwork, setRightNetwork] = useState(false)

  // const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)
  const [alchemyProvider, setAlchemyProvider] = useState(null)

  const [bitverseWithProvider, setBitverseWithProvider] = useState(null)
  const [bitverseWithSigner, setBitverseWithSigner] = useState(null)
  const [bitverseWithAlchemy, setBitverseWithAlchemy] = useState(null)

  const [images, setImages] = useState([])
  const [noImageYet, setNoImageYet] = useState(false)

  const [totalImagesCount, setTotalImagesCount] = useState(0)

  //UI STATE
  const [networkChangePopup, setNetworkChangePopUp] = useState(false)
  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [isLoadingImages, setIsLoadingImages] = useState(true)

  // keep this useEffect
  useEffect(() => {
    //@ts-ignore
    if (ethereum.selectedAddress) {
      //@ts-ignore
      store.userAddress = ethereum.selectedAddress
      // console.log('inside imagesPage: ' + snapshot.userAddress)
      // console.log(ethereum.selectedAddress)
    }
  }, [snapshot.userAddress])

  useEffect(() => {
    initBitverseAndIpfsAndFetchImages()
    // console.log('useEffect imagesPage')
  }, [])

  async function initBitverseAndIpfsAndFetchImages() {
    //here we go
    setIsLoadingImages(true)
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    try {
      var ethersAlchemyProvider = new AlchemyProvider('maticmum', alchemy_key)
      var bitverseAlchemy = new ethers.Contract(
        contractMumbaiAddress,
        bitverseAbi.abi,
        ethersAlchemyProvider,
      )
      setAlchemyProvider(ethersAlchemyProvider)
      setBitverseWithAlchemy(bitverseAlchemy)
      fetchTheImages(bitverseAlchemy)
    } catch (error) {
      console.log(error)
    }

    var ipfsNode = snapshot.ipfs
      ? snapshot.ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })
    if (!snapshot.ipfs) {
      store.ipfs = ipfsNode
      // console.log('ipfs-node initialised imagePage')
    }

    var ethersProvider
    var ethSigner
    var network

    if (provider) {
      setMetaProvider(provider)
      try {
        ethersProvider = new ethers.providers.Web3Provider(provider)
        ethSigner = ethersProvider.getSigner()
        //@ts-ignore
        network = await provider.networkVersion
      } catch (error) {
        console.log(error)
      }
      // console.log('network version imagePage: ' + network)

      //ganache networkId - 5777
      //ganache chainID - 0x539 || 1337
      //CHECK FOR THE RIGHT NETWORK HERE!
      if (network == RIGHT_NETWORK) {
        setRightNetwork(true)
        setIsLoadingNetwork(false)

        //bitverseAbi.networks[network].address,
        var contractBitverse
        var contractWithSigner

        try {
          contractBitverse = new ethers.Contract(
            contractMumbaiAddress,
            bitverseAbi.abi,
            ethersProvider,
          )
        } catch (error) {
          console.log(error)
        }

        try {
          contractWithSigner = new ethers.Contract(
            contractMumbaiAddress,
            bitverseAbi.abi,
            ethSigner,
          )
        } catch (error) {
          console.log(error)
        }
        setBitverseWithProvider(contractBitverse)
        setBitverseWithSigner(contractWithSigner)
        // console.log('bitverse initialised')
        //CALL FETCH IMAGES HERE
        // fetchTheImages(contractBitverse)
      } else {
        setRightNetwork(false)
        setIsLoadingNetwork(false)
        console.log('please select the correct network')
      }
    }
  }

  //FETCH IMAGES FUNCTION
  async function fetchTheImages(_bitverse) {
    if (_bitverse) {
      // console.log('fetching images on imagesPage')
      var contentCidArray = []
      var contentArray = []
      var imagesArray = []

      //get cidArray length
      //iterate through the array to the content-cids
      //iterate through the mapping contentsMapping()
      //show the contents which has contentType == 'image'

      // const totalContentCount = await _bitverse.getTotalContentCount()

      // for(var i = 0; i < totalContentCount; i++){

      // }

      contentCidArray = await _bitverse.getCidArray()

      for (var i in contentCidArray) {
        var image = await _bitverse.contentsMapping(contentCidArray[i])
        contentArray.push(image)
      }

      //let's filter images-type from the contents
      if (contentArray) {
        contentArray.forEach((content: Content) => {
          if (content.contentType === 'image') {
            imagesArray.push(content)
          }
        })

        if (imagesArray) {
          setTotalImagesCount(imagesArray.length)
          setImages(imagesArray)
          // console.log(imagesArray)
          setIsLoadingImages(false)
        }
      }
    } else {
      console.error('Contract not found!')
    }
  }

  function ShowImages() {
    if (images && totalImagesCount > 0) {
      return (
        <div className="flex flex-row justify-center px-8 gap-x-4 gap-y-4 mt-16 flex-wrap">
          {images.map((image: Content) => (
            <ImageCard
              key={image.cid}
              image={image}
              ipfs={snapshot.ipfs}
              bitverseSigner={bitverseWithSigner}
              bitverseProvider={bitverseWithProvider}
              bitverseAlchemy={bitverseWithAlchemy}
              userAddress={snapshot.userAddress}
              networkVersion={snapshot.networkId}
              setNetworkChangePopUp={setNetworkChangePopUp}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-white mt-32 font-semibold text-center py-4 px-8  bg-red-400 rounded-md">
            No image uploaded yet!
          </div>
        </div>
      )
    }
  }

  return (
    <div className="div">
      {/* network change popUp here */}
      {networkChangePopup && (
        <NetworkChangePopUp setNetworkChangePopUp={setNetworkChangePopUp} />
      )}
      <Navbar />
      <div className="flex flex-col mt-8 font-logofont text-logowhite font-bold text-2xl ml-8 items-center justify-center">
        <div className="cursor-pointer">Welcome to Images</div>
      </div>
      {isLoadingNetwork && (
        <div className="div">
          <div className="flex flex-col items-center justify-center">
            <LoadingAnimation />
          </div>
        </div>
      )}
      {/* //network is loaded but the user has chosen the wrong network */}
      {/* {!isLoadingNetwork && !rightNetwork && (
        <div className="text-white text-center mt-16">
          Please connect to right Network - Ganache!
        </div>
      )} */}

      {/* //right network //let's fetch images //shows loading-animation while
      //fetching images from the blockchain */}
      {!isLoadingNetwork && (
        <div className="div">
          {!isLoadingImages ? (
            <ShowImages />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <LoadingAnimation />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {
      alchemy_key: process.env.ALCHEMY_KEY,
      alchemy_url: process.env.ALCHEMY_URL,
    },
  }
}
