import Navbar from '../components/navComponent/navbar'
import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-full font-bodyfont text-black bg-gradient-to-br from-gray-200 to-gray-300">
      <Navbar />

      <div className="flex flex-col mt-8 font-logofont text-black font-bold text-2xl items-center justify-center">
        <div className="div">Welcome to Bitverse</div>
      </div>

      <div className="flex flex-col  mt-16 items-center">
        <div id="para-heading" className="flex w-3/4 font-bold">
          So, what is Bitverse?
        </div>
        <div id="para-body" className="flex flex-col flex-wrap w-3/4 mt-4">
          <p>
            In Open-web, content creators would be creating value without
            capturing it.
          </p>
          <p>
            Bitverse seeks to correct the asymmetry between value created and
            value captured.
          </p>
          <br />
          <p className="font-bold">How does it work -</p>
          <p>
            When you the creator upload, let's say an image on the bitverse,
            following things happen -
          </p>
          <br />
          <p className="font-normal italic">
            <ul className="list-disc">
              <li>
                The image is added to IPFS, you may host the image on your
                computer or pin it on services like pinata. Your fans can also
                consume and seed that content on their devices.
              </li>
              <li>
                Now the CID of that image is added to the smart contract on the
                ethereum blockchain, along with information like its author, the
                likes and dislikes it has, etc.
              </li>
            </ul>
          </p>
          <br />
          <p>
            Now whenever any user likes or dislikes a content, the record is
            updated inside the smart contract.
          </p>
          <br />
          <p className="italic font-semibold">
            And the author of the content is rewarded in following way -
          </p>

          <ul className="list-disc italic">
            <br />
            <li>
              An ERC20 token (Bitstone - BIT) is minted to the author's address
              whenever their content's hits a milestone.
            </li>
            <li>
              The current Milestone is '10', i.e., for every 10th netlike the
              content is able to accrue, a token will be minted to the author's
              address.
            </li>
            <li>
              Creators can choose to trade these tokens on DEX, Crypto-Exchanges
              or hodl if they like.
            </li>
            <li>
              Those tokens would represent the likeability and credibility of
              the content as well as the creator in the vast expanse of the
              distributed network.
            </li>
            <li>
              Those tokens can be used to get a sense of how much value you are
              generating through your content.
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap mt-8 w-3/4">
          <div className="div">
            You can read more about bitverse{' '}
              <a
                href="https://xylan.medium.com/bitverse-b97d65611d5e"
                target="_blank"
                className='text-blue-500 hover:text-blue-400'
              >
                here
              </a>
            <div className="flex">
              <p>
                Read about the Incentive structure of bitverse{`\n`}
                <a
                  href="https://xylan.medium.com/incentive-structure-of-bitverse-6f5c680795f"
                  target="_blank"
                  className='text-blue-500 hover:text-blue-400'
                >
                  here
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-16 mb-64 items-center">
          <Link href="/nft">
            <a>
              <div className="text-white font-semibold text-center py-4 px-8 bg-blue-400 cursor-pointer rounded-md shadow-lg">
                Click here and let's start from NFTs 🍭
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
