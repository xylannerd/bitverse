import Lottie from 'react-lottie'
import gradient_spinner from '../../../../public/loading-circle-gradient.json'

interface PropType {
  userAddress: string
  bitverseSigner: any
  tokenId: string
  tokenAddress: string
  isUploading: boolean
  uploadSuccessful: boolean
  uploadfailed: boolean
  showSpinner: boolean
  setIsNftModalOpen: any
  exitAndRefresh: any
}

const AddingNftToBitverseProgress: React.FC<PropType> = ({
  bitverseSigner,
  userAddress,
  tokenAddress,
  tokenId,
  isUploading,
  showSpinner,
  uploadSuccessful,
  uploadfailed,
  exitAndRefresh,
  setIsNftModalOpen
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: gradient_spinner,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <div
      id="uploadProgressContainer"
      className="flex flex-col w-full h-full items-center justify-center overflow-y-auto"
    >
      {isUploading && (
        <div className="div">
          {' '}
          <Lottie options={defaultOptions} height={300} width={300} />
        </div>
      )}

      {!isUploading && uploadSuccessful && (
        <div className="div">
          <div className="flex flex-row">
            <div className="div">Upload Successful</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="green"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <button
          className="w-2/4 mt-2 p-2 rounded-lg text-white bg-black hover:bg-gray-800"
          onClick={exitAndRefresh}
        >
          All Done
        </button>

        </div>
      )}

      {!isUploading && uploadfailed && (
        <div className="div">
          {' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="grey"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="font-bold text-red-500">Upload Failed</div>
          <div className="text-gray-400">Looks like the transaction failed</div>
          <button
            className="mt-4 mr-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-700"
            onClick={setIsNftModalOpen(false)}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  )
}

export default AddingNftToBitverseProgress
