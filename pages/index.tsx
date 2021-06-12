import styled from 'styled-components'
import Navbar from './components/navbar'
import Color from '../styles/colors'
import Head from 'next/head'
import { useState, useEffect } from 'react'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//ipfs
import { create } from 'ipfs-http-client'

export default function Home() {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<Boolean>()
  const [activeAccount, setActiveAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  // connect to the default API address http://localhost:5001
  const ipfs = create()
  // or using options
  //const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' })

  detectEthereumProvider().then((prv) => setProvider(prv))
  if (provider) {
    // console.log("check provider:  ", provider)
    // provider.request({ method: 'eth_requestAccounts' })
    //         .then(accounts => console.log("accounts: ", accounts))
  }

  //Process the uploaded file for uploading to ipfs
  const captureFile = (event) => {
    event.preventDefault()
    console.log(event.target.files)
  }

  //Upload to ipfs and return its hash
  function uploadToIpfs() {}

  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar />

      <Center>
        <h3>HOME</h3>

        <InputButton type="file" multiple onChange={captureFile} />
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
