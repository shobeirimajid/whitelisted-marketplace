/**
 * @name merkle.js
 * @description - module developed to deal with merkle trees
 * @author - Vijay Sugali
 * @version - 1.0.0
 */

/* imports required for this module */
const StandardMerkleTree =
  require('@openzeppelin/merkle-tree').StandardMerkleTree;
const fs = require('fs');
/* import the marketplaceData module to update merkleRoot in marketplaceData.json */
const marketplaceData = require('./marketplaceData');

/**
 * @name buildTree
 * @description - to build a merkle tree for whitelisted addresses
 * @returns { Object, Boolean } - object with merkleRoot value if success, else false
 */
const buildTree = function (addresses) {
  try {
    /* list of addresses */
    const leaves = addresses.map((address) => [address]);
    /* constructing a tree with list of addresses */
    const tree = StandardMerkleTree.of(leaves, ['address']);
    // console.log("tree: ", tree)
    console.log('Merkle Root:', tree.root);
    /* writing a constructed tree to a file */
    fs.writeFileSync('tree.json', JSON.stringify(tree.dump()));
    /* form the return object */
    const result = {
      merkleRoot: tree.root,
    };
    return result;
  } catch (error) {
    return false;
  }
};

/**
 * @name obtainProof
 * @description - To obtain proof that a address is present in merkle tree
 * @param { Address } userAddress - address to obtain proof
 * @returns { Object, Boolean } - Object with value and proof if success, else false
 */
 const obtainProof = function (userAddress) {
  var value, proof;
  const startTime = Date.now();
  /* parse the constructed merkle tree */
  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync('tree.json'))
  );
  /* loop through tree elements */
  for (const [i, v] of tree.entries()) {
    /* compare with user address */
    if (v[0] === userAddress) {
      flag = true;
      /* get proof of matched element */
      proof = tree.getProof(i);
      value = v;
      console.log('Value:', v);
      console.log('Proof:', proof);
      const endTime = Date.now();
      console.log(`Function execution time: ${endTime - startTime}ms`);
      return {
        value: value,
        proof: proof,
      };
    }
  }
  const endTime = Date.now();
  console.log(`Function execution time: ${endTime - startTime}ms`);
  return false;
};


/**
 * @name verifyProofOffchain
 * @description - To verify the proof submitted by user offchain
 * @param { Address } userAddress - address of user
 * @param { Array } proof - array of proof received from `obtainProof`
 * @returns { Boolean } - True if whitelisted address is in merkle tree, else False
 */
const verifyProofOffchain = function (userAddress, proof) {
  /* parse the constructed merkle tree */
  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync('tree.json'))
  );
  /* verify the proof with respect to value of user */
  const hasVerified = tree.verify([userAddress], proof);
  console.log('Is given address whitelisted: ', hasVerified);
  return hasVerified;
};

/**
 * @name whitelistAddress
 * @description - To add a user into whitelisted addresses list and update the merkle root
 * @param { Address } userAddress - address of user to whitelist
 * @returns { Object, Boolean } - object with merkleRoot value if success, else False
 */
const whitelistAddress = function (userAddress) {
  /* get the whitelisted addresses */
  const addresses = JSON.parse(
    fs.readFileSync('whitelistAddresses.json')
  ).addresses;
  /* check if user address is already whitelisted */
  if (!addresses.includes(userAddress)) {
    /* append new address into whitelist */
    addresses.push(userAddress);
    /* call build tree to revise merkle tree */
    const merkleRoot = buildTree(addresses);
    /* writing a revised tree to the whitelisted addresses file */
    fs.writeFileSync(
      'whitelistAddresses.json',
      JSON.stringify({
        addresses: addresses,
      })
    );
    return merkleRoot;
  }
  console.log('User address is already whitelisted!');
  return false;
};

/**
 * @name getWhitelistedAddresses
 * @description - to get all the whitelisted addresses
 * @returns { Array } - array of whitelisted addresses
 */
const getWhitelistedAddresses = function () {
  /* get the whitelisted addresses */
  const addresses = JSON.parse(
    fs.readFileSync('whitelistAddresses.json')
  ).addresses;
  return addresses;
};

/**
 * @name removeWhitelisted
 * @description - To remove a whitelisted address
 * @param { Address } userAddress - address of user to remove from whitelist
 * @returns { Object, Boolean } - object with merkleRoot if success, else False
 */
const removeWhitelisted = function (userAddress) {
  /* get the whitelisted addresses */
  const addresses = JSON.parse(
    fs.readFileSync('whitelistAddresses.json')
  ).addresses;
  /* check if user is already not whitelisted */
  if (addresses.includes(userAddress)) {
    const userIndex = addresses.indexOf(userAddress);
    const isDeleted = addresses.splice(userIndex, 1);
    if (isDeleted) {
      console.log('Address is deleted from whitelisted addresses');
    } else {
      return false;
    }
    /* call build tree to revise merkle tree */
    const merkleRoot = buildTree(addresses);
    /* writing a revised tree to the whitelisted addresses file */
    fs.writeFileSync(
      'whitelistAddresses.json',
      JSON.stringify({
        addresses: addresses,
      })
    );
    return merkleRoot;
  }
  console.log('User address is already not whitelisted!');
  return false;
};

/**
 * @name startMerkleTree
 * @description - To initially build the merkle tree with existing whitelisted addresses
 * @returns { Object, Boolean } - Object with merkle tree if success, else False
 */
const startMerkleTree = function () {
  /* get the whitelisted addresses from json file */
  const addresses = JSON.parse(
    fs.readFileSync('whitelistAddresses.json')
  ).addresses;
  /* call build tree */
  const merkleTree = buildTree(addresses);
  /* update the merkle tree in marketplaceJson */
  const isUpdated = marketplaceData.update('merkleRoot', getMerkleTree());
  return merkleTree;
};

/**
 * @name getMerkleTree
 * @description - to get merkle tree root
 * @returns { HexString } - root of merkle tree
 */
const getMerkleTree = function () {
  /* parse the constructed merkle tree */
  const tree = StandardMerkleTree.load(
    JSON.parse(fs.readFileSync('tree.json'))
  );
  return tree.root;
};

//  obtainProof("0x0d7491E2FdE55F0a704B7D608d79e3FbC0A63Dd6");
// start();
// whitelistAddress("0xdD870fA1b7C4700F2BD7f44238821C26f7392148");

// verifyProofOffchain(
//   "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
//   ["0x56ecd115e05f5d59bffff5276372fa75c135196895bf292b424816f5bb398160","0x87be5ae2caf5c195a7c4104556411dfefa61ceeef71a9a9e7720ed8998e5c235","0xc629f9ea4229363719b9e221c8b5c513ca3daa40dca707d1e1dd3401d9b29d88","0xbb6ba6ac25dc0c03e1f5019be720bdb00b5bc34ac06bed8ebfa8dd2e7ae93d8a","0x6099590120b23f9cffd8f5c4383c60e3e97a0f23933642fca73d82b6a43df86f","0x35f57f357c814c19b43a665f773006af255302a8e0fc3ee60e7bbac29651f61c","0x048de88f0de28239c74a601be622f16c19749e55a4bf1bdbc37fff3ac5639953"]
// )

// removeWhitelisted("0x0d7491E2FdE55F0a704B7D608d79e3FbC0A63Dd6")

/* exports the necessary functions for merkle tree operations */
module.exports = {
  startMerkleTree,
  obtainProof,
  verifyProofOffchain,
  whitelistAddress,
  removeWhitelisted,
  getMerkleTree,
  getWhitelistedAddresses,
};
