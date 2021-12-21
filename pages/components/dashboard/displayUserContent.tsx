import ContentCard from './contentCard'
import { Content } from '../interfaces'

interface Props {
  userContentCount: number;
  userContent: Content[];
  userMetadata: Map<any, any>;
}

const DisplayUserContent: React.FC<Props> = ({ userContentCount, userContent, userMetadata }) => {
  if (userContentCount > 0 && userContent) {
    //fetch and display content
    return (
      <div className="div">
        {userContent.map((content: Content) => (
          <ContentCard key={content.cid} content={content} userMetadata={userMetadata}/>
        ))}
      </div>
    )
  } else {
    return (
      <div className="text-white font-semibold text-center py-4  bg-red-400 rounded-md">
        Looks like you have no uploads yet
      </div>
    )
  }
}

export default DisplayUserContent
