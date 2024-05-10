// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/interfaces/IERC2981.sol";  // For royalties
// import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155Token is ERC1155 {
    uint numTokens = 0;
    uint256 public constant MAX_SUPPLY = 1000;
    address contractOwner;
    string METADATA_LOCATION = "";
    bytes32 BLANK;
    // string COMMA = Strings.toString(",");
    // string LBRACKET = Strings.toStinrg("{");
    // string RBRACKET = Strings.toString("}");

    mapping(uint256 => uint256) public tokenPrice;
    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => uint256) public tokensSold;
    mapping(uint256 => address) public tokenMinter;
    mapping(uint256 => string) public name;
    mapping(uint256 => string) public desc;
    mapping(uint256 => string) public imgURL;

    constructor(string memory _uri) ERC1155(_uri) {
        METADATA_LOCATION = _uri;
        contractOwner = msg.sender;
        BLANK = keccak256(abi.encodePacked(""));
    }

    function mint(
        uint256 _amount,
        uint256 _price,
        string memory _name,
        string memory _desc,
        string memory _imgURL
    ) public returns (uint tokenId) {
        require(_amount > 0, "Mint quantity must be > 0");
        require(_amount <= MAX_SUPPLY, "Exceeds maximum token count allowed");
        require(_price >= 0, "Price must be >= 0");
        require(
            keccak256(abi.encodePacked(_name)) != BLANK,
            "Token MUST have a name"
        );
        require(
            keccak256(abi.encodePacked(_desc)) != BLANK,
            "Token MUST have a description"
        );

        _mint(msg.sender, numTokens, _amount, ""); //numTokens is the current id #
        tokenPrice[numTokens] = _price;
        tokenSupply[numTokens] = _amount;
        tokensSold[numTokens] = 0;
        tokenMinter[numTokens] = msg.sender;
        name[numTokens] = _name;
        desc[numTokens] = _desc;
        imgURL[numTokens] = _imgURL;
        return numTokens++;
    }

    function getMetadata(uint _tokenId) public view returns (string memory) {
        return
            string.concat(
                "{",
                Strings.toString(_tokenId),
                "|",
                Strings.toString(tokenPrice[_tokenId]),
                "|",
                Strings.toString(tokenSupply[_tokenId]),
                "|",
                Strings.toString(tokensSold[_tokenId]),
                "|",
                name[_tokenId],
                "|",
                desc[_tokenId],
                "|",
                imgURL[_tokenId],
                "}"
            );
    }

    function getAllMetadata() public view returns (string memory) {
        string memory tokenList = "";
        for (uint index = 0; index < numTokens; index++) {
            if (index == 0) {
                tokenList = getMetadata(index);
            } else {
                tokenList = string(
                    abi.encodePacked(tokenList, ", ", getMetadata(index))
                );
            }
        }
        tokenList = string(abi.encodePacked("[", tokenList, "]"));
        return tokenList;
    }

    function getTokenCount() public view returns (uint) {
        return numTokens;
    }

    function setMetadataLocation(string memory _location) public {
        require(
            msg.sender == contractOwner,
            "Only contract owner may set/change metadata location"
        );
        METADATA_LOCATION = _location;
    }

    function getMetadataLocation() public view returns (string memory) {
        return METADATA_LOCATION;
    }

    function buyToken(uint256 _tokenId, uint256 _amount) external payable {
        require(
            msg.value >= tokenPrice[_tokenId] * _amount,
            string.concat(
                "Ether sent is not correct:",
                Strings.toString(msg.value)
            )
        );
        require(
            _amount <= tokenSupply[_tokenId] - tokensSold[_tokenId],
            "Can't buy that many"
        );
        _safeTransferFrom(
            tokenMinter[_tokenId],
            msg.sender,
            _tokenId,
            _amount,
            ""
        );
        tokensSold[_tokenId] = tokensSold[_tokenId] + _amount;
        payable(tokenMinter[_tokenId]).transfer(msg.value);
    }
}
