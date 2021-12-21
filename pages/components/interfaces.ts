import { BigNumber } from "ethers";

export interface Content {
    cid: string
    metadataCid: string
    author: string
    likes: BigNumber
    dislikes: BigNumber
    netlikes: BigNumber
    milestone: BigNumber
    timeStamp: BigNumber
  }