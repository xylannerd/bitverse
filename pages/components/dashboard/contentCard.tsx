import Image from 'next/image'
import { CID } from 'multiformats/cid'


const IPFS_GATEWAY = 'ipfs.io'
const IPFS_PUBLIC_GATEWAY = 'dweb.link'
const PINATA_PUBLIC_GATEWAY = 'gateway.pinata.cloud'

function ContentCard({ content }) {
  //`https://${IPFS_PUBLIC_GATEWAY}/ipfs/${content.cid}`
  // `ipfs://${content.cid}`
  //`http://localhost:48084/ipfs/${content.cid}`
  // https://{CID}.ipfs.infura-ipfs.io/{optional path to resource}

  ///SUB-DOMAIN Format
  //https://{CID}.ipfs.{gatewayURL}/{optional path to resource}

  let cid
  //cid v1 is new and better than cid v0, lookup up the reasons yourself
  if (CID.parse(content.cid).version == 0) {
    cid = CID.parse(content.cid).toV1().toString()
  } else {
    cid = content.cid
  }

  const imageSource = `https://${cid}.ipfs.${IPFS_PUBLIC_GATEWAY}`

  return (
    <div className="flex w-full h-56 border-b border-opacity-40">
      <div className="flex flex-row items-center">
        <div
          id="imageBackground"
          className="flex w-44 h-5/6 shrink-0 items-center z-10 mx-4 justify-items-start bg-gray-700 bg-opacity-50 rounded-sm overflow-hidden "
        >
          <div className="relative">
            <Image
              className="object-contain"
              src={imageSource}
              unoptimized={true}
              layout="fill"
            />
          </div>
        </div>
        <div
          id="cardBody"
          className="flex grow h-full p-4 bg-blue-900 bg-opacity-20"
        >
          <div className="flex flex-col text-white">
            <div className="div">title</div>
            <div className="div">Description</div>
            <div className="div">woooooooo</div>
            <div className="align-bottom">
              Cid: {CID.parse(content.cid).toV1().toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentCard
