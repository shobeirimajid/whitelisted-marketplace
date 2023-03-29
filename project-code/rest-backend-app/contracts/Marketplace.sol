// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

/* imports required for the contract */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/* contract is Marketplace inherits Ownable and ERC721 contracts */
contract Marketplace is Ownable, ERC721 {
    /* counters library is used for token id generator */
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    /* root hash of merkle tree of set of whitelisted addresses */
    bytes32 private root;
    /* url of ipfs gateway */
    string private baseUri;
    /* CID/IPFS Hash of each NFT media */
    mapping(uint256 => string) private cidOf;

    /* modifier to validate if a minter is whitelisted user */
    modifier onlyWhitelister(bytes32[] memory proof) {
        bool isVerified = verify(proof, msg.sender);
        require(isVerified, "Not whitelisted to mint");
        _;
    }

    /* merkle root, IPFS gateway url and others are set while deployment */
    constructor(
        bytes32 _root,
        string memory _name,
        string memory _symbol,
        string memory _baseUri
    ) ERC721(_name, _symbol) {
        root = _root;
        baseUri = _baseUri;
    }

    /**
     * @dev to verify if a user address is whitelisted or not
     * @param proof - hashes of leaf nodes of a merkle tree
     * @param addr - address of minter
     * @return isProved - if verified successfully
     */
    function verify(
        bytes32[] memory proof,
        address addr
    ) private view returns (bool isProved) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr))));
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
        return true;
    }

    /**
     * @dev for every adding & removing of whitelisted address,
     *      admin shall update root hash of merkle tree
     *      formed with updates whitelisted addresses
     */
    function updateRoot(bytes32 _root) public onlyOwner {
        require(root != _root, "No change in merkle tree");
        root = _root;
    }

    /**
     * @dev to update the IPFS Gateway URL
     * @return { string } - base URL of IPFS Gateway
     */
    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    /**
     * @dev to set each token's CID/IPFS Hash
     */
    function _setTokenUri(uint256 tokenId, string memory cid) private {
        cidOf[tokenId] = cid;
    }

    /**
     * @dev to get the full token URL of particular tokenid
     * @return { string } - total URL of NFT media
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        string memory baseURI = _baseURI();
        return string(abi.encodePacked(baseURI, cidOf[tokenId]));
    }

    /**
     * @dev to prove as whitelisted user,
     *      mint NFT,
     *      update IPFS Hash of NFT Media
     */
    function mintNFT(
        bytes32[] memory proof,
        string memory tokenCID
    ) public onlyWhitelister(proof) returns(uint256 id){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenUri(newItemId, tokenCID);
        return newItemId;
    }
}
