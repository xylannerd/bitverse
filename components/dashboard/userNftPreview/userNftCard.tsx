import { useEffect, useState } from 'react'
import { Nft } from '../../utils/interfaces'
import getTokenMetadata from '../../sharedFunctions/getTokenMetadata'

/* 
  TODO:

  - ipfs tokenUris previews
  

*/

interface PropType {
  nft: Nft
  ipfs: any
  ethSigner: any
}

const UserNftCard: React.FC<PropType> = ({ nft, ipfs, ethSigner }) => {
  //LOCAL_STATE
  const [nftOwner, setNftOwner] = useState(null)
  const [tokenUri, setTokenUri] = useState('')
  const [isIpfsUrl, setIsIpfsUrl] = useState<boolean>(false)

  //ERC721
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [ownerBalance, setOwnerBalance] = useState(null)

  //data from metadata
  const [imageUrl, setImageUrl] = useState(null)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [externalLink, setExternalLink] = useState(null)
  const [animationUrl, setAnimationUrl] = useState(null)

  //get the tokenUri
  //get the metadata
  //get 'image_url'
  //get 'name', 'description'
  //preview them!
  useEffect(() => {
    getNftMetadata()
  }, [nft])

  async function getNftMetadata() {
    const {
      _tokenName,
      _tokenSymbol,
      _name,
      _description,
      _imageUrl,
      _animationUrl,
      _tokenUri,
      isIpfsUrl,
      _nftOwner,
    } = await getTokenMetadata(nft, ipfs, ethSigner)

    setIsIpfsUrl(isIpfsUrl)
    setTokenName(_tokenName)
    setTokenSymbol(_tokenSymbol)
    setName(_name)
    setDescription(_description)
    setImageUrl(_imageUrl)
    setAnimationUrl(_animationUrl)
    setTokenUri(tokenUri)

    // console.log(await getTokenMetadata(nft, ipfs, ethSigner))
  }

  return (
    <div className="flex h-full md:h-56 py-4 border-b border-opacity-40">
      <div className="flex flex-col md:flex-row items-center">
        <div
          id="imageBackground"
          className="flex justify-center w-52 md:w-44 h-56 md:h-5/6 z-10 mx-4 bg-gray-700 bg-opacity-25 rounded-md overflow-hidden cursor-pointer relative"
        >
          <a
            href={`https://opensea.io/assets/${nft.tokenAddress}/${nft.tokenId}`}
            target="_blank"
          >
            <div className="text-white px-2 absolute bottom-1 left-0 bg-blue-900 font-thin text-sm bg-opacity-50 rounded-r-md">
            {name}
          </div>
            <img className="w-full object-cover" src={imageUrl} />
          </a>
        </div>

        <div id="cardBody" className="w-80 md:w-full md:h-full grow md:pt-8 md:pb-8 md:pl-4 md:pr-64">
          {/* justify-between and then uncomment */}
          <div className="flex flex-col h-full grow text-white justify-center flex-nowrap overflow-hidden">
            {/* <div className="div"> */}
              {/* <div className="text-gray-500 text-sm">Name: {name}</div>{' '} */}
              {/* <div className="flex overflow-ellipsis w-96 text-gray-500 text-sm">
                Description: {description}
              </div> */}
            {/* </div> */}

            <div className="flex flex-col">
              <div className="text-gray-500 text-xs">
                id: {nft.id.toNumber()}
              </div>
              <div className="text-gray-500 text-xs">
                Token Name: {tokenName}
              </div>
              <div className="slashed-zero text-gray-500 text-xs">
                Token Address: {nft.tokenAddress}
              </div>

              <div className="font-thin"></div>
              <div className="flex flex-row space-x-4 text-gray-500 text-sm">
                <div className="slashed-zero">Netlikes: {nft.netlikes.toNumber()}</div>

                <div className="slashed-zero">Likes: {nft.likes.toNumber()}</div>
                <div className="slashed-zero">Dislikes: {nft.dislikes.toNumber()}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
            Note: Ipfs Uri previews may take some time to load
          </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default UserNftCard
