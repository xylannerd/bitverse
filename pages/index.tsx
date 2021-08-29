import styled from 'styled-components'
import Navbar from './components/navbar'
import Color from '../styles/colors'
import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//ipfs
import IPFS from 'ipfs-core'
import Image from 'next/image'
import bitverseAbi from '../build/contracts/Bitverse.json'

const bitverseAddress = '0x021b7D5FA4db1522b6ac3FEf6e96C6c8C831736E'

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<Boolean>()
  const [isConnectedToMetamask, setIsConnectedToMetamask] = useState<Boolean>()
  const [activeAccount, setActiveAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [metamaskProvider, setMetamaskProvider] = useState(null)
  const [ethProvider, setEthProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [fileToUpload, setFileToUpload] = useState(null)
  const [cidIpfs, setCidIpfs] = useState(null)
  const [ipfs, setipfs] = useState(null)
  const [bitverse, setBitverse] = useState(null)

  // let ipfs

  useEffect(() => {
    initProvider()
    initContract()
  }, [])

  useEffect(() => {
    initIpfs()
  }, [])

  useEffect(() => {
    ethereum.on('accountsChanged', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.

      handleAccountsChanged(accounts)
    })
  }, [activeAccount])

  useEffect(() => {
    ethereum.on('chainChanged', (_chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      handleChainChanged(_chainId)
    })
  }, [chainId])

  useEffect(() => {
    if (ethereum.selectedAddress) {
      setActiveAccount(ethereum.selectedAddress)
    }
  }, [activeAccount])

  useEffect(() => {
    ethereum.on('disconnect',  (error) => {
      window.location.reload()
      console.log("Metamask Disconnected");
      
    });

  }, [activeAccount])

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.')
    } else if (accounts[0] !== activeAccount) {
      setActiveAccount(accounts[0])
      // Do any other work!
    }
  }

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    if (chainId !== _chainId) {
      window.location.reload()
    }
  }

  //runs with first render inside useEffect
  function initProvider() {
    detectEthereumProvider().then((prv) => {
      setMetamaskProvider(prv)
      setChainId(prv.chainId)

      console.log('here-----------')
      console.log('prv', prv)

      const ethProvider = new ethers.providers.Web3Provider(prv)
      const ethSigner = ethProvider.getSigner()
      setEthProvider(ethProvider)
      setSigner(ethSigner)
    })
  }

  //runs with first render inside useEffect
  function initContract() {
    //Can be initialised with a provider or a signer
    const contractBitverse = new ethers.Contract(
      bitverseAddress,
      bitverseAbi.abi,
      signer,
    )
    setBitverse(contractBitverse)
    console.log(contractBitverse) //working lmao
  }

  function requestForAccount() {
    metamaskProvider
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

    setIsConnectedToMetamask(true)
  }

  async function initIpfs() {
    //If you’ve already initialised IPFS on a repo, it will lock it.
    // If you’d like to test with multiple repos, you can use something like this:
    let ipfsNode = await IPFS.create({ repo: 'ok' + Math.random() }) //init an ipfs node with a new repo
    setipfs(ipfsNode)
    console.log(ipfsNode)

    // ipfs = await IPFS.create() //may show lock repo error!
  }

  //Process the uploaded file for uploading to ipfs
  const captureFile = (event) => {
    event.preventDefault()
    console.log(event.target.files)
    setFileToUpload(event.target.files[0])
  }

  //Upload to ipfs and return its hash
  async function uploadToIpfs() {
    if (!ipfs) {
      initIpfs()
    }
    if (!fileToUpload) {
      console.log('No file to Upload!')
    } else {
      let result
      try {
        result = await ipfs.add(fileToUpload)
      } catch (error) {
        console.error(error)
      }

      setCidIpfs(result.cid.toString())
      console.log(result.cid.toString())
    }
  }

  async function addToBitverse() {
    if (!bitverse) {
      console.log('Contract not initialized')
    } else if (!cidIpfs) {
      console.log('No ipfs cid found')
    } else {
      console.log('adding to bitverse...')

      const result = await bitverse._addContent(cidIpfs, '')
      console.log('-----------------')
      console.log(result)
    }
  }

  function ProviderCheck() {
    if (metamaskProvider) {
      return <h4>true</h4>
    } else {
      return <h4>false</h4>
    }
  }

  return (
    <div className="bg-gray-800 h-screen font-bodyfont">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar
        provider={metamaskProvider}
        userAccount={activeAccount}
        requestAccount={requestForAccount}
        isConnected={isConnectedToMetamask}
      />{' '}
      {/*TODO*/}
      <div className="flex flex-col items-center justify-center mt-4 text-white ">
        <h3>HOME</h3>
        <ProviderCheck />
        <InputButton type="file" onChange={captureFile} />{' '}
        {/* use 'multiple' to select multiple files */}
        <UploadButton onClick={uploadToIpfs}> Upload to IPFS </UploadButton>
        <button onClick={addToBitverse}> addToBitverse </button>
        {cidIpfs && <h5 style={{ margin: 32 }}>{cidIpfs}</h5>}
        <ImageHolder>
          {cidIpfs && (
            <Image
              src={`https://ipfs.io/ipfs/${cidIpfs}`}
              layout="fill"
              // height={640}
              // width={720}
              alt="Picture of the author"
            />
          )}
        </ImageHolder>
        <div>chain id: {chainId}</div>
        {/* <Image
              src={}
              // layout="fill"
              height={640}
              width={720}
              alt="Picture of the author"
              layout="responsive"
            /> */}
      </div>
      {/* <style global jsx>
        {`
          body {
            margin: 0;
            padding: 0;
            border: 0;
            font-family: 'Roboto', sans-serif;
            background-color: ${Color.backGroundGray};
          }
        `}
      </style> */}
    </div>
  )
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

  /* padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px; */

  /* height: 90vh; */

  align-items: center;
  /* justify-content: center; */

  /* font-size: 32px; */
  /* background-color: green; */
`
const ImageHolder = styled.div`
  height: 16rem;
  width: 16rem;
  background: #dfdedd14;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;
  overflow: hidden;
  border-radius: 100%;
  position: relative;
`

const InputButton = styled.input``

const UploadButton = styled.button`
  /* width: 4rem;
  height: 1rem; */
  margin: 1rem;
`
