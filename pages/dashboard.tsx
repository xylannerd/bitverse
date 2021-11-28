import Navbar from './components/navbar'
import { useEffect, useState } from 'react'
import Modal from './components/modal'

import store from './store/rootstore'
import { observer } from "mobx-react-lite"


const Dashboard: React.FC = observer(() => {
  const [isModalOpen, setisModalOpen] = useState(false)

  useEffect(() => {
    if (ethereum.selectedAddress) {
      store.setAddress(ethereum.selectedAddress)
    }
  }, [store.address])

  function HandleDashboard() {
    console.log("account address" + store.address)
    
    if (store.address) {
      return (
        <>
          {isModalOpen && <Modal closeModal={setisModalOpen} />}

          <div className="flex flex-col items-center justify-center mt-8">
            <div
              className="flex flex-col w-10/12 bg-black text-white border-dashed border-2 border-gray-400 select-none  cursor-pointer py-8 rounded-md items-center justify-center shadow-md"
              onClick={() => setisModalOpen(!isModalOpen)}
            >
              <p>+</p>
              <p>Add Content</p>
            </div>

            <div className="w-10/12 mt-11">
              <h1 className="text-gray-200 font-bold text-xl">My Uploads</h1>
            </div>
            <div className="mt-32 text-white font-semibold">
              Seems like you have no uploads yet
            </div>
          </div>
        </>
      )
    } else {
      return <p className="text-white mt-8 text-center "> Please link your wallet to see your stuff </p>
    }
  }

  return (
    <div className="bg-black">
      <Navbar />
      <HandleDashboard />
    </div>
  )
})

export default Dashboard
