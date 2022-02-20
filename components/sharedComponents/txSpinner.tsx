import Lottie from 'react-lottie'
import loadingAnimation from '../../public/circle-spinner.json'

interface PropType {
  size: number
}

const TxSpinner: React.FC<PropType> = ({ size }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return <Lottie options={defaultOptions} height={size} width={size} />
}

export default TxSpinner
