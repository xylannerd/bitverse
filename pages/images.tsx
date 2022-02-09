import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Navbar from './components/navComponent/navbar'
import store from './stateGlobal/blockchain.state'
import { RIGHT_NETWORK } from './utils/constants'
import * as IPFS from 'ipfs-core'
import { ethers } from 'ethers'
//temporary
import bitverseAbi from '../temporaryStuff/bitverse.json'
import { contractAddress } from '../temporaryStuff/contractAddress'
import detectEthereumProvider from '@metamask/detect-provider'
import LoadingAnimation from './components/sharedComponents/loadingAnimation'
import { Content } from './components/interfaces'
import ImageCard from './components/imagesPage/imageCard'

export default function Images() {
  //get images from the blockchain
  //preview them
  const snapshot = useSnapshot(store)

  const [rightNetwork, setRightNetwork] = useState(false)

  const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [isLoadingImages, setIsLoadingImages] = useState(true)

  const [bitverseWithProvider, setBitverseWithProvider] = useState(null)
  const [bitverseWithSigner, setBitverseWithSigner] = useState(null)

  const [images, setImages] = useState([])
  const [noImageYet, setNoImageYet] = useState(false)

  const [totalImagesCount, setTotalImagesCount] = useState(0)

  // keep this useEffect
  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.userAddress = ethereum.selectedAddress
      console.log('inside imagesPage: ' + snapshot.userAddress)
      console.log(ethereum.selectedAddress)
    }
  }, [snapshot.userAddress])

  useEffect(() => {
    initBitverseAndIpfsAndFetchImages()
    console.log('useEffect imagesPage')
  }, [])

  async function initBitverseAndIpfsAndFetchImages() {
    //here we go
    setIsLoadingImages(true)
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    var ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })
    if (!ipfs) {
      setIpfs(ipfsNode)
      console.log('ipfs-node initialised imagePage')
    }

    var ethersProvider
    var ethSigner
    var network

    if (provider) {
      setMetaProvider(provider)
      try {
        ethersProvider = new ethers.providers.Web3Provider(provider)
        ethSigner = ethersProvider.getSigner()

        network = await provider.networkVersion
      } catch (error) {
        console.log(error)
      }
      console.log('network version imagePage: ' + network)

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
            contractAddress,
            bitverseAbi.abi,
            ethersProvider,
          )
        } catch (error) {
          console.log(error)
        }

        try {
          contractWithSigner = new ethers.Contract(
            contractAddress,
            bitverseAbi.abi,
            ethSigner,
          )
        } catch (error) {
          console.log(error)
        }
        setBitverseWithProvider(contractBitverse)
        setBitverseWithSigner(contractWithSigner)
        console.log('bitverse initialised')
        //CALL FETCH NFTS HERE
        fetchTheImages(contractBitverse)
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
      console.log('fetching images on imagesPage')
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
          console.log(imagesArray)
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
              ipfs={ipfs}
              bitverseSigner={bitverseWithSigner}
              bitverseProvider={bitverseWithProvider}
              userAddress={snapshot.userAddress}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="text-white mt-32 font-semibold text-center py-4 px-8  bg-red-400 rounded-md">
            No NFTs uploaded yet!
          </div>
        </div>
      )
    }
  }

  return (
    <div className="div">
      <Navbar />
      <div className="flex flex-col mt-4  font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to Images</div>
      </div>
      {isLoadingNetwork && (
        <div className="div">
          <div className="flex flex-col items-center justify-center">
            <LoadingAnimation />
          </div>
        </div>
      )}
      //network is loaded but the user has chosen the wrong network
      {!isLoadingNetwork && !rightNetwork && (
        <div className="text-white text-center mt-16">
          Please connect to right Network - Ganache!
        </div>
      )}

      //right network //let's fetch images //shows loading-animation while
      //fetching images from the blockchain
      {rightNetwork && (
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
