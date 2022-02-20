import ContentCard from './contentCard'
import { Content } from '../../../../non-react-components/utils/interfaces'
import { useEffect, useState } from 'react'
import LoadingAnimation from '../../sharedComponents/loadingAnimation'

interface PropType {
  bitverseSigner: any
  ipfs: any
  userAddress: string
}

const DisplayUserContent: React.FC<PropType> = ({
  bitverseSigner,
  ipfs,
  userAddress,
}) => {
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  const [userContent, setUserContent] = useState([])
  const [contentMetadata, setContentMetadata] = useState(null)
  const [userContentCount, setUserContentCount] = useState(0)

  useEffect(() => {
    getUserContent()
  }, [bitverseSigner])

  async function getUserContent() {
    if (bitverseSigner && ipfs) {
      setIsLoadingContent(true)

      //get all the indices that belongs to the user
      //get all the cids
      //then get all the content for those cids from the contentMapping

      //well the solidity mapping cannot return the whole array
      //but it can return the length of the array
      //so get array's length then iterate through it!
      var authorToCidIndicesArrayLength = await bitverseSigner.authorToCidIndicesLength()
      console.log('indices: ' + authorToCidIndicesArrayLength)

      if (authorToCidIndicesArrayLength && authorToCidIndicesArrayLength > 0) {
        setUserContentCount(authorToCidIndicesArrayLength)

        var contentArray = []
        var metadataArray = []
        const metadataMap = new Map()

        for (var i = 0; i < authorToCidIndicesArrayLength; i++) {
          var cidIndex = await bitverseSigner.authorToCidIndices(userAddress, i)
          var theCid = await bitverseSigner.cidsArray(cidIndex)
          //now get the content from the contentsMapping[] array

          //theCid (eg.) =
          var content = await bitverseSigner.contentsMapping(theCid)
          contentArray.push(content)
          var res = await ipfs.cat(content.metadataCid)
          // var data = await res.Json()
          console.log("** Metadata from Cid **")
          console.log(res)
          //sets the metadata for each Content
          metadataMap.set(theCid, res)
        }

        if (contentArray) {
          setUserContent(contentArray)
          // console.log(contentArray)
          setIsLoadingContent(false)
        }

        if (metadataMap) {
          console.log('**metadata map**')
          console.log(metadataMap)
          setContentMetadata(metadataMap)
          // console.log(metadataMap.get(contentArray[0].cid))
        }
      } else {
        //author has no content yet!
        //message: Your dashboard looks empty, Lets add something!
        console.log('NO CONTENT FOUND')
        setIsLoadingContent(false)
      }
      //contentsMapping
    } else {
      console.log('no contract found')
    }
  }

  // async function getMetadata(mCid: string) {
  //   var res = await ipfs.get(mCid)
  //   var metadata = await res.json(res)
  //   return metadata
  // }

  function ShowContent() {
    if (userContentCount > 0 && userContent) {
      //fetch and display content
      return (
        <div className="div">
          {userContent.map((content: Content) => (
            <ContentCard
              key={content.cid}
              content={content}
              userMetadata={contentMetadata}
            />
          ))}
        </div>
      )
    } else {
      return (
        <div className="text-white mt-32 font-semibold text-center py-4 px-8  bg-red-400 rounded-md">
          Looks like you have no content uploads yet
        </div>
      )
    }
  }

  return (
    <div className="div">
      {isLoadingContent ? <LoadingAnimation /> : <ShowContent />}
    </div>
  )
}

export default DisplayUserContent
