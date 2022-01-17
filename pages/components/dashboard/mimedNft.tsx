interface Props {
  url: string
}

//doing just images for now
//check the mime type
//and return the element accordingly
//<img/> for image
//<video/> for video
const MimedNft: React.FC<Props> = ({ url }) => {
  return (
    <div
      id="imageBackground"
      className="flex w-full h-96 shrink-0 items-center justify-center bg-gray-700 bg-opacity-20 rounded-lg overflow-hidden select-none"
    >
      <img src={url} object-fit="contain" className="rounded-lg" />
    </div>
  )
}

export default MimedNft
