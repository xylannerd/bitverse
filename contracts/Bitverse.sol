// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A decentralised platform for content creators //TODO
/// @author Xylan W. Reeves
/// @notice You can use this contract for saving ipfs hashes znd doing stuff with it //TODO
/// @dev //TODO
contract Bitverse is ERC20 {
    /** TEMPORARY STUFF **/
    //eXAMPLE cID - QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH

    /** ERRORS **/

    /// `cid` is an invalid Ipfs-Cid
    /// @param cid Ipfs-Cid entered.
    error InvalidCid(string cid);
    /// Empty cid entered.
    error EmptyCid();

    /// Content with Cid: `cid` already exist.
    /// @param cid Cid entered.
    error contentAlreadyExist(string cid);

    // @dev An array that contains all the Cids in existence
    // Can be use to get every cid
    // hence every ipfs content there is.
    string[] public cidsArray;

    //@dev Mapping that contains all the Content in existence
    // Unique Cid to Content struct.
    mapping(string => Content) contentsMapping;

    //3 Global Mappings.

    /// @dev A mapping of Cid (Content identifier) to their respective Owners
    mapping(string => address) public cidToAuthor;

    /// @dev This mapping returns all the indices of Contents (inside array contents[])
    /// owned by each author.
    mapping(address => uint256[]) public authorToCidIndices;

    /// @dev The main 'Content' struct.
    /// Every content in Bitverse is represented by a copy of this structure.
    // TODO Not yet optimized for the byte-packing rules used by Ethereum.
    struct Content {
        //The IPFS-CID of the content.
        //A unique identifier for the content.
        string cid;
        // //TODO

        //The IPFS-CID of the content metadata.
        //Example: Name, Description for a video content.
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
        // We use nonce below for this purpose.
        int256 netlikes;
        // This is used to make sure no author is rewarded a token more than once for the same milestone.
        uint256 nonce;
        // This mapping contains all the users who've liked this content.
        // Also used to make sure no user likes the content more than once.
        mapping(address => bool) usersLiked;
        // This mapping contains all the users who've disliked this content.
        // Also used to make sure no user dislikes the content more than once.
        mapping(address => bool) usersDisliked;
        // The timestamp from the block when this content came into existence.
        uint256 timeStamp;
    }

    /// The constructor for this smart contract
    /// Initializes the name, symbol and initial supply of the token.
    constructor(uint256 initialSupply) ERC20("Bitstone", "BIT") {
        _mint(msg.sender, initialSupply);
    }

    /**  FUNCTIONS **/

    //add single content
    /// @dev Generate a new Content for the provided Ipfs-Cid
    /// and stores it.
    function _addContent(string memory _cid) public {
        //Make sure NON-EMPTY Cid is entered
        if (bytes(_cid).length < 0) revert EmptyCid();
        //TODO Make sure Ipfs-Cid has the corrent format
        // if (_cid == incorrectFormat) revert InvalidCid(_cid);

        //make sure content doesnt already exist
        if (cidToAuthor[_cid] != address(0)) revert contentAlreadyExist(_cid);

        //refactored Code:
        //since we gonna use string[] cidArray now and mapping of content.
        Content storage c = contentsMapping[_cid];
        c.cid = _cid;
        c.author = payable(msg.sender);
        c.timeStamp = block.timestamp;

        cidsArray.push(_cid);
        uint256 newIndex = cidsArray.length - 1;
        cidToAuthor[_cid] = msg.sender;
        authorToCidIndices[msg.sender].push(newIndex);
    }

    // function like(string memory _cid) public {
    //         Content storage c = contentsMapping[_cid];
    //         if(c.usersLiked[msg.sender] != true){
    //             c.usersLiked[msg.sender] = true;
    //             if(c.usersDisliked[msg.sender] == true){
    //                 c.usersDisliked[msg.sender] == false;
    //                 c.dislikes--;
    //             }
    //             c.likes++;
    //             c.netlikes++;
    //             //logic for rewarding ERC777 for every 100th netLikes.

    //             if(c.netLikes % 100 == 0 && c.netLikes / 100 == c.nonce + 1){
    //                   //mint function to hit with every 100th netLike
    //                  _mint(c.author, 1, "", "");
    //                  c.nonce++;
    //             }

    //         } else {
    //             revert("Already liked!");
    //         }

    // }

    // function dislike(string memory _cid) public {
    //         uint256 cId = cidHashToIndex[_hash];
    //         Content storage c = contents[cId];
    //         if(c.usersDisliked[msg.sender] != true){
    //             c.usersDisliked[msg.sender] = true;
    //             if(c.usersLiked[msg.sender] == true){
    //                 c.usersLiked[msg.sender] == false;
    //                 c.likes--;
    //                 c.netLikes--;
    //             }
    //             c.dislikes++;
    //             c.netLikes--;
    //         } else {
    //             revert("Already disliked!");
    //         }

    // }

    ///@dev Reurns the total number of Content in existence.
    /// Should be equal to the Length of the content[].
    function getTotalContentCount() public view returns (uint256) {
        return cidsArray.length;
    }

    /*  
    If you have a public state variable of array type,
    then you can only retrieve single elements of the array via the generated getter function. 
    Therefore the entire array can only be returned by a function  
    */

    // @notice Function that returns entire cid array.
    function getCidArray() public view returns (string[] memory) {
        return cidsArray;
    }

    // /// @dev Add multiple contents from a single transaction
    // function addMultipleContent(string[] memory _cid) public {}
}
