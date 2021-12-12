import { makeAutoObservable } from "mobx"

class RootStore{

    userAddress;
    networkChainId;

    constructor() {
        makeAutoObservable(this);
      }


      setAddress(address){
          this.userAddress = address;
      }

      get address(){
          return this.userAddress;
      }

      setChainId(_chainId){
          this.networkChainId = _chainId
      }

      get chainId(){
          return this.networkChainId
      }



}

export default new RootStore()