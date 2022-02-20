import { SubmitHandler } from 'react-hook-form'
import { BigNumber, ethers } from 'ethers'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Inputs from '../../../../componentsNonReact/dashboard/addNftModal/inputs'
import NftPreview from '../../../../componentsNonReact/dashboard/addNftModal/nftPreview'
import NftForm from './nftForm'
import toPaddedHex from '../../../../componentsNonReact/utils/toPaddedHex'
import AddingNftToBitverseProgress from './addingNftToBitverseProgress'

interface NftModalProps {
  setIsNftModalOpen: any
  bitverseSigner: any
  userAddress: string
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
  setIsNftModalOpen,
  bitverseSigner,
  userAddress,
}) => {
  const [selectedTokenStandard, setSelectedTokenStandard] = useState(null)


  const [tokenPreview, setTokenPreview] = useState(false)
  const [nftOwner, setNftOwner] = useState(null)
  const [tokenUri, setTokenUri] = useState('')

  //tokenId, tokenAddress and tokenStandard
  const [tokenId, setTokenId] = useState(null)
  const [tokenAddress, setTokenAddress] = useState(null)
  //can be 721 or 1155
  const [tokenStandard, setTokenStandard] = useState<number>(null)

  //ERC721
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [ownerBalance, setOwnerBalance] = useState(null)

  //data from metadata
  const [imageUrl, setImageUrl] = useState(null)
  const [mName, setmName] = useState(null)
  const [mDescription, setmDescription] = useState(null)
  const [externalLink, setExternalLink] = useState(null)
  const [animationUrl, setAnimationUrl] = useState(null)

  //upload status
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccessful, setUploadSuccessful] = useState(false)
  const [uploadfailed, setUploadFailed] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isInvalidAddress, setIsInvalidAddress] = useState(false)
  const [errorOccured, setErrorOccured] = useState(false)

  const [addingToBitverse, setAddingToBitverse] = useState(false)

  useEffect(() => {
    console.log(selectedTokenStandard)
  }, [selectedTokenStandard])

  //This is where we get the form data and
  //we process the  NFT for bitverse.
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log(JSON.stringify(data))
    //Fetch the data from the Contract Address with given tokenAddress and tokenId
    //prepare the preview
    //if all good, upload it to bitverse
    console.log('*** bigint form ***')
    console.log(data.TokenId)

    fetchTheNft(data.TokenAddress, data.TokenId)
  }

  async function fetchTheNft(_tokenAddress: string, _tokenId: string) {
    setIsLoadingPreview(true)
    setTokenAddress(_tokenAddress)
    setTokenId(_tokenId)

    var provider
    var ethProvider
    var ethSigner

    console.log('*** fetch_nft ***')
    console.log('tokenAddress: ' + _tokenAddress)
    console.log('tokenId: ' + _tokenId)

    if (ethers.utils.isAddress(_tokenAddress)) {
      try {
        provider = await detectEthereumProvider()
        ethProvider = new ethers.providers.Web3Provider(provider)
        ethSigner = ethProvider.getSigner()
      } catch (error) {
        console.error(error)
        setErrorOccured(true)
      }

      if (selectedTokenStandard.value === options[0].value) {
        console.log('inside erc721 fn')
        setTokenStandard(721)

        try {
          var erc721contract = new ethers.Contract(
            _tokenAddress,
            erc721abi,
            ethSigner,
          )
        } catch (error) {
          console.error(error)
          setIsLoadingPreview(false)
          setErrorOccured(true)
        }

        if (erc721contract) {
          var mtokenUri

          try {
            mtokenUri = await erc721contract.tokenURI(_tokenId)
            setTokenUri(mtokenUri)
            console.log('uri :' + mtokenUri)
          } catch (error) {
            console.log(error)
            setErrorOccured(true)
            setIsLoadingPreview(false)
          }
          if (mtokenUri) {
            try {
              const res = await fetch(mtokenUri)
              const data = await res.json()
              console.log(data)
              setImageUrl(data.image)
              setmName(data.name)
              setmDescription(data.description)

              // console.log("header: " + d.header)
            } catch (error) {
              console.log(error)
              setIsLoadingPreview(false)
              setErrorOccured(true)
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
        } else {
          console.log('Cannot initialize erc721 contract')
          setTokenPreview(true)
          setErrorOccured(true)
        }
      } else if (selectedTokenStandard.value === options[1].value) {
        console.log('inside erc1155 fn')
        setTokenStandard(1155)

        /* For ERC1155 Token */

        try {
          var erc1155contract = new ethers.Contract(
            _tokenAddress,
            erc1155abi,
            ethSigner,
          )
        } catch (error) {
          console.log(error)
          setIsLoadingPreview(false)
          setErrorOccured(true)
        }

        if (erc1155contract) {
          var mtokenUri

          try {
            mtokenUri = await erc1155contract.uri(_tokenId)
            setTokenUri(mtokenUri)
            console.log('uri :' + mtokenUri)
          } catch (error) {
            console.log(error)
            setIsLoadingPreview(false)
            setErrorOccured(true)
          }
          //get the uri
          //request the metadata by appending tokenId at the end
          //hex form without 0x
          //example link: https://api.opensea.io/api/v1/metadata/0x495f947276749Ce646f68AC8c248420045cb7b5e/0x{id}

          if (mtokenUri) {
            const theUri = `${mtokenUri.substr(
              0,
              mtokenUri.length - 4,
            )}${toPaddedHex(_tokenId)}`
            console.log(theUri)

            try {
              const res = await fetch(theUri)
              const data = await res.json()
              console.log(data)
              setImageUrl(data.image)
              setmName(data.name)
              setmDescription(data.description)
              setExternalLink(data.external_link)
              setAnimationUrl(data.animation_url)
            } catch (error) {
              console.log(error)
              setErrorOccured(true)
            }
          }

          setIsLoadingPreview(false)
          setTokenPreview(true)
        } else {
          console.log('Cannot init erc721 contract')
        }
      }
    } else {
      setIsInvalidAddress(true)
      setIsLoadingPreview(false)
      setTokenPreview(true)
    }
  }

  const addNftToBitverse = async () => {
    setShowSpinner(true)
    setAddingToBitverse(true)
    setIsUploading(true)
    try {
      var addNftTx = await bitverseSigner.addNft(
        tokenAddress,
        tokenId,
        tokenStandard,
      )
    } catch (error) {
      console.error(error)
      setIsUploading(false)
      setUploadFailed(true)
      setShowSpinner(false)
    }

    await addNftTx.wait()
    console.log('********* result ***********')
    console.log(addNftTx)

    setShowSpinner(false)
    setIsUploading(false)
    setUploadSuccessful(true)


  }

  //Closes the modal
  const exitModal = (e: any) => {
    setIsNftModalOpen(false)

    //this part stops the click from propagating
    if (!e) var e: any = window.event
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()
  }

  const exitAndRefresh = (e: any) => {
    exitModal(e)
    window.location.reload()
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
          onClick={() => setIsNftModalOpen(false)}
        >
          Cancel
        </button>

        {!tokenPreview && !addingToBitverse && (
          <NftForm
            selectedTokenStandard={selectedTokenStandard}
            setSelectedTokenStandard={setSelectedTokenStandard}
            onSubmit={onSubmit}
            options={options}
            isLoadingPreview={isLoadingPreview}
            errorOccured={errorOccured}
            setErrorOccured={setErrorOccured}
          />
        )}

        {tokenPreview && !addingToBitverse && (
          <NftPreview
            isInvalidAddress={isInvalidAddress}
            errorOccured={errorOccured}
            imageUrl={imageUrl}
            nftOwner={nftOwner}
            addNftToBitverse={addNftToBitverse}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            mName={mName}
            mDescription={mDescription}
            externalLink={externalLink}
            animationUrl={animationUrl}
            userAddress={userAddress}
          />
        )}

        {addingToBitverse && (
          <AddingNftToBitverseProgress
            bitverseSigner={bitverseSigner}
            userAddress={userAddress}
            tokenId={tokenId}
            tokenAddress={tokenAddress}

            isUploading={isUploading}
            uploadSuccessful={uploadSuccessful}
            uploadfailed={uploadfailed}
            showSpinner={showSpinner}
            exitAndRefresh={exitAndRefresh}
            setIsNftModalOpen={setIsNftModalOpen}
          />
        )}
      </div>
    </div>
  )
}


export default NftModal
