import { proxy } from 'valtio'


interface IStore {
userAddress: string
chainId: number
networkId: number
}

const store = proxy<IStore>({
    userAddress: '',
    chainId: null,
    networkId: null
})

export default store