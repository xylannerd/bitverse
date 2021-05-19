import styled from 'styled-components'
import Head from 'next/head'
import Color from '../../styles/colors'

import Logo from './Logo/logo'

const Navbar = () => (
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
     
     <Logo/>

      {/* <SearchBar>Search</SearchBar> */}
    </NavBar>
  </>
)

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
