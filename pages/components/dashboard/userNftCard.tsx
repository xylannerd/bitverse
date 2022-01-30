import { useState } from 'react'
import { Nft } from '../interfaces'

interface PropType {
  nft: Nft
}

const UserNftCard: React.FC<PropType> = ({ nft }) => {
  return <div className="div">UserNftCard</div>
}

export default UserNftCard
