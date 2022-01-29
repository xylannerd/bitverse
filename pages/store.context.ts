import { createContext } from 'react'
import { RootStore } from './store/rootstore'

interface IStoreContext {
  rootStore: RootStore
}

const rootStore = new RootStore()

export const StoreContext = createContext<IStoreContext>({ rootStore })
