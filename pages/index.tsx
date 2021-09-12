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

const bitverseAddress = '0x021b7D5FA4db1522b6ac3FEf6e96C6c8C831736E'

export default function Home() {
  const [fileToUpload, setFileToUpload] = useState(null)
  const [cidIpfs, setCidIpfs] = useState(null)
  const [ipfs, setipfs] = useState(null)
  const [bitverse, setBitverse] = useState(null)

  // //recoil states
  // const [mmProvider, setMmProvider] = useRecoilState(metamaskProvider)

  // const [activeAccount, setActiveAccount] = useRecoilState(connectedAccount)
  // const [chainId, setChainId] = useRecoilState(currentChainId)

  // const [ethProvider, setEthProvider] = useRecoilState(ethersProvider)
  // const [ethSigner, setEthSigner] = useRecoilState(ethersSigner)

  // let ipfs
  let chainId

  useEffect(() => {
    // initContract()
  }, [])

  useEffect(() => {
    // initIpfs()
  }, [])

  //runs with first render inside useEffect
  // function initProvider() {
  //   detectEthereumProvider().then((prv) => {
  //     setMmProvider(prv)
  //     setChainId(prv.chainId)

  //     console.log('here-----------')
  //     console.log('prv', prv)

  //     const eProvider = new ethers.providers.Web3Provider(prv)
  //     const eSigner = eProvider.getSigner()
  //     setEthProvider(eProvider)
  //     setEthSigner(eSigner)
  //   })
  // }

  //runs with first render inside useEffect
  // function initContract() {
  //   //Can be initialised with a provider or a signer
  //   const contractBitverse = new ethers.Contract(
  //     bitverseAddress,
  //     bitverseAbi.abi,
  //     ethSigner,
  //   )
  //   setBitverse(contractBitverse)
  //   console.log(contractBitverse) //working lmao
  // }

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

  // function ProviderCheck() {
  //   if (mmProvider) {
  //     return <h4>true</h4>
  //   } else {
  //     return <h4>false</h4>
  //   }
  // }

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
      {/*TODO*/}
      <div className="flex flex-col items-center justify-center mt-4 text-white ">
        <h3>HOME</h3>
        {/* <ProviderCheck /> */}
        <input type="file" onChange={captureFile} />{' '}
        {/* use 'multiple' to select multiple files */}
        <button className="mt-8" onClick={uploadToIpfs}> Upload to IPFS </button>
        <button className="mt-8" onClick={addToBitverse}> addToBitverse </button>
        {cidIpfs && <h5 style={{ margin: 32 }}>{cidIpfs}</h5>}
        <div className="flex w-64 h-64 bg-gray-600 items-center justify-center mt-16 overflow-hidden rounded-full relative">
          {cidIpfs && (
            <Image
              src={`https://ipfs.io/ipfs/${cidIpfs}`}
              layout="fill"
              // height={640}
              // width={720}
              alt="Picture of the author"
            />
          )}
        </div>
        {chainId && <div>chain id: {chainId}</div>}
        {/* <Image
              src={}
              // layout="fill"
              height={640}
              width={720}
              alt="Picture of the author"
              layout="responsive"
            /> */}
      </div>
      
    </div>
  )
}
