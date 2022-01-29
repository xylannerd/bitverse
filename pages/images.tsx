import Link from 'next/link'
import Navbar from './navbar'

export default function Images() {



  return (
    <div className="div">
      <Navbar />
      <div className="flex flex-col mt-4  font-logofont text-logowhite font-bold text-2xl ml-8 cursor-pointer items-center justify-center">
        <div className="div">Welcome to Images</div>
        <iframe
          src="https://lh3.googleusercontent.com/BpjMWMaTEGK2D4nnlYy-GQjOHWRx95kHf_vAI_eiUUvs7bQL2NZgFxVzv721UlQntlN34ZX9NvYHV60NcBL9lwyoRAXuhuVDADDP=w600"
          width="640"
          // height=""
          name="tokenPreview"
        />



      </div>
    </div>
  )
}
