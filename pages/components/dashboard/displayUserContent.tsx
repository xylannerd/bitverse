import ContentCard from './contentCard'
import { Content } from '../interfaces'

interface Props {
  userContentCount: number
  userContent: Content[]
  contentMetadata: Map<any, any>
}

const DisplayUserContent: React.FC<Props> = ({
  userContentCount,
  userContent,
  contentMetadata,
}) => {
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
        Looks like you have no uploads yet
      </div>
    )
  }
}

export default DisplayUserContent
