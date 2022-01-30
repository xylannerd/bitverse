import Image from 'next/image'
import { CID } from 'multiformats/cid'
import { Content } from '../interfaces'

const IPFS_GATEWAY = 'ipfs.io'
const IPFS_PUBLIC_GATEWAY = 'dweb.link'
const PINATA_PUBLIC_GATEWAY = 'gateway.pinata.cloud'

interface Props {
  content: Content
  userMetadata: any
}

const ContentCard: React.FC<Props> = ({ content, userMetadata }) => {
  //`https://${IPFS_PUBLIC_GATEWAY}/ipfs/${content.cid}`
  // `ipfs://${content.cid}`
  //`http://localhost:48084/ipfs/${content.cid}`
  // https://{CID}.ipfs.infura-ipfs.io/{optional path to resource}

  ///SUB-DOMAIN Format
  //https://{CID}.ipfs.{gatewayURL}/{optional path to resource}

  let cid
  let metadata
  let title
  let description
  //cid v1 is new and better than cid v0, lookup up the reasons yourself
  if (CID.parse(content.cid).version == 0) {
    cid = CID.parse(content.cid).toV1().toString()
  } else {
    cid = content.cid
  }

  const imageSource = `https://${cid}.ipfs.dweb.link`

  if (userMetadata) {
    metadata = userMetadata.get(content.cid)
    console.log('** CARD **')
    console.log(metadata)
  }

  //hover:bg-gray-900 hover:bg-opacity-50 cursor-pointer
  return (
    <div className="flex h-56 border-b border-opacity-40 ">
      <div className="flex flex-row items-center">
        <div
          id="imageBackground"
          className="flex w-44 h-5/6 shrink-0 z-10 mx-4 bg-gray-700 bg-opacity-25 rounded-md overflow-hidden"
        >
          <img className="object-cover" src={imageSource} />

          {/* next.js Image doesn't work nicely with ipfs! */}
          {/* <div className="relative">
            <Image
              className="object-contain"
              src={imageSource}
              unoptimized={true}
              layout="fill"
            />
          </div> */}
        </div>

        <div id="cardBody" className="h-full grow pt-8 pb-8 pl-4 pr-64">
          <div className="flex flex-col h-full grow text-white justify-between flex-nowrap overflow-hidden truncate">
            <div className="div">
              <div className="text-gray-500 text-sm">meta:</div>
              {metadata && <div></div>}
              <div className="text-gray-500 text-sm">Description:</div>
            </div>

            <div className="flex flex-col">
              <div className="">
                Cid: {CID.parse(content.cid).toV1().toString()}
              </div>
              <div className="flex flex-row space-x-4 text-gray-500 text-sm">
                <div className="div">
                  Netlikes: {content.netlikes.toNumber()}
                </div>

                <div className="div">Likes: {content.likes.toNumber()}</div>
                <div className="div">
                  Dislikes: {content.dislikes.toNumber()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentCard
