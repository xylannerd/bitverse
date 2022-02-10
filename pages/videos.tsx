import Link from 'next/link'
import Navbar from './components/navComponent/navbar'

export default function Nfts() {
  return (
    <div className="div">
      <Navbar />
      <div className="flex mt-8 font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to Videos</div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex w-96 flex-row justify-center items-center text-white mt-64 font-bold py-4 px-8 bg-red-400 rounded-md">
          This page will come soon 🚧
        </div>
      </div>
    </div>
  )
}
