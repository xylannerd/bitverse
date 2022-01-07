import Navbar from './components/navbar'
import Head from 'next/head'
import Image from 'next/image'

import { useState, useEffect } from 'react'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
//ipfs
import IPFS from 'ipfs-core'
import bitverseAbi from '../build/contracts/Bitverse.json'

import React from 'react'



const bitverseAddress = '0x021b7D5FA4db1522b6ac3FEf6e96C6c8C831736E'



export default function Home() {
  const [fileToUpload, setFileToUpload] = useState(null)
  const [cidIpfs, setCidIpfs] = useState(null)
  const [ipfs, setipfs] = useState(null)
  const [bitverse, setBitverse] = useState(null)


  // let ipfs
  let chainId

  useEffect(() => {
    // initContract()
  }, [])

  useEffect(() => {
    // initIpfs()
  }, [])


  return (
    <div className="h-screen font-bodyfont">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>


      <Navbar />

      <div className="flex flex-col items-center justify-center mt-4 text-white ">
        <h3>HOME</h3>
      </div>
      
    </div>
  )
}
