import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Navbar from './components/navComponent/navbar'
import { NftCard } from './components/nftPage/nftCard'
import store from './stateGlobal/blockchain.state'
import { RIGHT_NETWORK } from './utils/constants'
import * as IPFS from 'ipfs-core'
import { ethers } from 'ethers'
//temporary
import bitverseAbi from '../temporaryStuff/bitverse.json'
import { contractAddress } from '../temporaryStuff/contractAddress'
import detectEthereumProvider from '@metamask/detect-provider'
import LoadingAnimation from './components/sharedComponents/loadingAnimation'
import { Nft } from './components/interfaces'

//nft_metadata_cid: QmPzhc9ezphJ85qJWfVVpeHkPieDJznpYduGhMYD7Z4Ac9
//ipfs_gateway_url:

export default function Nfts() {
  //make sure the wallet is connected
  //check if the user is connected to the right network

  //get nfts from the blockchain
  //preview them
  const snapshot = useSnapshot(store)

  const [rightNetwork, setRightNetwork] = useState(false)

  const [ipfs, setIpfs] = useState(null)
  const [metaProvider, setMetaProvider] = useState(null)

  //toggle isLoadingNetwork when on other network
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true)
  const [isLoadingNfts, setIsLoadingNfts] = useState(true)

  const [bitverseWithProvider, setBitverseWithProvider] = useState(null)
  const [bitverseWithSigner, setBitverseWithSigner] = useState(null)

  const [nfts, setNfts] = useState([])
  const [noNftYet, setNoNftYet] = useState(false)

  const [totalNftsCount, setTotalNftsCount] = useState(0)

  // keep this useEffect
  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.userAddress = ethereum.selectedAddress
      console.log('inside nftPage: ' + snapshot.userAddress)
      console.log(ethereum.selectedAddress)
    }
  }, [snapshot.userAddress])

  useEffect(() => {
    initBitverseAndIpfsAndFetchNfts()
    console.log('useEffect nftPage')
  }, [])

  // just init bitverse and ipfs here
  async function initBitverseAndIpfsAndFetchNfts() {
    setIsLoadingNfts(true)
    setIsLoadingNetwork(true)
    const provider = await detectEthereumProvider()

    var ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })
    if (!ipfs) {
      setIpfs(ipfsNode)
      console.log('ipfs-node initialised nftPage')
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
      console.log('network version nftPage: ' + network)

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
        fetchTheNfts(contractBitverse)
      } else {
        setRightNetwork(false)
        setIsLoadingNetwork(false)
        console.log('please select the correct network')
      }
    }
  }

  //FETCH NFT FUNCTION
  async function fetchTheNfts(_bitverse) {
    if (_bitverse) {
      console.log('fetching nfts on nftPage')
      var nftsArray = []

      var totalNfts = await _bitverse.numNfts()
      console.log('total nfts:')
      console.log(totalNfts.toNumber())
      setTotalNftsCount(totalNfts.toNumber())

      if (totalNfts && totalNfts > 0) {
        for (var i = 0; i < totalNfts; i++) {
          var nft = await _bitverse.nftMapping(i)
          nftsArray.push(nft)
        }

        if (nftsArray) {
          setNfts(nftsArray)
          console.log(nftsArray)
          console.log('nftArray initialised')
          setIsLoadingNfts(false)
        }
      } else {
        console.log('NO NFT UPLOADED YET!')
        setNoNftYet(true)
        setIsLoadingNfts(false)
      }
    } else {
      console.log('Contract not found!')
    }
  }

  function ShowNfts() {
    if (nfts && totalNftsCount > 0) {
      return (
        <div className="flex flex-row justify-center px-8 gap-x-4 gap-y-4 mt-16 flex-wrap">
          {nfts.map((nft: Nft) => (
            <NftCard
              key={nft.id.toNumber()}
              nft={nft}
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
      <div className="flex mt-4 font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to NFTs</div>
      </div>
      //show loading-animation when the network is loading
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
      //right network //let's fetch nft //shows loading-animation while fetching
      nfts from the blockchain
      {rightNetwork && (
        <div className="div">
          {!isLoadingNfts ? (
            <ShowNfts />
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
