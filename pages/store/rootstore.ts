import { makeAutoObservable } from 'mobx'

export class RootStore {
  private userAddress
  private networkChainId
  private networkId

  private bitverseContract
  private ipfsNode

  constructor() {
    makeAutoObservable(this)
  }

  setAddress(_address) {
    this.userAddress = _address
    console.log("store arg: " + _address);
    console.log("store local: " + this.address);
    
  }

  setChainId(_chainId) {
    this.networkChainId = _chainId
  }

  setNetworkId(_networkId){
      this.networkId = _networkId
}

  setBitverseContract(_contractInstance) {
    this.bitverseContract = _contractInstance
  }

  get address() {
    return this.userAddress
  }

  get chainId() {
    return this.networkChainId
  }
  
  get network(){
      return this.networkId
  }

  get bitverse() {
    return this.bitverseContract
  }

  get ipfs() {
    return this.ipfsNode
  }
}
