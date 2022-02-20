import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select'
import Lottie from 'react-lottie'
import loadingAnimation from '../../../../public/spiral-dots-preloader.json'

import Inputs from './inputs'
import { useEffect } from 'react'

interface Props {
  selectedTokenStandard: any
  setSelectedTokenStandard: any
  onSubmit: SubmitHandler<Inputs>
  options: {
    value: string
    label: string
  }[]
  isLoadingPreview: boolean
  errorOccured: boolean
  setErrorOccured: any
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const NftForm: React.FC<Props> = ({
  selectedTokenStandard,
  setSelectedTokenStandard,
  onSubmit,
  options,
  isLoadingPreview,
  errorOccured,
  setErrorOccured,
}) => {
  useEffect(() => {
    console.log('error occured: ')
    console.log(errorOccured)
  }, [errorOccured])

  var schema = yup.object().shape({
    TokenId: yup.string().required(),
    TokenAddress: yup.string().required(),
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  })

  return (
    <div
      id="nftFetchForm"
      className="flex flex-col w-full h-full items-center justify-center px-8"
    >
      <div className="mb-8 font-semibold">Let's fetch your NFT</div>

      <div id="inputForm" className="mt-4 w-full max-w-lg">
        <Select
          defaultValue={selectedTokenStandard}
          onChange={setSelectedTokenStandard}
          options={options}
          placeholder="Select NFT Standard"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <label className="select-none mt-4">Token Address:</label>

          <input
            {...register('TokenAddress')}
            className="px-1 border shadow-inner rounded-sm focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
          />
          <p className="text-red-500"> {errors.TokenAddress?.message} </p>

          <label className="mt-4 select-none">Token Id: </label>
          <input
            {...register('TokenId')}
            className="px-1 border shadow-inner rounded-sm focus:outline-none focus:ring-2 focus:border-transparent hover:border-blue-400"
          />
          <p className="text-red-500"> {errors.TokenId?.message} </p>

          {!isLoadingPreview ? (
            errorOccured ? (
              <div className="div">
                <div className="text-red-400">Error</div>
                <div className="text-gray-500">Please try again</div>
              </div>
            ) : (
              <input
                type="submit"
                value="Fetch NFT"
                className="bg-black text-white rounded-md py-2 mb-8 mt-8 w-4/6 place-self-center"
              />
            )
          ) : (
            <div className="py-2 mb-8 mt-8 w-4/6 place-self-center">
              <Lottie options={defaultOptions} height={150} width={150} />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default NftForm
