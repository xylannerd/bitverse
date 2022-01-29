interface Props {
  setisModalOpen: any
  isModalOpen: boolean
}

export const AddContent: React.FC<Props> = ({
  setisModalOpen,
  isModalOpen,
}) => {
  return (
    <div
      className="mt-4 py-4 flex flex-col w-10/12 lg:w-8/12 xl:w-7/12 bg-black text-white font-bold border-dashed border-2 border-gray-400 select-none cursor-pointer rounded-md items-center justify-center shadow-md"
      onClick={() => setisModalOpen(!isModalOpen)}
    >
      <p>+</p>
      <p>Add Content</p>
    </div>
  )
}
