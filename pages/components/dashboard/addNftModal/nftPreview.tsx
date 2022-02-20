import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import store from '../../../stateGlobal/blockchain.state'
import MimedNft from './mimedNft'

interface PropType {
  userAddress: string
  isInvalidAddress: boolean
  errorOccured: boolean
  imageUrl: string
  nftOwner: string
  tokenName: string
  tokenSymbol: string
  addNftToBitverse: any
  mName: string
  mDescription: string
  externalLink: string
  animationUrl: string
}

const NftPreview: React.FC<PropType> = ({
  userAddress,
  isInvalidAddress,
  errorOccured,
  imageUrl,
  nftOwner,
  tokenName,
  tokenSymbol,
  addNftToBitverse,
  animationUrl,
  externalLink,
  mName,
  mDescription,
}) => {
  const snapshot = useSnapshot(store)

  useEffect(() => {
    console.log('**inside nft-preview**')
    console.log('props.userAddress: ' + userAddress)
    console.log('props.nftOwner: ' + nftOwner)
    console.log('store.userAddress: ' + snapshot.userAddress)
  }, [snapshot.userAddress, userAddress])

  function ValidateOwnerAndShowAddButton() {
    // var _userAddress = new String(userAddress)
    // var _nftOwner = new String(nftOwner)
    // var isEqual = JSON.stringify(_userAddress) === JSON.stringify(_nftOwner)
    // console.log(isEqual)
    const _userAddress = ethers.utils.getAddress(userAddress)
    console.log('---nftPreviewPage---')
    console.log('ethers.utils.getAddress: ' + _userAddress)

    if (nftOwner == _userAddress) {
      return (
        <div className="div">
          <button
            className="bg-black text-white rounded-md py-2 px-4 mb-8 mt-8 w-72 place-self-center"
            onClick={addNftToBitverse}
          >
            Add To Bitverse
          </button>
        </div>
      )
    } else {
      return (
        <div className="flex flex-row mt-8 mb-8 justify-center w-full">
          <div className="flex flex-row space-x-2 bg-yellow-100 rounded-lg px-8 py-4">
            {' '}
            <div className="font-bold"> You are not the owner of the NFT</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="orange"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )
    }
  }

  if (isInvalidAddress) {
    return (
      <div className="flex text-center text-red-500 w-full h-full items-center justify-center">
        <div className="text-center"> Invalid Token Address Entered!</div>
      </div>
    )
  } else if (errorOccured) {
    return (
      <div className="flex flex-col text-center text-red-500 w-full h-full items-center justify-center">
        <div className="div">
          {' '}
          <div className="div">Some error occured!</div>
          <div className="text-gray-500">
            Please recheck your token address/id
          </div>
          <div className="text-gray-700">
            Make sure you select the correct token standard
          </div>
        </div>
      </div>
    )
  } else {
    //NFT PREVIEW:
    //nft image
    //nft owner
    //message: Looks like you're not the owner of the nft.
    //Only the NFT-Owner can add their nft.
    return (
      <div id="NFtPreview" className="flex flex-col w-full mt-12">
        {imageUrl ? (
          <div className="div">
            <MimedNft url={imageUrl} />
          </div>
        ) : (
          <div
            id="LoadingPreviewBackground"
            className="flex w-full h-96 shrink-0 items-center justify-center bg-gray-700 bg-opacity-20 overflow-hidden"
          >
            <div className="font-light">Loading Preview</div>
          </div>
        )}
        <div className="flex flex-col items-center font-mono text-gray-500 mt-8">
          <div className="div">
            {' '}
            {nftOwner && (
              <div className="mx-4 font-light">Owner: {nftOwner}</div>
            )}
            <div className="">
              {' '}
              {tokenName && <div className="mx-4">Name: {tokenName}</div>}
              {tokenSymbol && <div className="mx-4">Symbol: {tokenSymbol}</div>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className=" bg-red-100 mt-8 px-8 py-2 font-light rounded-lg mx-16">
            {mName && (
              <div className="div">
                <div className="font-logofont font-thin">{mName}</div>
              </div>
            )}
            {mDescription && <div className="mt-4">{mDescription}</div>}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ValidateOwnerAndShowAddButton />
        </div>
      </div>
    )
  }
}

export default NftPreview
