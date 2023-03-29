/**
 * @name    ethersUtils.js
 * @description - to export the required etherjs utils
 * @author  Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
const etherUtils = require('ethers').utils;

/**
 * @name getUTF8Bytes
 * @description - to convert string into utf-8 encoded bytes
 * @param { String } str
 * @returns { utf8Bytes }
 */
const getUTF8Bytes = function (str) {
  const utf8Bytes = etherUtils.toUtf8Bytes(str);
  if (utf8Bytes == null || utf8Bytes == undefined) return false;
  return utf8Bytes;
};

/**
 * @name getKeccack256Hash
 * @description - to get keccack256 hash of given bytes
 * @param { bytes } bytes
 * @returns { keccak256 }
 */
const getKeccack256Hash = function (bytes) {
  const keccackHash = etherUtils.keccak256(bytes);
  if (keccackHash == null || keccackHash == undefined || keccackHash == '')
    return false;
  return keccackHash;
};

/* export the functions */
module.exports = {
  getUTF8Bytes,
  getKeccack256Hash,
};
