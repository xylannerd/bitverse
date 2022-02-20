import Lottie from 'react-lottie'
import loadingAnimation from '../../public/spiral-dots-preloader.json'


function LoadingAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return <Lottie options={defaultOptions} height={180} width={180} />
}

export default LoadingAnimation