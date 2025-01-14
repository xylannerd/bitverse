import { useState, useRef, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import store from '../../stateGlobal/blockchain.state'

import Image from 'next/image'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
//ethereum libraries
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

import IPFS, { CID } from 'ipfs-core'


import bitverseAbi from '../../../contract-mumbai-testnet/bitverse.json'
import { contractMumbaiAddress } from '../../../contract-mumbai-testnet/contractAddress'


import Confirmation from './confirmation'

import { saveAs } from 'file-saver'
import UploadProgress from './uploadProgress'

interface ModalProps {
  closeModal: any
  ipfs: any
  bitverseSigner: any
}

const Modal: React.FC<ModalProps> = ({
  closeModal,
  ipfs,
  bitverseSigner,
}: ModalProps) => {
  const snapshot = useSnapshot(store)

  const [fileCaptured, setFileCaptured] = useState(false)
  const [imageToUpload, setImageToUpload] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [videoToUpload, setVideoToUpload] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [metadataJson, setMetadataJson] = useState('')

  const [uploadFailed, setUploadFailed] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  //countdown for 5 second confirmation dialogue
  const [countDown, setCountdown] = useState(5)
  const [showPopUp, setShowPopUp] = useState(false)

  const imageInput = useRef(null)
  const videoInput = useRef(null)

  //Upload status
  const [ipfsNodeInitializing, setIpfsNodeInitializing] = useState(false)
  const [ipfsNodeStarted, setIpfsNodeStarted] = useState(false)
  const [uploadingToIpfs, setUploadingToIpfs] = useState(false)
  const [addingToBitverse, setAddingToBitverse] = useState(false)
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false)

  //IPFS stuff
  const [contentCid, setContentCid] = useState()
  const [metadataJsonCid, setMetadaJsonCid] = useState()

  //capture the image and previews
  const captureImage = (event) => {
    event.preventDefault()
    // console.log(event.target.files)
    //checks the mime type and only accepts image type.
    if (event.target.files[0].type.substr(0, 5) === 'image') {
      setImageToUpload(event.target.files[0])
      setImagePreview(URL.createObjectURL(event.target.files[0]))
      setFileCaptured(true)
    } else {
      alert('Please select a valid image file')
    }
  }

  //coming soon
  //capture video and previews
  const captureVideo = (event) => {
    event.preventDefault()
    // console.log(event.target.files)
    setVideoToUpload(event.target.files[0])
    setFileCaptured(true)
  }

  //Closes the modal
  const exitModal = (e: any) => {
    closeModal(false)

    //this part stops the click from propagating
    if (!e) var e: any = window.event
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()

    // e ??= window.event!; // if e is not there set it to window.event
    // e.cancelBubble = true;
    // e.stopPropagation?.(); // if stopPropagation exists call it
  }

  const exitAndRefresh = (e: any) => {
    exitModal(e)
    window.location.reload()
  }

  //react-hook-form and validation via Yup.

  type Inputs = {
    Title: string
    Description: string
  }

  var schema = yup.object().shape({
    Title: yup.string().required().max(100, `Max length - 100 characters.`),
    Description: yup.string().max(500, `Max length - 500 characters.`),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  })

  //This is where we get the form data and
  //we process it for ipfs and bitverse.
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // console.log(JSON.stringify(data))

    // upload to ipfs
    // then to bitverse!

    //prepares the content metadata
    setMetadataJson(JSON.stringify(data))

    setShowPopUp(true)
  }

  function UploadDetailsInterface() {
    if (fileCaptured) {
      /*
        File is captured,
        if its image, create the image preview.
        if its video, create the video preview.
        take the user input and proceed to upload!
      */

      if (imageToUpload) {
        /* 
          Image is captured,
          proceed with user input 
        */
        return (
          <div
            id="imagePreviewContainer"
            className="flex flex-col w-full h-full items-center overflow-y-auto"
          >
            <div id="cancel_bt" className="w-full relative">
              <button
                className="absolute z-10 top-0 right-0 mt-1 mr-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-700"
                onClick={exitModal}
              >
                Cancel
              </button>
            </div>

            <div
              id="imageBackground"
              className="mt-8 flex items-center justify-center w-5/6 h-96 min-h-96 bg-gray-100 rounded-md overflow-hidden relative"
            >
              <Image
                className="object-contain"
                src={imagePreview}
                unoptimized={true}
                layout="fill"
              />
            </div>

            {/* Input form starts here */}
            <div id="inputForm" className="mt-4 w-7/12 max-w-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <label className="select-none">Title:</label>
                <input
                  {...register('Title')}
                  className="px-1 border shadow-inner rounded-sm focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
                />
                <p className="text-red-500"> {errors.Title?.message} </p>

                <label className="mt-4 select-none">Description:</label>
                <textarea
                  {...register('Description')}
                  rows={4}
                  className="px-1 rounded-sm border shadow-inner focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
                />
                <p className="text-red-500">{errors.Description?.message} </p>

                <label className="mt-4 select-none">Author's address:</label>
                <p className="text-blue-500">
                  {snapshot.userAddress ? (
                    snapshot.userAddress
                  ) : (
                    <div className="text-yellow-600">
                      Make sure Metamask is properly linked.
                    </div>
                  )}
                </p>

                <input
                  type="submit"
                  value="Add To Bitverse"
                  className="bg-black text-white rounded-md py-2 mb-8 mt-8 w-4/6 place-self-center"
                />
              </form>
            </div>
          </div>
        )
      } else if (videoToUpload) {
        return <div>Video Captured!</div>
      }
    } else {
      /* 
          File is not captured yet,
          user is asked to select image, video.

      */
      return (
        <div
          id="contentInputContainer"
          className="flex flex-row w-full h-full items-center select-none"
        >
          {/* use 'multiple' to select multiple files */}
          <input
            id="imageInput"
            className="hidden"
            type="file"
            accept="image/*"
            ref={imageInput}
            onChange={captureImage}
          />
          <div
            id="imageInputDiv"
            className="flex flex-col w-1/2 h-full items-center justify-center cursor-pointer text-white bg-black hover:bg-gray-900"
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
          <input
            id="videoInput"
            className="hidden"
            type="file"
            ref={videoInput}
            onChange={captureVideo}
          />
          <div
            id="videoInputDiv"
            className="relative flex flex-col w-1/2 h-full items-center justify-center cursor-pointer hover:bg-gray-200 bg-white"
            // onClick={() => videoInput.current.click()}
            onClick={() => alert('This feature is coming soon 🤞')}
          >
            <button
              className="absolute top-0 right-0 mt-1 mr-2 p-2 rounded-lg text-white 00 bg-red-500 hover:bg-red-700"
              onClick={exitModal}
            >
              Cancel
            </button>

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

  //this fn starts the upload process
  //but what triggers it?
  //pass it to the confirmation popUp and trigger it from there!
  async function initUpload() {
    setIsUploading(true)
    setShowSpinner(true)

    if (fileCaptured) {
      const fileToUpload = imageToUpload ? imageToUpload : videoToUpload
      const contentType = imageToUpload ? 'image' : 'video'

      setIpfsNodeInitializing(true)

      addToIpfs(fileToUpload).then((cCid) => {
        //this contentCid state update takes time
        //value may not be updated/reflected soon enough
        setContentCid(cCid)

        addToIpfs(metadataJson).then((metaCid) => {
          setUploadingToIpfs(false)
          //metadataJsonCid state update takes time
          //setting the state anyway, might use anywhere else
          setMetadaJsonCid(metaCid)

          //so using the cCid and metaCid instead.
          addToBitverse(cCid, metaCid, contentType)
        })
      })
    } else {
      console.error('File is not captured')
    }
  }

  //this one checks if ipfs node is running
  //and uploads the content to ipfs
  async function addToIpfs(file) {
    //add content and receives back its cid

    /* 
      If you’ve already initialised IPFS on a repo, it will lock it.
      If you’d like to test with multiple repos, you can use something like this:
   
      let ipfsNode = await IPFS.create({ repo: 'ok' + Math.random() })
   
      //ipfs = await IPFS.create() //may show lock repo error!

  */

    let ipfsNode = ipfs
      ? ipfs
      : await IPFS.create({ repo: 'ok' + Math.random() })

    if (ipfsNode) {
      setIpfsNodeStarted(true)
      setIpfsNodeInitializing(false)

      try {
        setUploadingToIpfs(true)
        var result = await ipfsNode.add(file)
        return result.cid.toString()
      } catch (error) {
        return error
      }
    } else {
      console.log('No ipfs node initialised')
    }
  }

  /* 
    This fn get the contract instance ready
    and uploads the content and metadata CID 
    to the bitverse smart contract
  */
  async function addToBitverse(
    contentHash: string,
    metadataHash: string,
    contentType: string,
  ) {
    setUploadingToIpfs(false)
    setAddingToBitverse(true)

    // console.log('*** bitverse function ***')

    try {
      var provider = await detectEthereumProvider()
      var ethProvider = new ethers.providers.Web3Provider(provider)
      var ethSigner = ethProvider.getSigner()
      // @ts-ignore
      var network = provider.networkVersion
  
    } catch (error) {
      console.error(error)
    }
   
    //Can be initialised with a provider or a signer
    //use signer to write to blockchain
    try {
      var mBitverse = bitverseSigner
      ? bitverseSigner
      : new ethers.Contract(
          contractMumbaiAddress,
          bitverseAbi.abi,
          ethSigner,
        )
    } catch (error) {
      console.error(error)
      
    }
   

    // console.log('*********  bitverse ***********')
    // console.log(`contentCid - ${contentHash}
    // metadataCid - ${metadataHash}`)

    // console.log(mBitverse)
    try {
      var tx = await mBitverse._addContent(contentHash, metadataHash, contentType)
      // console.log('*********  result ***********')
      // console.log(tx)

      await tx.wait()
      setAddingToBitverse(false)
      setShowSpinner(false)
      setIsUploadSuccessful(true)
    } catch (error) {
      // console.error('****** Contract upload error *******')

      console.error(error)
      setShowSpinner(false)
      setAddingToBitverse(false)

      setUploadFailed(true)
    }
  }

  //create the metadata.json file
  //the user can host/pin this file in their ipfs node
  //metadata file naming convention- {contentCid}.json
  function downloadMetaDataJsonFile() {
    if (!contentCid) {
      // console.log('CID not found')
    }

    if (!metadataJson) {
      // console.log('No Metadata JSON file')
    }

    //CID.parse(content.cid)
    var blob = new Blob([metadataJson], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `md_${CID.parse(contentCid).toV1().toString()}.json`)
  }

  return (
    <div
      id="modalBackground"
      className="w-screen h-screen z-20 flex items-center justify-center backdrop-filter backdrop-blur-sm fixed"
    >
      <div
        id="modal"
        className="w-4/6 h-3/4 z-40 flex flex-col overflow-hidden items-center justify-center bg-white rounded-lg relative"
      >
        {showPopUp && (
          <Confirmation
            popUp={showPopUp}
            setPopUp={setShowPopUp}
            triggerUploading={initUpload}
          />
        )}
        {isUploading ? (
          <UploadProgress
            showSpinner={showSpinner}
            ipfsNodeInitializing={ipfsNodeInitializing}
            uploadingToIpfs={uploadingToIpfs}
            addingToBitverse={addingToBitverse}
            uploadFailed={uploadFailed}
            exitModal={exitModal}
            isUploadSuccessful={isUploadSuccessful}
            exitAndRefresh={exitAndRefresh}
            downloadMetaDataJsonFile={downloadMetaDataJsonFile}
          />
        ) : (
          <UploadDetailsInterface />
        )}
      </div>
    </div>
  )
}

export default Modal
