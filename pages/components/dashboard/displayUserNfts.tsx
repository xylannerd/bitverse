import { useEffect, useState } from 'react'
import { Nft } from '../interfaces'
import LoadingAnimation from './LoadingAnimation'

interface PropType {
  bitverse: any
  ipfs: any
  userAddress: string
}

const DisplayUserNfts: React.FC<PropType> = ({
  bitverse,
  ipfs,
  userAddress,
}) => {
  const [isLoadingNfts, setIsLoadingNfts] = useState(false)
  const [userNfts, setUserNfts] = useState([])
  const [nftsMetadata, setNftsMetadata] = useState(null)
  const [userNftCount, setUserNftCount] = useState(0)

  useEffect(() => {
    getUserNfts()
  }, [bitverse])

  async function getUserNfts() {
    //fetch nft here

    if (bitverse) {
      setIsLoadingNfts(true)

      var uploaderToNftIndicesLength = await bitverse.uploaderToNftIndicesLength()
      console.log('indices: ' + uploaderToNftIndicesLength)

      if (uploaderToNftIndicesLength && uploaderToNftIndicesLength > 0) {
        setUserNftCount(uploaderToNftIndicesLength)

        var nftsArray = []
        var metadataMap = new Map()

        for (var i = 0; i < uploaderToNftIndicesLength; i++) {
          var nftIndex = await bitverse.uploaderToNftIndices(userAddress, i)
          var nft = await bitverse.nftMapping(nftIndex)
          nftsArray.push(nft)
        }

        if (nftsArray) {
          setUserNfts(nftsArray)
          console.log(nftsArray)
          setIsLoadingNfts(false)
        }
      } else {
        //author has no content yet!
        //message: Your dashboard looks empty, Lets add something!
        console.log('NO NFT FOUND')
        setIsLoadingNfts(false)
      }
    } else {
      console.log('no contract found')
    }
  }

  function showNfts() {
    if (userNftCount > 0 && userNfts) {
        <div className="div">
{
    userNfts.map((nft: Nft) => (
        <UserNftCard />
    ))
}

        </div>
    } else {
      return (
        <div className="text-white mt-32 font-semibold text-center py-4 px-8  bg-red-400 rounded-md">
          Looks like you have no uploads yet
        </div>
      )
    }
  }

  return (
    <div className="div">
      {isLoadingNfts ? <LoadingAnimation /> : <ShowNfts />}
    </div>
  )
}

export default DisplayUserNfts
