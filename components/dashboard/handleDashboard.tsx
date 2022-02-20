import DisplayUserContent from './userContentPreview/displayUserContent'
import  AddNft  from './addNft'
import  AddContent  from './addContent'
import DisplayUserNfts from './userNftPreview/displayUserNfts'
import { useState } from 'react'
import LoadingAnimation from '../sharedComponents/loadingAnimation'

interface Props {
  ethSigner: any
  bitverseSigner: any
  ipfs: any
  userAddress: string
  isLoadingNetwork: boolean
  rightNetwork: boolean

  setIsNftModalOpen: any
  isNftModalOpen: boolean

  isModalOpen: boolean
  setisModalOpen: any
}

const HandleDashboard: React.FC<Props> = ({
  ethSigner,
  bitverseSigner,
  ipfs,
  isLoadingNetwork,
  isNftModalOpen,
  rightNetwork,
  userAddress,
  setIsNftModalOpen,
  isModalOpen,
  setisModalOpen,
}) => {
  //flip the state to set the default tab
  const [showNft, setShowNft] = useState(true)
  const [showContent, setShowContent] = useState(false)

  if (userAddress) {
    return (
      <>
        {isLoadingNetwork && <LoadingAnimation />}

        {!isLoadingNetwork && rightNetwork && (
          <div className="flex flex-col">
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
                      className={`text-gray-200 cursor-pointer ${
                        showNft ? 'font-bold' : 'font-thin'
                      }`}
                      onClick={() => {
                        setShowNft(true)
                        setShowContent(false)
                      }}
                    >
                      NFTs
                    </h1>
                    <div className="text-gray-200 font-thin select-none">|</div>
                    <h1
                      className={`text-gray-200 cursor-pointer ${
                        showContent ? 'font-bold' : 'font-thin'
                      }`}
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
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          {!isLoadingNetwork && rightNetwork && showNft && (
            <div className="flex flex-col justify-center items-center mt-8 w-10/12 lg:w-8/12 xl:w-7/12  h-full bg-opacity-50">
              <DisplayUserNfts
                ethSigner={ethSigner}
                bitverseSigner={bitverseSigner}
                ipfs={ipfs}
                userAddress={userAddress}
              />
            </div>
          )}
          {!isLoadingNetwork && rightNetwork && !showNft && (
            <div className="flex flex-col justify-center items-center mt-8 w-10/12 lg:w-8/12 xl:w-7/12 h-full bg-opacity-50">
              <DisplayUserContent
                bitverseSigner={bitverseSigner}
                ipfs={ipfs}
                userAddress={userAddress}
              />
            </div>
          )}

          {!isLoadingNetwork && !rightNetwork && (
            <p className="flex items-center text-white mt-8 text-center ">
              {' '}
              Please connect to the Ganache Network
            </p>
          )}
        </div>
      </>
    )
  } else {
    return (
      <p className="flex flex-col items-center text-white mt-8 text-center ">
        {' '}
        Please link your wallet to see your content{' '}
      </p>
    )
  }
}

export default HandleDashboard