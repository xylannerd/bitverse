pragma solidity >=0.4.22 <0.9.0;


contract Bitverse {
 

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface Bitverse is ERC777, Ownable, AccessControl{
    
    function like(bytes32 _hash) external;
    function dislike(bytes32 _hash) external;
    function addContent(bytes32 _hash) external;
    function deleteContent(bytes32 _hash) external;
    
    function reportContent(bytes32 _hash) external;
    
}

contract Bitverse{
        
        
        
        
        Content[] public contents;
        
        // A mapping of Content Hashes to their respective Owners
        mapping(bytes32 => address) public contentHashToAuthor;
        
      
        //Contains all the indices of content uploaded by the author
        mapping(address => uint256[]) public authorToContentIndices;
        
        
        //A mapping of contentHash to contentIndex
        mapping(bytes32 => uint256) contentIndex;
        
        
        //
        //mapping(address => User) addressToUsers;
        
        // struct User{
        //     address _address;
        //     bytes32[] uploads;
        //     string[] tags;
        // }
        
        
        struct Content{
            bytes32 hash;
            string[] tags;
            address author;
            uint256 likes;
            uint256 dislikes;
            int256 netLikes;
            uint256 nonce;
            uint64 timeStamp;
        }
        
        
       constructor(uint256 initialSupply, address[] memory defaultOperators)
        ERC777("Bitstone", "BTS", defaultOperators)
    {
        _mint(msg.sender, initialSupply, "", "");
    }
        
        
    function addContent(bytes32[] memory _hash, string[][] memory _tags) public {
        
        for(uint256 i = 0; i < _hash.length; i++ ){
            
            if(contentHashToAuthor[_hash[i]] == 0) {
                
                Content memory _content = new Content({
                    hash: _hash[i],
                    tags: _tags[i][],
                    author: msg.sender
                    like: 0,
                    dislikes: 0,
                    netLikes: 0,
                    nonce: 0,
                    mapping(address => bool) usersLiked;
                    mapping(address => bool) usersDisliked;
                    timeStamp: uint64(now)
                });
                
                uint256 contentIndex = contents.push(_content) - 1;
                authorToContentIndices[msg.sender].push(contentIndex);
                contentHashToAuthor[_hash[i]] = msg.sender;
                contentIndices[_hash[i]] = contentIndex;
            
            } else {
                revert("Content already Exist!")
            }
            
        }
    
        
    }
    
    
    function like(bytes32 _hash) public {
            uint256 cId = contentIndex[_hash];
            Content storage c = contents[cId];
            if(c.usersLiked[msg.sender] != true){
                c.usersLiked[msg.sender] = true;
                if(c.usersDisliked[msg.sender] == true){
                    c.usersDisliked[msg.sender] == false;
                    c.dislikes--;
                }
                c.likes++;
                //logic for rewarding ERC777 for every 100th like. 
                //todo
                if(c.likes == 100){
                     _mint(c.author, 1, "", "");
                }
                
            } else {
                revert("Already liked!")
            }
            
    }
    
    function dislike(bytes32 _hash) public {
            uint256 cId = contentIndex[_hash];
            Content storage c = contents[cId];
            if(c.usersDisliked[msg.sender] != true){
                c.usersDisliked[msg.sender] = true;
                if(c.usersLiked == true){
                    c.usersLiked == false;
                    c.likes--;
                }
                c.dislikes++;
            } else {
                revert("Already disliked!")
            }
            
    }
    
    
    
}
 
 
}
