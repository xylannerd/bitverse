import { SubmitHandler } from 'react-hook-form'
import { BigNumber, ethers } from 'ethers'
import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'
import Inputs from './inputs'
import NftPreview from './nftPreview'
import NftForm from './nftForm'

interface NftModalProps {
  modalOpen: any
  bitverse: any
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

const NftModal: React.FC<NftModalProps> = ({ modalOpen, bitverse }) => {
  const [selectedTokenStandard, setSelectedTokenStandard] = useState(null)

  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isInvalidAddress, setIsInvalidAddress] = useState(false)

  const [tokenPreview, setTokenPreview] = useState(false)
  const [nftOwner, setNftOwner] = useState(null)
  const [tokenUri, setTokenUri] = useState('')
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

    console.log('*** fetch_nft ***')
    console.log('tokenAddress: ' + _tokenAddress)
    console.log('tokenId: ' + _tokenId)

    if (ethers.utils.isAddress(_tokenAddress)) {
      const provider = await detectEthereumProvider()
      const ethProvider = new ethers.providers.Web3Provider(provider)
      const ethSigner = ethProvider.getSigner()

      if (selectedTokenStandard.value === options[0].value) {
        console.log('inside erc721 fn')

        try {
          var erc721contract = new ethers.Contract(
            _tokenAddress,
            erc721abi,
            ethProvider,
          )
        } catch (error) {
          console.error(error)
        }

        if (erc721contract) {
          const mtokenUri = await erc721contract.tokenURI(_tokenId)
          setTokenUri(mtokenUri)
          console.log('uri :' + mtokenUri)

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
        }
      } else if (selectedTokenStandard.value === options[1].value) {
        console.log('inside erc1155 fn')

        /* For ERC1155 Token */

        try {
          var erc1155contract = new ethers.Contract(
            _tokenAddress,
            erc1155abi,
            ethProvider,
          )
        } catch (error) {
          console.log(error)
        }

        if (erc1155contract) {
          const mtokenUri = await erc1155contract.uri(_tokenId)
          setTokenUri(mtokenUri)
          console.log('uri :' + mtokenUri)

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
            }
          }

          setIsLoadingPreview(false)
          setTokenPreview(true)
        } else {
          console.log("Cannot init erc721 contract")
        }
      }
    } else {
      setIsInvalidAddress(true)
      setIsLoadingPreview(false)
      setTokenPreview(true)
    }
  }

  function toPaddedHex(_tokenString) {
    //converts the _tokenString to hexForm, leading with 0x
    const hexForm = ethers.utils.hexValue(BigNumber.from(_tokenString))
    console.log(hexForm)
    //hexString with leading zero padded to 64 hex characters.
    //also removes 0x from the beginning
    const paddedHex = hexForm.substr(2, hexForm.length).padStart(64, '0')
    console.log(paddedHex)
    return paddedHex
  }

  const addNftToBitverse = () => {}

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
        {tokenPreview ? (
          <NftPreview
            isInvalidAddress={isInvalidAddress}
            imageUrl={imageUrl}
            nftOwner={nftOwner}
            addNftToBitverse={addNftToBitverse}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            mName={mName}
            mDescription={mDescription}
            externalLink={externalLink}
            animationUrl={animationUrl}
          />
        ) : (
          <NftForm
            selectedTokenStandard={selectedTokenStandard}
            setSelectedTokenStandard={setSelectedTokenStandard}
            onSubmit={onSubmit}
            options={options}
            isLoadingPreview={isLoadingPreview}
          />
        )}
      </div>
    </div>
  )
}

export default NftModal
