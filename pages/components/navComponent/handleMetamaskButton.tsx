import MetaMaskOnboarding from '@metamask/onboarding'

interface Props {
  userAddress: string
  provider: any
  requestForAccount: any
}

const HandleMetamaskConnectionButton: React.FC<Props> = ({
  userAddress,
  provider,
  requestForAccount,
}) => {
  function handleOnboarding() {
    const onboarding = new MetaMaskOnboarding()
    onboarding.startOnboarding()
  }

  if (provider) {
    //metamask installed
    if (userAddress) {
      //When the user hovers show the address
      return (
        <div className="flex flex-row items-center justify-center text-white mr-8 ring-1 ring-gray-800 rounded-md py-1 pl-2 pr-3 select-none">
          <img src="/greendot.svg" alt="Connected" width={16} height={16} />
          <p className="font-thin text-sm ml-1">Connected</p>
        </div>
      )
    } else {
      return (
        <button
          onClick={requestForAccount}
          className=" flex flex-row items-center justify-center text-white mr-8 ring-1 ring-gray-800 rounded-md py-1 pl-2 pr-3 cursor-pointer"
        >
          <p className="font-thin text-sm ml-1">Link Wallet</p>
        </button>
      )
    }
  } else {
    //install metamask - link to metamask
    return (
      <button
        onClick={handleOnboarding}
        className="  flex flex-row items-center justify-center text-white mr-8 ring-1 ring-gray-800 rounded-md py-1 pl-2 pr-3 cursor-pointer"
      >
        <p className="font-thin text-sm ml-1">Install Metamask</p>
      </button>
    )
  }
}

export default HandleMetamaskConnectionButton
