import { BigNumber, ethers } from "ethers"

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

  export default toPaddedHex