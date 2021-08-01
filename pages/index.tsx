import styled from 'styled-components'
import Navbar from './components/navbar'
import Color from '../styles/colors'
import Head from 'next/head'
import { useState, useEffect } from 'react'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//ipfs
import IPFS from 'ipfs-core'

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<Boolean>()
  const [activeAccount, setActiveAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [fileToUpload, setFileToUpload] = useState(null)

  let ipfs;

  detectEthereumProvider().then((prv) => setProvider(prv))
  if (provider) {
    console.log("check provider:  ", provider)
    provider.request({ method: 'eth_requestAccounts' })
            .then(accounts => setActiveAccount(accounts[0]))
  }

  //Process the uploaded file for uploading to ipfs
  const captureFile = (event) => {
    event.preventDefault()
    console.log(event.target.files)
    setFileToUpload(event.target.files)
  }

  //Upload to ipfs and return its hash
  async function uploadToIpfs(file) {
    if(!ipfs) {
      ipfs =  await IPFS.create()
    }
    let result = await ipfs.add(file)

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
      <Navbar provider={provider} userAccount={activeAccount} /> {/*TODO*/}

      <Center>
        <h3>HOME</h3>

       <InputButton type="file" onChange={captureFile} />  {/* use 'multiple' to select multiple files */}
      <UploadButton  onClick={uploadToIpfs}> Shoot </UploadButton>
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
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 16px;

  height: 90vh;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;
  font-size: 32px;
  /* background-color: green; */
`

const InputButton = styled.input``

const UploadButton = styled.button`
  /* width: 4rem;
  height: 1rem; */
  margin-top: 1rem;
`