import { useEffect, useState } from 'react'
import getTokenMetadata from '../../sharedFunctions/getTokenMetadata'
import { Nft } from '../interfaces'
import Blockies from 'react-blockies'
import TxSpinner from '../sharedComponents/txSpinner'

interface Props {
  nft: Nft
  ipfs: any
  bitverseSigner: any
  bitverseProvider: any
  bitverseAlchemy: any
  userAddress: string
}

//DONT FORGET - the link/redirect to opensea wouldn't work if your contract is deployed in ganache/remix/locally
//it will show 404 error which is fine
//redirect to opensea asset page will work in production/mainnet where contract has a mainnet address
//const opensea_asset_url = 'https://opensea.io/assets/{tokenAddress}/{tokenId}'
//const openesea_profile_url = 'https://opensea.io/{address}'

export const NftCard: React.FC<Props> = ({
  nft,
  ipfs,
  bitverseProvider,
  bitverseSigner,
  bitverseAlchemy,
  userAddress,
}) => {
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

  //has user liked or disliked the nft
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [likeTxProcessing, setLikeTxProcessing] = useState(false)
  const [dislikeTxProcessing, setdislikeTxProcessing] = useState(false)
  //flip this to update nft like/dislike status
  const [updateLikeStatus, setUpdateLikeStatus] = useState(false)

  const [nftNetlike, setNftNetlike] = useState(0)

  useEffect(() => {
    getUserLikeOrDislike()
    refreshNftNetlike()
    console.log('useEffect - getUserLikeOrDislike')
  }, [nft, updateLikeStatus])

  //fetch tokenMetadata here
  //prepare preview
  useEffect(() => {
    getNftMetadata()
  }, [nft])

  async function getUserLikeOrDislike() {
    if (bitverseSigner) {
      console.log(bitverseSigner);
      
      try {
        const tx = await bitverseSigner.checkIfUserLikedOrDislikedNft(nft.id)
        console.log('getUserLikeOrDislike')
        console.log(tx)
        setUserLiked(tx.likedNft)
        setUserDisliked(tx.dislikedNft)
      } catch (error) {
        console.log(
          'error in nftCard component\ncheckIfUserLikedOrDislikedNft fn',
        )
        console.log(error)
      }
    } else {
      console.log('contract not found: NFT-Page \ngetUserLikeOrDislike fn')
    }
  }

  async function refreshNftNetlike() {
    try {
      // const _nft = await bitverseAlchemy.nftMapping(nft.id)
      const _nft = await bitverseProvider.nftMapping(nft.id)
      setNftNetlike(_nft.netlikes.toNumber())
    } catch (error) {
      console.log('error on refreshNftNetlike fn')

      console.log(error)
    }
  }

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
    } = await getTokenMetadata(nft, ipfs)

    setIsIpfsUrl(isIpfsUrl)
    setTokenName(_tokenName)
    setTokenSymbol(_tokenSymbol)
    setName(_name)
    setDescription(_description)
    setImageUrl(_imageUrl)
    setAnimationUrl(_animationUrl)
    setTokenUri(tokenUri)
    setNftOwner(_nftOwner)

    console.log(await getTokenMetadata(nft, ipfs))
  }

  const likeNft = async () => {
    if (userAddress) {
      setLikeTxProcessing(true)

      console.log('like clicked!')
      console.log(bitverseSigner)

      //invoke likeNft(uint256 _nftId) fn on bitverse contract
      try {
        const tx = await bitverseSigner.likeNft(nft.id)
        console.log(tx)

        await tx.wait()
        setUserLiked(true)
        setLikeTxProcessing(false)
        setUpdateLikeStatus(!updateLikeStatus)
      } catch (error) {
        console.log(error)
        setLikeTxProcessing(false)
      }
    } else {
      alert('Please link your account to Like an NFT 🍭')
    }
  }

  const dislikeNft = async () => {
    if (userAddress) {
      setdislikeTxProcessing(true)

      console.log('dislike clicked!')
      console.log(bitverseSigner)

      //invoke dislikeNft(uint256 _nftId) fn on bitverse contract
      try {
        const tx = await bitverseSigner.dislikeNft(nft.id)

        console.log(tx)

        await tx.wait()
        setdislikeTxProcessing(false)
        setUpdateLikeStatus(!updateLikeStatus)
      } catch (error) {
        console.log(error)
        setdislikeTxProcessing(false)
      }
    } else {
      alert('Please link your account to Dislike an NFT 🍭')
    }
  }

  //show nft-tokenName
  //else show metadata name
  //else

  return (
    <div
      id="nftCard"
      className="flex flex-col w-72 h-96 justify-start rounded-xl overflow-hidden bg-gray-800 shadow-xl"
    >
      <a
        href={`https://opensea.io/assets/${nft.tokenAddress}/${nft.tokenId}`}
        target="_blank"
      >
        <div
          id="nftImage"
          className="flex w-full justify-center h-80 bg-gray-900 relative cursor-pointer"
        >
          <div className="text-white pl-2 pr-2 absolute bottom-1 left-0 bg-blue-900 font-thin bg-opacity-50 rounded-r-md">
            {name}
          </div>

          <img className="w-full object-cover" src={imageUrl} />
        </div>
      </a>

      <div className="flex flex-row justify-between w-full h-16">
        <div className="flex flex-row ml-4 justify-center items-center">
          {nftOwner && (
            <div className="flex flex-row items-center space-x-2">
              <div className="flex items-center rounded-full overflow-hidden cursor-pointer">
                <a href={`https://opensea.io/${nftOwner}`} target="_blank">
                  {' '}
                  <Blockies
                    seed={nftOwner}
                    size={8}
                    bgColor="#000000"
                    spotColor="#000000"
                  />
                </a>
              </div>
              <a href={`https://opensea.io/${nftOwner}`} target="_blank">
                <div className="slashed-zero text-gray-400 hover:text-opacity-75 font-semibold cursor-pointer">{`${nftOwner.substr(
                  0,
                  3,
                )}...${nftOwner.substr(
                  nftOwner.length - 4,
                  nftOwner.length,
                )}`}</div>
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center">
          <div className="flex flex-row h-full items-center justify-center space-x-4 px-4">
            {' '}
            {userLiked ? (
              <div className="flex items-center justify-center w-8 h-full cursor-pointer">
                <svg
                  id="likeIconFilled"
                  className="w-8 h-full"
                  fill="white"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
            ) : !likeTxProcessing ? (
              <div className="flex items-center justify-center w-8 h-full cursor-pointer">
                <svg
                  id="likeIconVacant"
                  className="w-8 h-full "
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={likeNft}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex items-center justify-centerh-8 w-8">
                <TxSpinner size={40} />
              </div>
            )}
            {/*  */}
            <div
              id="netlikes"
              className="flex items-center justify-center text-white text-center h-full w-4"
            >
              {nftNetlike}
            </div>
            {/*  */}
            {userDisliked ? (
              <div className="flex items-center justify-center w-8 h-full cursor-pointer">
                <svg
                  id="dislikeIconFill"
                  className="w-8 h-full"
                  fill="white"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
              </div>
            ) : !dislikeTxProcessing ? (
              <div
                className="w-8 h-full flex items-center justify-center"
                onClick={dislikeNft}
              >
                <svg
                  id="dislikeIconVacant"
                  className="w-8 h-full cursor-pointer"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex items-center justify-center h-8 w-8">
                <TxSpinner size={40} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
