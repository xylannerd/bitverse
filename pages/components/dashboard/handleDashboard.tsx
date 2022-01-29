import DisplayUserContent from './displayUserContent'
import Lottie from 'react-lottie'
import loadingAnimation from '../../../public/79943-spiral-dots-preloader.json'
import { AddNft } from './addNft'
import { AddContent } from './addContent'

interface Props {
  userAddress: string
  isLoadingNetwork: boolean
  rightNetwork: boolean
  isLoadingContent: boolean

  setIsNftModalOpen: any
  isNftModalOpen: boolean

  isModalOpen: boolean

  userContentCount: number
  userContent: any[]
  contentMetadata: Map<any, any>
}

export const HandleDashboard: React.FC<Props> = ({
  contentMetadata,
  isLoadingNetwork,
  isNftModalOpen,
  rightNetwork,
  userAddress,
  setIsNftModalOpen,
  userContent,
  userContentCount,
  isLoadingContent,
  isModalOpen,
}) => {
  function Loading() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    }
    return <Lottie options={defaultOptions} height={180} width={180} />
  }

  if (userAddress) {
    return (
      <>
        {isLoadingNetwork ? (
          <Loading />
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
                    setisModalOpen={setIsNftModalOpen}
                    isModalOpen={isModalOpen}
                  />

                  <div className="w-10/12 lg:w-8/12 xl:w-7/12  mt-11">
                    <h1 className="text-gray-200 font-bold text-xl">
                      My Uploads
                    </h1>
                  </div>
                </div>

                {isLoadingContent ? (
                  <Loading />
                ) : (
                  <div className="flex mt-8 w-full h-full bg-opacity-50 justify-center">
                    {/* {contentMetadata && <p>{contentMetadata.get(userContent[0].cid)}</p>} */}
                    <DisplayUserContent
                      userContentCount={userContentCount}
                      userContent={userContent}
                      contentMetadata={contentMetadata}
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
