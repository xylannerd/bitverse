import Lottie from 'react-lottie'
import gradient_spinner from '../../../../public/loading-circle-gradient.json'



interface UploadProgressProps {
  showSpinner: boolean
  ipfsNodeInitializing: boolean
  uploadingToIpfs: boolean
  addingToBitverse: boolean
  uploadFailed: boolean
  exitModal: (e: any) => void
  isUploadSuccessful: boolean
  exitAndRefresh: (e: any) => void
  downloadMetaDataJsonFile: any
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  showSpinner,
  ipfsNodeInitializing,
  uploadingToIpfs,
  addingToBitverse,
  uploadFailed,
  exitModal,
  isUploadSuccessful,
  exitAndRefresh,
  downloadMetaDataJsonFile
}: UploadProgressProps) => {



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
      {showSpinner && (
        <Lottie options={defaultOptions} height={300} width={300} />
      )}

      {ipfsNodeInitializing && (
        <div className="font-thin">Initiliazing ipfs node...</div>
      )}
      {uploadingToIpfs && <div className="font-thin">Adding to ipfs...</div>}
      {addingToBitverse && (
        <div className="font-thin">Adding to Bitverse...</div>
      )}

      {addingToBitverse && (
        <div className="font-bold">Waiting For Confirmation</div>
      )}
      {addingToBitverse && (
        <div className="text-gray-400">
          Please confirm the transaction in your wallet
        </div>
      )}
      {uploadFailed && (
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
      )}
      {uploadFailed && (
        <div className="font-bold text-red-500">Upload Failed</div>
      )}
      {uploadFailed && (
        <div className="text-gray-400">Looks like the transaction failed</div>
      )}
      {uploadFailed && (
        <button
          className="mt-4 mr-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-700"
          onClick={exitModal}
        >
          Go Back
        </button>
      )}

      {isUploadSuccessful && (
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
      )}
      {isUploadSuccessful && (
        <button
          className="w-2/4 mt-8 p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          onClick={downloadMetaDataJsonFile}
        >
          Get Metadata JSON File
        </button>
      )}
      {isUploadSuccessful && (
        <button
          className="w-2/4 mt-2 p-2 rounded-lg text-white bg-black hover:bg-gray-800"
          onClick={exitAndRefresh}
        >
          All Done
        </button>
      )}
    </div>
  )
}

export default UploadProgress
