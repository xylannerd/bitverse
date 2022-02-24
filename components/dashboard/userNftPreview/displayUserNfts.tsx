import { useEffect, useState } from 'react'
import { Nft } from '../../utils/interfaces'
import LoadingAnimation from '../../sharedComponents/loadingAnimation'
import UserNftCard from './userNftCard'

interface PropType {
  ethSigner: any
  bitverseSigner: any
  ipfs: any
  userAddress: string
}

const DisplayUserNfts: React.FC<PropType> = ({
  bitverseSigner,
  ipfs,
  userAddress,
  ethSigner
}) => {
  const [isLoadingNfts, setIsLoadingNfts] = useState(true)
  const [userNfts, setUserNfts] = useState([])
  const [nftsMetadata, setNftsMetadata] = useState(null)
  const [userNftCount, setUserNftCount] = useState(0)

  useEffect(() => {
    getUserNfts()
  }, [bitverseSigner])

  async function getUserNfts() {
    //fetch nft here

    if (bitverseSigner) {
      setIsLoadingNfts(true)

      var uploaderToNftIndicesLength = await bitverseSigner.uploaderToNftIndicesLength()
      // console.log('indices: ' + uploaderToNftIndicesLength)

      if (uploaderToNftIndicesLength && uploaderToNftIndicesLength > 0) {
        setUserNftCount(uploaderToNftIndicesLength)

        var nftsArray = []
        var metadataMap = new Map()

        for (var i = 0; i < uploaderToNftIndicesLength; i++) {
          var nftIndex = await bitverseSigner.uploaderToNftIndices(userAddress, i)
          var nft = await bitverseSigner.nftMapping(nftIndex)
          nftsArray.push(nft)
        }

        if (nftsArray) {
          setUserNfts(nftsArray)
          // console.log(nftsArray)
          setIsLoadingNfts(false)
        }
      } else {
        //author has no content yet!
        //message: Your dashboard looks empty, Lets add something!
        // console.log('NO NFT FOUND')
        setIsLoadingNfts(false)
      }
    } else {
      console.log('no contract found')
    }
  }

  function ShowNfts() {
    if (userNftCount > 0 && userNfts) {
      return (
        <div className="div">
          {userNfts.map((nft: Nft) => (
            <UserNftCard key={nft.id.toNumber()} nft={nft} ipfs={ipfs} ethSigner={ethSigner} />
          ))}
        </div>
      )
    } else {
      return (
        <div className="text-white mt-32 font-semibold text-center py-4 px-8  bg-red-400 rounded-md">
          Looks like you have not added any NFT yet
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
