import * as yup from 'yup'

import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BigNumber, ethers } from 'ethers'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import store from '../../store/rootstore'

import Lottie from 'react-lottie'
import loadingAnimation from '../../../public/79943-spiral-dots-preloader.json'
import Select from 'react-select'

interface NftModalProps {
  modalOpen: any
  bitverse: any
  ethProvider: any
}

//ex token-address (address) - 0x495f947276749Ce646f68AC8c248420045cb7b5e
//eg tokenId (uint256)- 87877668847029793789970239573080198476427212176584630898879245679610566803457

// ERC721 ABI
const erc721abi = [
  'function ownerOf(uint256 tokenId) external view returns (address owner)',
  'function balanceOf(address owner) external view returns (uint256 balance)',

  'function name() external view returns (string memory)',
  'function symbol() external view returns (string memory)',
  'function tokenURI(uint256 tokenId) external view returns (string memory)',
]

const erc1155abi = [
  'function balanceOf(address _owner, uint256 _id) external view returns (uint256)',

  'function uri(uint256 id) external view returns (string memory)',
]

const erc165abi = [
  'function supportsInterface(bytes4 interfaceId) external view returns (bool)',
]


//react-select options
const options = [
  { value: 'erc721', label: 'ERC721' },
  { value: 'erc1155', label: 'ERC1155' },
]


const NftModal: React.FC<NftModalProps> = ({
  modalOpen,
  bitverse,
  ethProvider,
}) => {

  const [selectedTokenStandard, setSelectedTokenStandard] = useState(null);

  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isInvalidAddress, setIsInvalidAddress] = useState(false)

  const [tokenPreview, setTokenPreview] = useState(false)
  const [nftOwner, setNftOwner] = useState(null)
  const [tokenUri, setTokenUri] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [ownerBalance, setOwnerBalance] = useState(null)

  useEffect(() => {
    console.log(selectedTokenStandard)
  }, [selectedTokenStandard])

  
  type Inputs = {
    TokenId: string
    TokenAddress: string
  }

  var schema = yup.object().shape({
    TokenId: yup.string().required(),
    TokenAddress: yup.string().required(),
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
  //we process the  NFT for bitverse.
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log(JSON.stringify(data))
    //Fetch the data from the Contract Address with given tokenAddress and tokenId
    //prepare the preview
    //if all good, upload it to bitverse
    console.log('*** bigint form ***')
    console.log(data.TokenId)

    fetchTheNft(data.TokenAddress, Number(data.TokenId))

    /* mime-type of the nft TODO */
    /*  const wikiUrl = 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg'

    const mUrl =
      'https://storage.opensea.io/files/2e48ae3c7d6968aaad0a818a22466070.mp4#t=0.001'
    // const stream = got.stream(mUrl);
    // const fileType = await fileTypeFromStream(stream)

    const response = await fetch(mUrl)
    // const res = await response.json()
    // const fileType = await fileTypeFromStream(response.body)

    console.log('*** file-type ***')
    console.log(response) */
  }

  async function fetchTheNft(_tokenAddress: string, _tokenId: number) {
    setIsLoadingPreview(true)

    console.log('*** fetch_nft ***')
    console.log('tokenAddress: ' + _tokenAddress)
    console.log('tokenId: ' + _tokenId)

    if (ethers.utils.isAddress(_tokenAddress)) {
      const provider = await detectEthereumProvider()
      const ethProvider = new ethers.providers.Web3Provider(provider)
      const ethSigner = ethProvider.getSigner()

      if (selectedTokenStandard.value === options[0].value) {
        console.log("inside erc721 fn");
        
        const erc721contract = new ethers.Contract(
          _tokenAddress,
          erc721abi,
          ethProvider,
        )

        const mtokenUri = await erc721contract.tokenURI(_tokenId)
        setTokenUri(mtokenUri)
        console.log('uri :' + mtokenUri)

        if (mtokenUri) {
          try {
            const res = await fetch(mtokenUri)
            const data = await res.json()
            console.log(data)
            setImageUrl(data.image)

            // console.log("header: " + d.header)
          } catch (error) {
            console.log(error)
          }
        }

        const mNftOwner = await erc721contract.ownerOf(_tokenId)
        setNftOwner(mNftOwner)
        console.log('nft owner :' + mNftOwner)

        const mtokenName = await erc721contract.name()
        setTokenName(mtokenName)
        console.log('token name: ' + mtokenName)

        const mtokenSymbol = await erc721contract.symbol()
        setTokenSymbol(mtokenSymbol)
        console.log('token symbol: ' + mtokenSymbol)

        const mOwnerBalance = await erc721contract.balanceOf(mNftOwner)
        setOwnerBalance(mOwnerBalance.toNumber())
        console.log('owner balance: ' + mOwnerBalance.toNumber())

        setIsLoadingPreview(false)
        setTokenPreview(true)
      } else if (selectedTokenStandard.value === options[1].value) {

        console.log("inside erc1155 fn");

        /* For ERC1155 Token */

        const erc1155contract = new ethers.Contract(
          _tokenAddress,
          erc1155abi,
          ethProvider,
        )

        const mtokenUri = await erc1155contract.uri(_tokenId)
        setTokenUri(mtokenUri)
        console.log('uri :' + mtokenUri)

        // if (mtokenUri) {
        //   try {
        //     const res = await fetch(mtokenUri)
        //     const data = await res.json()
        //     console.log(data)
        //     setImageUrl(data.image)

        //     // console.log("header: " + d.header)
        //   } catch (error) {
        //     console.log(error)
        //   }
        // }


        setIsLoadingPreview(false)
        setTokenPreview(true)
      }


    } else {
      setIsInvalidAddress(true)
      setIsLoadingPreview(false)
      setTokenPreview(true)
    }
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  function NftPreview() {
    if (isInvalidAddress) {
      return (
        <div className="text-center text-red-500 w-full h-full items-center justify-center">
          <div className="div"> Invalid Token Address Entered!</div>
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
            <div className="div">Loading Preview</div>
          )}
          {nftOwner && <div className="mx-4 font-light">Owner: {nftOwner}</div>}

          <div className="bg-red-100 mt-8 px-8 py-2 font-light">
            {tokenName && <div className="div">Name: {tokenName}</div>}
            {tokenSymbol && <div className="div">Symbol: {tokenSymbol}</div>}
          </div>

          {nftOwner === store.address ? (
            <button
              className="bg-black text-white rounded-md py-2 px-4 mb-8 mt-8 w-72 place-self-center"
              onClick={addNftToBitverse}
            >
              Add To Bitverse
            </button>
          ) : (
            <div className="flex flex-row mt-8 mb-8 justify-center w-full">
              <div className="flex flex-row space-x-2 bg-yellow-100 rounded-lg px-8 py-4">
                {' '}
                <div className="font-bold">
                  {' '}
                  You are not the owner of the NFT
                </div>
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
          )}
        </div>
      )
    }
  }

  //dong just images for now
  //check the mime type
  //and return the element accordingly
  //<img/> for image
  //<video/> for video
  function MimedNft({ url }) {
    return (
      <div
        id="imageBackground"
        className="flex w-full h-96 shrink-0 items-center justify-center bg-gray-700 bg-opacity-25 rounded-sm overflow-hidden"
      >
        <img src={url} object-fit="contain" />
      </div>
    )
  }

  function addNftToBitverse() {}

  function NftForm() {
    return (
      <div
        id="nftFetchForm"
        className="flex flex-col w-full h-full items-center justify-center px-8"
      >
        <div className="mb-8 font-semibold">Let's fetch your NFT</div>

        <div id="inputForm" className="mt-4 w-full max-w-lg">
          <Select
            defaultValue={selectedTokenStandard}
            onChange={setSelectedTokenStandard}
            options={options}
            placeholder="Select NFT Standard"
          />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label className="select-none mt-4">Token Address:</label>

            <input
              {...register('TokenAddress')}
              className="px-1 border shadow-inner rounded-sm focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
            />
            <p className="text-red-500"> {errors.TokenAddress?.message} </p>

            <label className="mt-4 select-none">Token Id: </label>
            <input
              {...register('TokenId')}
              className="px-1 border shadow-inner rounded-sm focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
            />
            <p className="text-red-500"> {errors.TokenId?.message} </p>

            {!isLoadingPreview ? (
              <input
                type="submit"
                value="Fetch NFT"
                className="bg-black text-white rounded-md py-2 mb-8 mt-8 w-4/6 place-self-center"
              />
            ) : (
              <div className="py-2 mb-8 mt-8 w-4/6 place-self-center">
                <Lottie options={defaultOptions} height={150} width={150} />
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div
      id="modalBackground"
      className="w-screen h-screen z-20 flex items-center justify-center backdrop-filter backdrop-blur-sm fixed"
    >
      <div
        id="modal"
        className="w-4/6 h-3/4 z-40 flex flex-col overflow-hidden items-center bg-white rounded-lg relative overflow-y-auto"
      >
        <button
          className="absolute z-10 top-0 right-0 mt-1 mr-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-700"
          onClick={() => modalOpen(false)}
        >
          Cancel
        </button>

        {/* Input form starts here */}
        {tokenPreview ? <NftPreview /> : <NftForm />}
      </div>
    </div>
  )
}

export default NftModal
