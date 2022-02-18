import { proxy } from 'valtio'


interface IStore {
userAddress: any
chainId: string
networkId: number
ipfs: any
}

const store = proxy<IStore>({
    userAddress: null,
    chainId: null,
    networkId: null,
    ipfs: null
})

export default store