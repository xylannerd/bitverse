import Link from 'next/link'
import { useState } from 'react'
import Navbar from './navbar'
import { NftCard } from './components/nftPage/nftCard'



//nft_metadata_cid: QmPzhc9ezphJ85qJWfVVpeHkPieDJznpYduGhMYD7Z4Ac9
//ipfs_gateway_url: 

export default function Nfts() {
  //make sure the wallet is connected
  //check if the user is connected to the right network


  return (
    <div className="div">
      <Navbar />
      <div className="flex mt-4 font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to NFTs</div>
      </div>
      <div className="flex flex-row justify-center px-8 gap-x-4 gap-y-4 mt-16 flex-wrap">
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
        <NftCard />
      </div>
    </div>
  )
}
