interface Props {
  setIsNftModalOpen: any
  isNftModalOpen: boolean
}

 const AddNft: React.FC<Props> = ({
  setIsNftModalOpen,
  isNftModalOpen,
}) => {
  return (
    <div
      className="flex py-4 flex-col w-10/12 lg:w-8/12 xl:w-7/12 select-none cursor-pointer  rounded-md items-center justify-center shadow-xl relative overflow-hidden"
      onClick={() => setIsNftModalOpen(!isNftModalOpen)}
    >
      <img className="-z-50 absolute" src="/deer-nft.jpg" object-fit="cover" />
      <div className="z-10 flex flex-col justify-center items-center text-white font-bold  ">
        <p>+</p>
        <p>Add NFT</p>
      </div>
    </div>
  )
}

export default AddNft