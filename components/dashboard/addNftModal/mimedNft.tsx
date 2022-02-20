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
      className="flex w-full h-96 bg-gray-700 bg-opacity-20 rounded-lg overflow-hidden select-none"
    >
      <img className="w-full h-full object-contain" src={url} />
    </div>
  )
}

export default MimedNft
