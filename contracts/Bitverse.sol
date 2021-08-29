// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title A decentralised platform for content creators //TODO
/// @author Xylan W. Reeves
/// @notice You can use this contract for saving ipfs hashes znd doing stuff with it //TODO
/// @dev //TODO
contract Bitverse is ERC20 {
    /* Abbreviations used */
    // IPFS: Inter-Planetery File System.
    // Cid: Content Identifier.

    /** TEMPORARY STUFF **/
    //eXAMPLE cID - QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH

    int public constant REWARD_POINT = 5;

    // @dev An array that contains all the Cids of IPFS Content in existence
    string[] public cidsArray;

    /** 3 Global Mappings. **/

    //@dev Mapping that contains all the Content in existence
    // Unique Cid to Content struct.
    mapping(string => Content) public contentsMapping;

    /// @dev A mapping of Cid to their respective Owner
    mapping(string => address) public cidToAuthor;

    /// @dev This mapping returns all the indices of Cids (inside array cidsArray)
    /// owned by each author.
    mapping(address => uint256[]) public authorToCidIndices;

    /// @dev The main 'Content' struct.
    /// Every content in Bitverse is represented by a copy of this structure.
    // TODO Not yet optimized for the byte-packing rules used by Ethereum.
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
        // We use milestone below to keep track of the milestones.
        int256 netlikes;
        // This is used to make sure no author is rewarded a token more than once for the same milestone.
        uint256 milestone;
        // This mapping contains all the users who've liked this content.
        // Also used to make sure no user likes the content more than once.
        mapping(address => bool) usersLiked;
        // This mapping contains all the users who've disliked this content.
        // Also used to make sure no user dislikes the content more than once.
        mapping(address => bool) usersDisliked;
        // The timestamp from the block when this content came into existence on the blockchain.
        uint256 timeStamp;
    }

    /*  CONSTRUCTOR  */
    /// The constructor for this smart contract
    /// Initializes the name, symbol and initial supply of the token.
    constructor(uint256 initialSupply) ERC20("Bitstone", "BIT") {
        _mint(msg.sender, initialSupply);
    }

    /**  FUNCTIONS **/

    /* Errors for _addContent function */
    /// `cid` is an invalid Ipfs-Cid.
    /// @param cid Ipfs-Cid entered.
    error InvalidCid(string cid);
    /// Empty cid entered.
    error EmptyCid();
    /// Content with Cid: `cid` already exist.
    /// @param cid Cid entered.
    error contentAlreadyExist(string cid);

    /* Events for _addContent function  */
    event NewContentAdded(string cid, address author, uint256 timeStamp);

    //  Add single content
    /// @dev Generate a new Content for the provided Ipfs-Cid
    /// and stores it.
    /// @notice Author can set/update metadata later as well via setMetadata() function.
    /// Pass empty string "" for no metadata.
    function _addContent(string memory _cid, string memory _metadataCid)
        public
    {
        //Make sure NON-EMPTY Cid is entered
        if (bytes(_cid).length <= 0) revert EmptyCid();
        //TODO Make sure Ipfs-Cid has the corrent format
        // if (_cid == incorrectFormat) revert InvalidCid(_cid);

        //make sure content doesnt already exist
        if (cidToAuthor[_cid] != address(0)) revert contentAlreadyExist(_cid);

        Content storage c = contentsMapping[_cid];
        c.cid = _cid;
        c.metadataCid = _metadataCid;
        c.author = payable(msg.sender);
        c.timeStamp = block.timestamp;

        cidsArray.push(_cid);
        uint256 newIndex = cidsArray.length - 1;
        cidToAuthor[_cid] = msg.sender;
        authorToCidIndices[msg.sender].push(newIndex);

        emit NewContentAdded(_cid, msg.sender, block.timestamp);
    }

    /* Errors for updateMetadata function */
    /// Only author `originalAuthor` can set the metadata.
    /// @param originalAuthor Content author.
    error contentAuthorRequired(address originalAuthor);

    /* Events for updateMetadata function */
    event MetadataUpdated(
        string contentCid,
        string updatedMetadataCid,
        address author
    );

    /// @notice Author can use it to set/update metadata for their Content.
    /// @param _cid IPFS-Cid of the Content.
    /// @param _metadataCid IPFS-Cid of the metadata.
    function updateMetadata(string memory _cid, string memory _metadataCid)
        public
    {
        address contentAuthor = cidToAuthor[_cid];
        if (contentAuthor != msg.sender)
            revert contentAuthorRequired(contentAuthor);
        Content storage c = contentsMapping[_cid];
        c.metadataCid = _metadataCid;
        emit MetadataUpdated(_cid, _metadataCid, contentAuthor);
    }

    /* Errors for like function */
    /// Already liked!
    error alreadyLiked();
   

    /* Events for like function */
    event ContentLiked(string cid, address liker);
    event TokenMinted(address author, string cid);


    function like(string memory _cid) public {
        Content storage c = contentsMapping[_cid];

        if (c.usersLiked[msg.sender] == true) revert alreadyLiked();

        if (c.usersDisliked[msg.sender] == true) {
            c.usersDisliked[msg.sender] == false;
            c.dislikes--;
        }

        c.usersLiked[msg.sender] = true;
        c.likes++;
        c.netlikes++;
        emit ContentLiked(_cid, msg.sender);


        //logic for rewarding ERC20 for every 100th netlike.
        //TODO check for exploit
        if (
            c.netlikes % REWARD_POINT == 0 &&
            uint256(c.netlikes / REWARD_POINT) == c.milestone + 1
        ) {
            //mint function to hit with every 100th netLike
            _mint(c.author, 1);
            c.milestone++;
            emit TokenMinted(c.author, _cid);
        }
    }

    /* Errors for dislike function */
    /// Already disliked!
    error alreadyDisliked(); 

     /* Events for dislike function */
    event ContentDisliked(string cid, address disliker);

    function dislike(string memory _cid) public {
        Content storage c = contentsMapping[_cid];

        if (c.usersDisliked[msg.sender] == true) revert alreadyDisliked();

        if (c.usersLiked[msg.sender] == true) {
            c.usersLiked[msg.sender] == false;
            c.likes--;
            c.netlikes--;
        }

        c.usersDisliked[msg.sender] = true;
        c.dislikes++;
        c.netlikes--;
        emit ContentDisliked(_cid, msg.sender);
     
    }

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

    /// Can be used to burn the tokens
    function burn(uint amount) public {       
        _burn(msg.sender, amount); 
    }
}
