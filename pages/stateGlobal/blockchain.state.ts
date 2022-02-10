import { proxy } from 'valtio'


interface IStore {
userAddress: string
chainId: number
networkId: number
ipfs: any
}

const store = proxy<IStore>({
    userAddress: '',
    chainId: null,
    networkId: null,
    ipfs: null
})

export default store