import { useState, useRef } from 'react'

function Modal({ closeModal }) {
  const [fileCaptured, setFileCaptured] = useState(false)
  const [imageToUpload, setImageToUpload] = useState(null)
  const [videoToUpload, setVideoToUpload] = useState(null)

  const imageInput = useRef(null)
  const videoInput = useRef(null)

   //capture the image and previews
  const captureImage = (event) => {
    event.preventDefault()
    console.log(event.target.files)
    setImageToUpload(event.target.files[0])
    setFileCaptured(true)
     
  }
  
  //capture the video and previews
  const captureVideo = (event) => {
    event.preventDefault()
    console.log(event.target.files)
    setVideoToUpload(event.target.files[0])
    setFileCaptured(true)
     
  }

  //Closes the modal
  const exitModal = (e) => {
    closeModal(false)
    
    //this part stops the click from propagating
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
  }


  function UploadingInterface(){
    if(fileCaptured){
      if(imageToUpload){
        return (
          <div>
            Image Captured!
          </div>
          )
      } else if(videoToUpload){
        return (
          <div>
            Video Captured!
          </div>
          )
      }
       
    } else {
      return (
        <div
        id="contentInputContainer"
        className="flex flex-row w-full h-full items-center select-none"
      >
        {/* use 'multiple' to select multiple files */}
        <input id="videoInput" className="hidden" type="file" ref={imageInput} onChange={captureImage} />
        <div id="imageInputDiv" className="flex flex-col w-1/2 h-full items-center justify-center cursor-pointer text-white bg-black hover:bg-gray-900"
         onClick={() => imageInput.current.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>Choose Image</p>
        </div>
        <input id="videoInput" className="hidden" type="file" ref={videoInput} onChange={captureVideo} />
        <div id="videoInputDiv" className="relative flex flex-col w-1/2 h-full items-center justify-center cursor-pointer hover:bg-gray-200 bg-white"
          onClick={() => videoInput.current.click()}
        >
          <button className="absolute top-0 right-0 mt-1 mr-2 p-2 rounded-lg text-white 00 bg-red-500 hover:bg-red-700" onClick={exitModal}>Cancel</button>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p>Choose Video</p>
        </div>
      </div>
      )
    }
  }

  return (
    <div
      id="modalBackground"
      className="w-screen h-screen flex items-center justify-center backdrop-filter backdrop-blur-sm fixed"
    >
      <div
        id="modal"
        className="w-2/3 h-2/3 z-20 flex flex-col overflow-hidden items-center justify-center bg-white rounded-lg"
      >

        <UploadingInterface />
     

        {/* {fileToUpload && <div> file is here! </div>}
        <button className="mt-8" onClick={uploadToIpfs}>
          {' '}
          Upload to IPFS{' '}
        </button>
        <button className="mt-8" onClick={addToBitverse}>
          {' '}
          addToBitverse{' '}
        </button>
        <button onClick={() => closeModal(false)}>Close Modal</button> */}
      </div>

      {/* TODO:
      - preview file
      - Enter title
      - Enter Description
      - Author address
      - Upload to IPFS
      - Add to Bitverse
      - Upload successful
      ~
      - Show up in My Uploads
      -Show up in Homescreen etc
      */}
    </div>
  )

  function uploadToIpfs() {}
  function addToBitverse() {}
}

export default Modal
