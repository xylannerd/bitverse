import styled from 'styled-components'
import Head from 'next/head'
import Link from 'next/link'
import Color from '../../styles/colors'

import Logo from './Logo/logo'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Blockies from 'react-blockies'
import { motion } from 'framer-motion'

import MetaMaskOnboarding from '@metamask/onboarding'
import { Popover, Transition } from '@headlessui/react'

import { usePopper } from 'react-popper'

import React from 'react'

function Navbar({ provider, userAccount, requestAccount, isConnected }) {
  const [active, setActive] = useState()

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

  useEffect(() => {
    HandleMetamaskConnection()
  }, [userAccount])

  const MyBlockies = () => (
    <Blockies
      seed={userAccount}
      size={11}
      bgColor="#000000"
      spotColor="#000000"
    />
  )

  function HandleMetamaskConnection() {
    if (provider) {
      //connect
      if (userAccount) {
        //When the user hovers show the address
        return <ConnectedText>Connected</ConnectedText>
      } else {
        return <button onClick={requestAccount}>connect!</button>
      }
    } else {
      //install metamask - link to metamask
      return <button onClick={handleOnboarding}> Install Metamask </button>
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
        </div>
        <div className="flex  w-3/6 h-full bg-blue-900 items-center justify-end">
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button ref={setReferenceElement}>
                  <motion.div
                    className="rounded-full h-10 w-10 mr-8 bg-indigo-50 overflow-hidden flex items-center justify-center"
                    whileHover={{ boxShadow: '0px 0px 8px white' }}
                    whileTap={{ scale: 0.99, boxShadow: '0px 0px 10px white' }}
                  >
                    {userAccount && <MyBlockies />}
                  </motion.div>
                </Popover.Button>
               
                <Popover.Panel
                    className="absolute z-20 bg-white py-1 px-3 rounded-md shadow-md"
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <div className="flex flex-col">
                      <a href="#">Dashboard</a>
                      <a href="/engagement">Engagement</a>
                      <a href="/security">Security</a>
                      <a href="/integrations">Integrations</a>
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

const NavBar = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  /* padding-left: 32px; */
  /* padding-right: 32px */
  width: 100%;
  height: 72px;
  background-color: ${Color.findMeBlue};
  /* background-color: rgba(230, 230, 230, 0.999); */

  /* background-image: linear-gradient(90deg, #1949a1, #482475, #414487, #355f8d, #2a788e, #21908d, #22a884, #42be71, #7ad151, #bddf26, #bddf26); */
  /* background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%, #13547a 70%); */
  box-shadow: 0px 0px 4px 0px black;
`

const LeftHalf = styled.div`
  width: 50%;
  height: 100%;
  background: greenyellow;
  display: flex;
  align-items: center;
`

const RightHalf = styled.div`
  width: 50%;
  height: 100%;
  background: #000000;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;
  color: green;
`
const RelativeDiv = styled.div`
  position: relative;
`
const MenuItems = styled.div`
  position: absolute;
  margin-top: 8px;
`
const Avatar = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100%;
  background: white;
  margin-right: 32px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`

const UserAddress = styled.div`
  color: grey;
  margin-left: 32px;
`

const ConnectedText = styled.div`
  color: green;
  /* margin-left: 32px; */
`

const HandleMetamaskStyle = styled.div`
  margin-left: 1rem;
`

// const SearchBar = styled.div`
//   width: 40%;
//   height: 60%;
//   background-color: rgba(255, 255, 255, 0.808);
//   margin-left: 20rem;
//   box-shadow: 0px 0px 2px 0px lightgrey;
//   border-radius: 2px;
//   font-family: 'Montserrat', sans-serif;
//   font-weight: 300;
//   color: grey;
//   display: flex;
//   align-items: center;
//   padding-left: 16px;
// `
