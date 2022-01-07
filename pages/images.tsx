import Link from 'next/link'
import Navbar from './components/navbar'

export default function Nfts() {
  return (
    <div className="div">
      <Navbar />
      <div className="flex mt-4  font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to Images</div>
      </div>
    </div>
  )
}
