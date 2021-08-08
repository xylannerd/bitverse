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

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<Boolean>()
  const [isConnectedToMetamask, setIsConnectedToMetamask] = useState<Boolean>()
  const [activeAccount, setActiveAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [fileToUpload, setFileToUpload] = useState(null)
  const [cidIpfs, setCidIpfs] = useState(null)
  const [ipfs, setipfs] = useState(null)

  // let ipfs

  useEffect(() => {
    detectEthereumProvider().then((prv) => setProvider(prv))
  }, [])

  useEffect(() => {
    initIpfs()
  }, [])

  function requestForAccount() {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => setActiveAccount(accounts[0]))
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
    console.log(ipfs)

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
      console.error('No file to Upload!')
    }
    let result
    try {
      result = await ipfs.add(fileToUpload)
    } catch (error) {
      console.error('ipfs add error' + error)
    }

    setCidIpfs(result.cid.toString())
    console.log(result.cid.toString())
  }
  function ProviderCheck() {
    if (provider) {
      return <h4>true</h4>
    } else {
      return <h4>false</h4>
    }
  }

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar
        provider={provider}
        userAccount={activeAccount}
        requestAccount={requestForAccount}
        isConnected={isConnectedToMetamask}
      />{' '}
      {/*TODO*/}
      <Center>
        <h3>HOME</h3>
        <ProviderCheck />
        <InputButton type="file" onChange={captureFile} />{' '}
        {/* use 'multiple' to select multiple files */}
        <UploadButton onClick={uploadToIpfs}> Upload to IPFS </UploadButton>
        {cidIpfs && <h5 style={{margin: 32}}>{cidIpfs}</h5>}
        <ImageHolder>
        {cidIpfs && (
          <Image
            src={`https://ipfs.io/ipfs/${cidIpfs}`}
            layout='fill'
            // height={500}
            // width={500}
            alt="Picture of the author"
          />
          
        )}
        </ImageHolder>
      </Center>
      <style global jsx>
        {`
          body {
            margin: 0;
            padding: 0;
            border: 0;
            font-family: 'Roboto', sans-serif;
            background-color: ${Color.backGroundGray};
          }
        `}
      </style>
    </div>
  )
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  /* padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px; */

  /* height: 90vh; */

  align-items: center;
  /* justify-content: center; */

  color: white;
  /* font-size: 32px; */
  /* background-color: green; */
`
const ImageHolder = styled.div`
  height: 16rem;
  width: 20rem;
  background: burlywood;
  display: flex;
  margin-top: 4rem;
  overflow: hidden;
`

const InputButton = styled.input``

const UploadButton = styled.button`
  /* width: 4rem;
  height: 1rem; */
  margin-top: 1rem;
`
