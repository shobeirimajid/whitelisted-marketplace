/**
 * @name    contractArtifacts.js
 * @description - this module is used to retrieve contract abi and bin and export
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the modules required */
const path = require('path');
const fs = require('fs');

/* Marketplace contract artifacts */
/* Marketplace contract ABI */
const marketplaceAbiPath = path.resolve(
  __dirname,
  './contracts/build',
  'Marketplace_flattenned_sol_Marketplace.abi'
);
const marketplaceAbiSource = fs.readFileSync(marketplaceAbiPath, 'UTF-8');

/* Marketplace Bytecode */
const marketplaceBytecodePath = path.resolve(
  __dirname,
  './contracts/build',
  'Marketplace_flattenned_sol_Marketplace.bin'
);
const marketplaceBytecodeSource = fs.readFileSync(
  marketplaceBytecodePath,
  'UTF-8'
);

/* export Marketplace contract abi and bin */
module.exports = {
  marketplaceAbi: marketplaceAbiSource,
  marketplaceBytecode: marketplaceBytecodeSource,
};
