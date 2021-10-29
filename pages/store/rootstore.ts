import { makeAutoObservable } from "mobx"

class RootStore{

    userAddress;

    constructor() {
        makeAutoObservable(this);
      }


      setAddress(address){
          this.userAddress = address;
      }

      get address(){
          return this.userAddress;
      }



}

export default new RootStore()