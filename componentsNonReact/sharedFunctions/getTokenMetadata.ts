import { Nft } from '../interfaces'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { useState } from 'react'
import toPaddedHex from '../utils/toPaddedHex'
// import makeIpfsFetch from 'js-ipfs-fetch'
const isIPFS = require('is-ipfs')

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
  'function ownerOf(uint256 tokenId) external view returns (address owner)',

  'function balanceOf(address _owner, uint256 _id) external view returns (uint256)',

  'function uri(uint256 id) external view returns (string memory)',
]

const erc165abi = [
  'function supportsInterface(bytes4 interfaceId) external view returns (bool)',
]

//TOKEN-STANDARDS
const ERC_721 = 721
const ERC_1155 = 1155

async function getTokenMetadata(_nft: Nft, ipfs: any, ethersProvider: any) {
  //LOCAL_STATE
  var _tokenName
  var _tokenSymbol
  var _name
  var _description
  var _imageUrl
  var _animationUrl
  var _externalLink
  var _tokenUri

  var _nftOwner
  var _ownerBalance

  var isIpfsUrl: boolean
  //init provider
  //call the right contract
  //fetch the nft!

  // const fetch = await makeIpfsFetch({ipfs})

  // try {
  //   var ethersAlchemyProvider = new AlchemyProvider('maticmum', alchemy_key)
  // } catch (error) {
  //   console.log(error)
  // }

  var ethProvider = ethersProvider

  // try {
  //   var provider = await detectEthereumProvider()
  //   var ethProvider = new ethers.providers.Web3Provider(provider)
  //   // ethSigner = ethProvider.getSigner()
  // } catch (error) {
  //   console.log(error)
  // }

  if (_nft.tokenStandard.toNumber() === ERC_721) {
    // console.log('Fetching erc721 token')

    //Call the erc721 contract and fetch the nft
    try {
      var erc721contract = new ethers.Contract(
        _nft.tokenAddress,
        erc721abi,
        ethProvider,
      )
    } catch (error) {
      console.error(error)
    }

    if (erc721contract) {
      const mtokenUri = await erc721contract.tokenURI(_nft.tokenId)
      _tokenUri = mtokenUri
      // console.log('uri :' + mtokenUri)

      if (mtokenUri) {
        var res
        var data

        // console.log('### ipfs url check ###')
        // console.log(
        //   isIPFS.urlOrPath(
        //     'ipfs://bafybeihbsysdkemc3kyylegtfopkrcfiih4exnasoql2q36fb4zawlrwhy/volcano.json',
        //   ),
        // )
        // false for "ipfs://bafybeihbsysdkemc3kyylegtfopkrcfiih4exnasoql2q36fb4zawlrwhy/volcano.json"

        if (
          isIPFS.urlOrPath(mtokenUri) ||
          mtokenUri.startsWith('ipfs://') ||
          mtokenUri.includes('/ipfs/') ||
          mtokenUri.includes('/bafy')
        ) {
          //gives false even for a valid ipfs-url
          // console.log('*** inside erc721 ipfs *** ')

          isIpfsUrl = true
          // console.log('*** 721 isIpfs url ***')
          // example ccid = 'QmPzhc9ezphJ85qJWfVVpeHkPieDJznpYduGhMYD7Z4Ac9'
          const cid_eg2 =
            'bafybeihbsysdkemc3kyylegtfopkrcfiih4exnasoql2q36fb4zawlrwhy/volcano.json'
          try {
            res = await ipfs.cat(mtokenUri)
            // data = await res.json()
            // console.log(res)
          } catch (error) {
            console.log(error)
          }

          //shows:cat {<suspended>}
        } else {
          //do normal fetch

          try {
            res = await fetch(mtokenUri)
            data = await res.json()

            // console.log('erc721 normal fetch')
            // console.log('*** Normal fetch data *** ')

            // console.log(data)
          } catch (error) {
            console.log(error)
          }
        }
        try {
          _imageUrl = data.image
          _name = data.name
          _description = data.description
        } catch (error) {
          console.log(error)
        }
      }

      const mNftOwner = await erc721contract.ownerOf(_nft.tokenId)
      _nftOwner = mNftOwner
      // console.log('nft owner :' + mNftOwner)

      const mtokenName = await erc721contract.name()
      _tokenName = mtokenName
      // console.log('token name: ' + mtokenName)

      const mtokenSymbol = await erc721contract.symbol()
      _tokenSymbol = mtokenSymbol
      // console.log('token symbol: ' + mtokenSymbol)

      const mOwnerBalance = await erc721contract.balanceOf(mNftOwner)
      _ownerBalance = mOwnerBalance.toNumber()
      // console.log('owner balance: ' + mOwnerBalance.toNumber())
    } else {
      console.log('Cannot initialize erc721 contract')
    }
  } else if (_nft.tokenStandard.toNumber() === ERC_1155) {
    // console.log('Fetching erc1155 token')

    /* For ERC1155 Token */

    try {
      var erc1155contract = new ethers.Contract(
        _nft.tokenAddress,
        erc1155abi,
        ethProvider,
      )
    } catch (error) {
      console.log(error)
    }

    if (erc1155contract) {
      const mtokenUri = await erc1155contract.uri(_nft.tokenId)
      _tokenUri = mtokenUri
      // console.log('uri :' + mtokenUri)

      //get the uri
      //request the metadata by appending tokenId at the end
      //hex form without 0x, 0 padded 64 characters long
      //example link: https://api.opensea.io/api/v1/metadata/0x495f947276749Ce646f68AC8c248420045cb7b5e/0x{id}

      // USE "theUri" !!
      if (mtokenUri) {
        const theUri = `${mtokenUri.substr(
          0,
          mtokenUri.length - 4,
        )}${toPaddedHex(_nft.tokenId)}`
        // console.log(theUri)

        var res
        var data

        if (
          isIPFS.urlOrPath(theUri) ||
          mtokenUri.startsWith('ipfs://') ||
          mtokenUri.includes('/ipfs/') ||
          mtokenUri.includes('/bafy')
        ) {
          // console.log('1155 isIpfs url' + isIPFS.urlOrPath(mtokenUri))
          try {
            res = await ipfs.cat(mtokenUri)
            data = await res.json()
          } catch (error) {
            console.log(error)
          }
          // console.log('inside erc1155 ipfs: ')
          // console.log(res)
        } else {
          try {
            res = await fetch(theUri)
            data = await res.json()
          } catch (error) {
            console.log(error)
          }
          // console.log('erc1155 normal fetch')
          // console.log(data)
        }

        _imageUrl = data.image
        _name = data.name
        _description = data.description
        _externalLink = data.external_link
        _animationUrl = data.animation_url
      }

      const mNftOwner = await erc1155contract.ownerOf(_nft.tokenId)
      _nftOwner = mNftOwner
      // console.log('nft owner :' + mNftOwner)
    }
  }

  return {
    _tokenName,
    _tokenSymbol,
    _name,
    _description,
    _imageUrl,
    _animationUrl,
    _tokenUri,
    isIpfsUrl,
    _nftOwner,
  }
}

export default getTokenMetadata
