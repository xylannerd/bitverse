

<h1 align="center"> Bitverse </h1>


<p align="center">
  <a href="https://bitverse.xyz/"><img src="https://img.shields.io/badge/Website-bitverse.xyz-blue" /> </a>
  <a href="https://discord.gg/UMWeSzAXR9"><img src="https://img.shields.io/discord/853198201149456385?color=brightgreen&label=discord" /></a>
</p>



<p>
In Open-web, content creators would be creating value without capturing it.
</p>
<p>
Bitverse is a <a href="https://en.wikipedia.org/wiki/Decentralized_autonomous_organization">DAO</a> which corrects the asymmetry between value created and value captured by the creators of the open-web.
</p>

<p>It records all the likes/dislikes an NFT or a Content gets and rewards the creator autonomously.</p>





<p align="center">
  <a href="https://xylan.medium.com/bitverse-b97d65611d5e" target="_blank" title="BITVERSE">
    <img src="https://miro.medium.com/max/1400/1*NyZLWOaav7pWDuruoe6vtw.png" alt="Bitverse Overview" />
  </a>
  <p align="center">Image: Overview Of Bitverse </p>
</p>

---
### How does it work -

When you the creator upload, let's say an image on the bitverse, following things happen -
* The image is added to IPFS, you may host the image on your computer or pin it on services like pinata. Your fans can also consume and seed that content on their devices.
* Now the CID of that image is added to the smart contract on the ethereum blockchain, along with information like its author, the likes and dislikes it has, etc.
* It is stored inside the smart contract as a struct -    
    
    


    ```
    /// @dev The main 'Content' struct.
    /// Every content in Bitverse is represented by a copy of this structure.
    struct Content {
        //The IPFS-CID of the content.
        //A unique identifier for the content.
        string cid;
        //The IPFS-CID of the content metadata.
        //Example: Name, Description for a video content.
        //Stored on IPFS in JSON format.
        string metadataCid;
        //Address of the content author.
        address payable author;
        //Total likes the author got for this content.
        uint256 likes;
        //Total dislikes the author got for this content.
        uint256 dislikes;
        // This is the net number of likes
        // netlikes = likes - dislikes.
        // It can also be a negative number,
        // hence a signed integer.
        // The token rewarded are calculated upon the number of netlikes.
        // Note: No tokens can be rewarded more than once for the same milestone,
        // We use milestone below to keep track of the checkpoints.
        int256 netlikes;
        // This is used to make sure no author is rewarded a token more than once for the same milestone.
        uint256 milestone;
        // This mapping contains all the users who've liked this content.
        // Also used to make sure no user likes the content more than once.
        mapping(address => bool) usersLiked;
        // This mapping contains all the users who've disliked this content.
        // Also used to make sure no user dislikes the content more than once.
        mapping(address => bool) usersDisliked;
        // The timestamp from the block when this content came into existence on the bitverse.
        uint256 timeStamp;
        //the content type, eg: image, video, blog, land, website etc.
        string contentType;
    }
    ```

      
      
Now whenever any user likes or dislikes a content, the record is updated inside the smart contract.

 _Now the author of the content is rewarded in following way -_

* An ERC20 token (Bitstone - BIT) is minted to the author's address whenever their content's hits a milestone.
* The current Milestone is '10', i.e., for every 10th netlike the content is able to accrue, a token will be minted to the author's address.
* Creators can choose to trade these tokens on DEX, Crypto-Exchanges or hodl if they like.
* Those tokens would represent the likeability and credibility of the content as well as the creator in the vast expanse of the distributed network.
* Those tokens can be used to get a sense of how much value you are generating through your content.


---

### Technologies used:

<h5>Ethereum: </h5>
<p> - Smart contract on Ethereum handles all the records of nfts, content, content authors.</p>
<p> - Rewards creators and acts as a single source of truth.</p>

<h5>IPFS: </h5>
<p> - Bitverse is decentralized platform and uses Ipfs as the storage layer.</p>
<p> - All the content including but not limited to Images, Videos, Blogs, NFT-Metadata are stored on IPFS</p>
<p> - Making it temperproof and resistant to censorship. </p>


---

### Learn more:

<p>Learn more about Bitverse <a href="https://xylan.medium.com/bitverse-b97d65611d5e" target="_blank">here</a> </p>
<p>Read about the Incentive structure of Bitverse <a href="https://xylan.medium.com/incentive-structure-of-bitverse-6f5c680795f" target="_blank">here</a>





---

### Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: You need an alchemy-key (Polygon Mumbai) to run this in your local machine, you can get it from https://www.alchemy.com/

Just add an env.local file with your alchemy-key like so:

//inside env.local

NEXT_PUBLIC_ALCHEMY_KEY=yOurAlchEMYkEY
