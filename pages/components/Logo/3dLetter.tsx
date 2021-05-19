import styled from 'styled-components'
import Ztext from 'react-ztext'

const Letter3d = ({children} : {children : string}) => (

    <>

    <Ztext
    depth='4px'
    direction='backwards'
    event='none'
    eventRotation='45deg'
    eventDirection='reverse'
    fade={true}
    layers={10}
    perspective='500px'
    transform-style='preserve-3d'
    // style={{
    //   fontSize: '2rem'
    // }}
  >
   <div>{children}</div> 
  </Ztext>


</>
)

export default Letter3d


// const Logo = styled.p`
//   /* font-family: 'Montserrat', sans-serif; */
//   /* font-weight: 500; */
//   font-size: 27px;
//   /* margin-left: 32px; */
//   color: white;
// `
