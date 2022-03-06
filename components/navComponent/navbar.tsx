import Head from 'next/head'
import Link from 'next/link'
import { useSnapshot } from 'valtio'
import store from '../stateGlobal/blockchain.state'
import { RIGHT_NETWORK } from '../utils/constants'
import Logo from '../Logo/logo'
import { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import Blockies from 'react-blockies'
import { motion } from 'framer-motion'
import bitverseAbi from '../../contract-mumbai-testnet/bitverse.json'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'
import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'
import HandleMetamaskConnectionButton from './handleMetamaskButton'
import { useRouter } from 'next/router'

const Navbar: React.FC = () => {
  const router = useRouter()

  const snapshot = useSnapshot(store)

  const [mProvider, setmProvider] = useState(null)
  const [activeAccount, setActiveAccount] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  // const { rootStore } = useContext(StoreContext)

  //popper.js for dropdown menu placement
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          // dropdown x, y axis adjustment
          offset: [-64, 6],
        },
      },
    ],
  })

  //keep this useEffect on the top!
  useEffect(() => {
    try {
      // @ts-ignore
      if (ethereum.selectedAddress) {
        // @ts-ignore
        store.userAddress = ethereum.selectedAddress
        // console.log('inside navbar: ' + snapshot.userAddress)
        // @ts-ignore
        // console.log(ethereum.selectedAddress)
      }
    } catch (error) {
      console.error('Please install metamask')
    }
  }, [snapshot.userAddress])

  //TODO
  //need refactoring
  useEffect(() => {
    async function initProvider() {
      try {
        const prv = await detectEthereumProvider()
        setmProvider(prv)
        // @ts-ignore
        store.networkId = prv.networkVersion
        // @ts-ignore
        store.chainId = prv.chainId
      } catch (error) {
        // console.error(error)
      }
    }
    initProvider()
  }, [mProvider])

  //HANDLES ACCOUNT CHANGES
  function handleAccountsChanged(_accounts) {
    if (_accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.')
    } else if (_accounts[0] !== snapshot.userAddress) {
      store.userAddress = _accounts[0]
      // console.log("+++++ accounts +++++")
      // console.log(_accounts[0])
      // console.log('=== handleAccountschanged: ===' + snapshot.userAddress)

      // Do any other work!
    }
  }

  //Link account button onClick
  function requestForAccount() {
    mProvider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        handleAccountsChanged(accounts)
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.')
        } else {
          console.error(err)
        }
      })
  }

  useEffect(() => {
    try {
      // @ts-ignore
      ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        handleAccountsChanged(accounts)
      })
    } catch (error) {
      // console.error(error)
    }
  }, [snapshot.userAddress])

  useEffect(() => {
    try {
      // @ts-ignore
      ethereum.on('disconnect', (error) => {
        window.location.reload()
        console.log('Metamask Disconnected')
      })
    } catch (error) {
      // console.error(error)
    }
  }, [snapshot.userAddress])

  useEffect(() => {
    try {
      // @ts-ignore
      ethereum.on('chainChanged', (_chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        handleChainChanged(_chainId)
      })
    } catch (error) {
      // console.error(error)
    }
  }, [snapshot.userAddress])

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    if (snapshot.chainId !== _chainId) {
      window.location.reload()
    }
  }

  return (
    <>
      <div
        id="navBar"
        className="inline-flex flex-col md:flex-row md:items-center w-full md:h-16 bg-black shadow-md"
      >
        <div
          id="leftSide"
          className="inline-flex md:w-3/6 h-16 justify-between items-center bg-black text-white md:space-x-8"
        >
          <div className="inline-flex space-x-2">
            <Logo />
            <Link href="/">
              <div className="flex flex-row items-center justify-center text-white mr-8 ring-1 ring-gray-800 hover:ring-gray-500 rounded-md md:py-1 pl-1 pr-2 md:pl-2 md:pr-3 select-none cursor-pointer">
                <p className="font-thin text-sm ml-1">About</p>
              </div>
            </Link>
          </div>
          <div
            id="toggleMenu"
            className="md:hidden justify-self-end mr-8 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            )}
          </div>
        </div>

        <div
          id="rightSide"
          className={`md:flex ${
            showMenu ? 'flex' : 'hidden'
          } flex-col md:flex-row md:w-3/6 h-full bg-black items-center justify-center md:justify-end`}
        >
          <div className="flex md:flex-row space-x-8 text-white md:mr-16">
            <Link href="/nft">
              <div
                className={`select-none cursor-pointer ${
                  router.pathname === '/nft'
                    ? 'font-extrabold underline underline-offset-auto'
                    : 'font-extrabold'
                }`}
              >
                NFTs
              </div>
            </Link>
            <Link href="/images">
              <div
                className={`select-none cursor-pointer ${
                  router.pathname === '/images'
                    ? 'font-extrabold underline underline-offset-auto'
                    : 'font-extrabold'
                }`}
              >
                IMAGES
              </div>
            </Link>
            <Link href="/videos">
              <div
                className={`select-none cursor-pointer ${
                  router.pathname === '/videos'
                    ? 'font-extrabold underline underline-offset-auto'
                    : 'font-extrabold'
                }`}
              >
                VIDEOS
              </div>
            </Link>
          </div>

          <div className="flex flex-row items-center justify-center my-4">
            <HandleMetamaskConnectionButton
              userAddress={snapshot.userAddress}
              provider={mProvider}
              requestForAccount={requestForAccount}
            />
            {snapshot.userAddress && (
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button ref={setReferenceElement}>
                      <motion.div
                        className="rounded-full h-10 w-10 mr-8 bg-indigo-50 overflow-hidden flex items-center justify-center"
                        whileHover={{ boxShadow: '0px 0px 8px white' }}
                        whileTap={{
                          scale: 0.99,
                          boxShadow: '0px 0px 10px white',
                        }}
                      >
                        {snapshot.userAddress && (
                          <Blockies
                            seed={snapshot.userAddress}
                            size={11}
                            bgColor="#000000"
                            spotColor="#000000"
                          />
                        )}
                      </motion.div>
                    </Popover.Button>

                    <Popover.Panel
                      className="absolute z-20 bg-white py-1 px-3 rounded-md shadow-md"
                      ref={setPopperElement}
                      style={styles.popper}
                      {...attributes.popper}
                    >
                      <div className="flex flex-col">
                        <Link href="/dashboard">
                          <a>Dashboard</a>
                        </Link>
                      </div>
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
