import Navbar from '../components/navComponent/navbar'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-screen font-bodyfont">
      <Navbar />

      <div className="flex flex-col mt-8 font-logofont text-logowhite font-bold text-2xl items-center justify-center">
        <div className="cursor-pointer">Welcome to Bitverse</div>
      </div>

      <div className="flex flex-col items-center justify-center mt-16 text-white ">
        <Link href="/nft">
          <a>
            <div className="text-white mt-32 font-semibold text-center py-4 px-8 bg-blue-400 cursor-pointer rounded-md">
              Click here and let's start from NFTs 🍭
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}
