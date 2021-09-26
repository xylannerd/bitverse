import Navbar from './components/navbar'
import { useState } from 'react'
import Modal from './components/Modal'

function Dashboard() {

  const [isModalOpen, setisModalOpen] = useState(false)
  
  

  return (
    <div className="bg-black">
      <Navbar />
      {isModalOpen &&  <Modal closeModal={setisModalOpen}/> }

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
        <div className="mt-32 text-white font-semibold">Seems like you have no uploads yet</div>
      </div>
    </div>
  )
}

export default Dashboard
