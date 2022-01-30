import DisplayUserContent from './displayUserContent'
import { AddNft } from './addNft'
import { AddContent } from './addContent'
import DisplayUserNfts from './displayUserNfts'
import { useState } from 'react'
import LoadingAnimation from './LoadingAnimation'

interface Props {
  bitverse: any
  ipfs: any
  userAddress: string
  isLoadingNetwork: boolean
  rightNetwork: boolean

  setIsNftModalOpen: any
  isNftModalOpen: boolean

  isModalOpen: boolean
  setisModalOpen: any
}

export const HandleDashboard: React.FC<Props> = ({
  bitverse,
  ipfs,
  isLoadingNetwork,
  isNftModalOpen,
  rightNetwork,
  userAddress,
  setIsNftModalOpen,
  isModalOpen,
  setisModalOpen,
}) => {
  const [showNft, setShowNft] = useState(false)
  const [showContent, setShowContent] = useState(false)

  if (userAddress) {
    return (
      <>
        {isLoadingNetwork ? (
          <LoadingAnimation />
        ) : (
          <div className="div">
            {rightNetwork && (
              <div className="div">
                <div className="flex flex-col items-center justify-center mt-8">
                  <AddNft
                    isNftModalOpen={isNftModalOpen}
                    setIsNftModalOpen={setIsNftModalOpen}
                  />
                  <AddContent
                    setisModalOpen={setisModalOpen}
                    isModalOpen={isModalOpen}
                  />

                  <div className="flex flex-row items-baseline w-10/12 lg:w-8/12 xl:w-7/12  mt-11">
                    <h1 className="mr-4 text-gray-200 font-bold text-xl">
                      My Uploads
                    </h1>
                    <div className="flex flex-row space-x-2">
                      <h1
                        className="text-gray-200 font-thin cursor-pointer"
                        onClick={() => {
                          setShowNft(true)
                          setShowContent(false)
                        }}
                      >
                        NFTs
                      </h1>
                      <div className="text-gray-200 font-thin select-none">
                        |
                      </div>
                      <h1
                        className="text-gray-200 font-thin cursor-pointer"
                        onClick={() => {
                          setShowNft(false)
                          setShowContent(true)
                        }}
                      >
                        Content
                      </h1>
                    </div>
                  </div>
                </div>

                {showNft ? (
                  <DisplayUserNfts
                    bitverse={bitverse}
                    ipfs={ipfs}
                    userAddress={userAddress}
                  />
                ) : (
                  <div className="flex mt-8 w-full h-full bg-opacity-50 justify-center">
                    <DisplayUserContent
                      bitverse={bitverse}
                      ipfs={ipfs}
                      userAddress={userAddress}
                    />
                  </div>
                )}
              </div>
            )}

            {!rightNetwork && (
              <p className="text-white mt-8 text-center ">
                {' '}
                Please connect to the Ganache Network
              </p>
            )}
          </div>
        )}
      </>
    )
  } else {
    return (
      <p className="text-white mt-8 text-center ">
        {' '}
        Please link your wallet to see your content{' '}
      </p>
    )
  }
}
