import { useEffect } from "react"

interface PropType {
  bitverse: any
  ipfs: any
  userAddress: string
}

const DisplayUserNfts: React.FC<PropType> = ({ bitverse, ipfs, userAddress }) => {
  useEffect(() => {
    getUserNfts()
  }, [bitverse])

  async function getUserNfts() {}

  return <div className="div">UserNfts</div>
}

export default DisplayUserNfts
