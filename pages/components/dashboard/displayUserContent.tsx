import ContentCard from './contentCard'
import { Content } from '../interfaces'

function DisplayUserContent({ userContentCount, userContent }) {
  if (userContentCount > 0 && userContent) {
    //fetch and display content
    return (
      <div className="div">
        {userContent.map((content: Content) => (
          <ContentCard key={content.cid} content={content} />
        ))}
      </div>
    )
  } else {
    return (
      <div className="text-white font-semibold text-center py-4  bg-red-400 rounded-md">
        Seems like you have no uploads yet
      </div>
    )
  }
}

export default DisplayUserContent
