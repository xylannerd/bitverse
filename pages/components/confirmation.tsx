import { useEffect, useState } from 'react'

interface ConfirmationProps {
  popUp: any,
  setPopUp: any,
  triggerUploading: any,
}

const Confirmation: React.FC<ConfirmationProps> = ({ popUp, setPopUp, triggerUploading }) => {
  const [countDown, setCountDown] = useState(5)

  var timerId

  /* 
  1st useEffect -
  starts the timer when component mounts
  clear the interval after 5 seconds using cleanup fn triggered by 2nd useEffect
  or if the user clicks on cancel
   */
  useEffect(() => {
    if (popUp)
      timerId = setInterval(() => {
        setCountDown((prevCount) => prevCount - 1)
      }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  /* 
  2nd useEffect -
  this closes the popUP after countdown hits 0
  which triggers the cleanup fn of the first useEffect.
   */
  useEffect(() => {
    if (countDown === 0) {
      console.log('second effect')
      setPopUp(false)

      //Also redirects the user to uploading process!
      triggerUploading(true)

    }
  }, [countDown])

  return (
    <div
      id="popUp"
      className="w-72 h-56 absolute z-20 flex flex-col overflow-hidden items-center justify-center shadow-lg bg-gray-50 rounded-lg"
    >
      <p>Uploading in {countDown}</p>
      <button
        className="absolute bottom-8 p-2 px-8 rounded-lg text-white bg-red-500 hover:bg-red-700"
        onClick={() => setPopUp(false)}
      >
        Cancel
      </button>
    </div>
  )
}

export default Confirmation
