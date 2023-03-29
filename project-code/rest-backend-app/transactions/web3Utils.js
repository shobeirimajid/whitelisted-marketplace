/**
 * @name    web3Utils.js
 * @description - all web3 utils used in the project is collected here
 * @author  Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import web3 package */
const Web3 = require('web3');

/**
 * @name getWeb3
 * @description - to get web3 object
 * @param { String } rpcUrl
 * @returns { Object }
 */
const getWeb3 = function (rpcUrl) {
  var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  return web3;
};

/**
 * @name toHex
 * @description - to convert a decimal number to hexadecimal number
 * @param { Number } n
 * @returns { HexString }
 */
const toHex = function (n) {
  const web3 = getWeb3('');
  n = web3.utils.toHex(n);
  return n;
};

/**
 * @name    toWei
 * @dev     To convert from ether to wei
 * @param   { Float } amountInEther
 * @returns { BigNumber }
 */
const toWei = function (valueInEth) {
  const web3 = getWeb3('');
  const amount = web3.utils.toWei(valueInEth);
  return amount;
};

/* export all the web3 fuctions */
module.exports = {
  getWeb3,
  toHex,
  toWei,
};
