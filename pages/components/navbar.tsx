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
import { Menu } from '@headlessui/react'
import React from 'react'

function Navbar({ provider, userAccount, requestAccount, isConnected }) {
  const [active, setActive] = useState()

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

      <NavBar>
        <LeftHalf>
          <Logo />
          <HandleMetamaskStyle>
            <HandleMetamaskConnection />
          </HandleMetamaskStyle>
        </LeftHalf>

        <RightHalf>
          <Menu>
            <Menu.Button as={React.Fragment}>
              <Avatar
                as={motion.div}
                whileHover={{ boxShadow: '0px 0px 8px white' }}
                whileTap={{ scale: 0.99, boxShadow: '0px 0px 10px white' }}
              >
                {userAccount && <MyBlockies />}
              </Avatar>
            </Menu.Button>

            <Menu.Items className="absolute z-50 p-16 mt-16">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/">
                    <a className={`${active && 'bg-gray-100'} block px-2 py-1`}>
                      Home
                    </a>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link href="#">
                    <a
                      className={`${
                        active && 'bg-gray-100'
                      } bg-white block px-2 py-1`}
                    >
                      Dashboard
                    </a>
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </RightHalf>
      </NavBar>
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
  background-color: ${Color.navGray};
  /* background-color: rgba(230, 230, 230, 0.999); */

  /* background-image: linear-gradient(90deg, #1949a1, #482475, #414487, #355f8d, #2a788e, #21908d, #22a884, #42be71, #7ad151, #bddf26, #bddf26); */
  /* background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%, #13547a 70%); */
  box-shadow: 0px 0px 4px 0px black;
`

const LeftHalf = styled.div`
  width: 50%;
  height: 100%;
  background: #000000;
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
  color: white;
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
