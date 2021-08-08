import styled from 'styled-components'
import Head from 'next/head'
import Color from '../../styles/colors'

import Logo from './Logo/logo'
import { useState, useEffect } from 'react'

import MetaMaskOnboarding from '@metamask/onboarding'

function Navbar({ provider, userAccount, requestAccount, isConnected }) {


  function HandleMetamaskConnection() {
    if (provider) {
      //connect
      if (isConnected) {
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
        <Logo />
        <HandleMetamaskStyle>
          <HandleMetamaskConnection />
        </HandleMetamaskStyle>

     
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
