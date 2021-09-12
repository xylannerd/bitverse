import Head from 'next/head'
import Link from 'next/link'

import Logo from './Logo/logo'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Blockies from 'react-blockies'
import { motion } from 'framer-motion'

import MetaMaskOnboarding from '@metamask/onboarding'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

import { Popover, Transition } from '@headlessui/react'
import { usePopper } from 'react-popper'

import React from 'react'

function Navbar() {
  const [mProvider, setmProvider] = useState(null)
  const [activeAccount, setActiveAccount] = useState('')

  const [chainId, setChainId] = useState(null)

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

  //TODO
  //need refactoring
  useEffect(() => {
    function initProvider() {
      detectEthereumProvider().then((prv) => {
        // setMmProvider(prv)
        setmProvider(prv)
        setChainId(prv.chainId)
      })
    }
    initProvider()
  }, [])

  const MyBlockies = () => (
    <Blockies
      seed={activeAccount}
      size={11}
      bgColor="#000000"
      spotColor="#000000"
    />
  )

  //runs with first render inside useEffect

  function requestForAccount() {
    mProvider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => handleAccountsChanged(accounts))
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
    if (ethereum.selectedAddress) {
      setActiveAccount(ethereum.selectedAddress)
    }
  }, [activeAccount])

  useEffect(() => {
  
      ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.

        handleAccountsChanged(accounts)
      })
   
  }, [activeAccount])

  useEffect(() => {
    ethereum.on('disconnect', (error) => {
      window.location.reload()
      console.log('Metamask Disconnected')
    })
  }, [activeAccount])

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.')
      setActiveAccount(null)

    } else if (accounts[0] !== activeAccount) {
      setActiveAccount(accounts[0])
      // Do any other work!
    }
  }

  useEffect(() => {
    ethereum.on('chainChanged', (_chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      handleChainChanged(_chainId)
    })
  }, [chainId])

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    if (chainId !== _chainId) {
      window.location.reload()
    }
  }

  function HandleMetamaskConnectionButton() {
    if (mProvider) {
      //metamask installed
      if (activeAccount) {
        //When the user hovers show the address
        return (
          <div className="flex flex-row items-center justify-center text-white mr-8 ring-1 ring-gray-800 rounded-md py-1 pl-2 pr-3 select-none">
            <Image src="/greendot.svg" alt="Connected" width={16} height={16} />
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

  function handleOnboarding() {
    const onboarding = new MetaMaskOnboarding()
    onboarding.startOnboarding()
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex items-center w-full h-16 bg-black shadow-md">
        <div className="flex w-3/6 h-full items-center bg-black">
          <Logo />
          {chainId && <p>{chainId}</p>}
        </div>
        <div className="flex  w-3/6 h-full bg-black items-center justify-end">
          <HandleMetamaskConnectionButton />
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button ref={setReferenceElement}>
                  <motion.div
                    className="rounded-full h-10 w-10 mr-8 bg-indigo-50 overflow-hidden flex items-center justify-center"
                    whileHover={{ boxShadow: '0px 0px 8px white' }}
                    whileTap={{ scale: 0.99, boxShadow: '0px 0px 10px white' }}
                  >
                    {activeAccount && <MyBlockies />}
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
        </div>
      </div>
    </>
  )
}

export default Navbar
