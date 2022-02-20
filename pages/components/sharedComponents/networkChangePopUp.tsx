import { changeChain } from '../../sharedFunctions/changeEthereumChain'

interface PropType {
  setNetworkChangePopUp: any
}

const NetworkChangePopUp: React.FC<PropType> = ({ setNetworkChangePopUp }) => {
  function changeNetworkAndClosePopUp() {
    changeChain()
    setNetworkChangePopUp(false)
  }

  return (
    <div
      id="modalBackground"
      className="w-screen h-screen z-20 flex items-center justify-center fixed"
    >
      <div
        id="modal"
        className="w-auto h-52 py-8 px-8 z-40 flex flex-col overflow-hidden items-center justify-center bg-white rounded-lg relative select-none"
      >
        <div id="closeButton" onClick={() => setNetworkChangePopUp(false)} className="cursor-pointer absolute top-1 right-1 ">
          <svg
            className="w-6 h-6"
            fill="red"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>

        <div className="font-mono">
          Please select Polygon Mumbai Test Network
        </div>

        <div
          onClick={changeNetworkAndClosePopUp}
          id="toggleButton"
          className="flex flex-row space-x-4 py-4 px-8 mt-4 cursor-pointer justify-center rounded-lg overflow-hidden bg-black"
        >
          <div id="networkImage" className="flex items-center justify-center">
            <img src="/polygon-matic-logo.svg" height={20} width={20} />
          </div>

          <div className="text-white">Polygon Mumbai</div>
        </div>
      </div>
    </div>
  )
}

export default NetworkChangePopUp
