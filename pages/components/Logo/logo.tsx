import styled from "styled-components"
import Letter3d from './3dLetter'



export default function L(){
    return(
        <Logo>
        <Letter3d>b</Letter3d>
        <Letter3d>i</Letter3d>
        <Letter3d>t</Letter3d>
        <Letter3d>v</Letter3d>
        <Letter3d>e</Letter3d>
        <Letter3d>r</Letter3d>
        <Letter3d>s</Letter3d>
        <Letter3d>e</Letter3d>
          
        </Logo>
    )
}

const Logo = styled.div`
  /* font-family: 'Montserrat', sans-serif; */
  font-family: 'Oswald', sans-serif;
  font-size: 27px;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 32px;
`
