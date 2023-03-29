/**
 * @name rpc.js
 * @description - to develop functions which require rpc calls to blockchain node
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import web3Utils to use web3 functions */
const web3utils = require('./web3Utils');

/**
 * @name    getTransactionCount
 * @dev     To get the nonce of the user account on the given network
 * @param   { String } address
 * @param   { String } rpcUrl
 * @returns { Number } nonce of the user account
 */
const getTransactionCount = async function (address, rpcUrl) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get nonce */
  var nonce = await web3.eth.getTransactionCount(address);
  /* return nonce */
  return nonce;
};

/**
 * @name estimateDeployGas
 * @description - to estimate the gas for deploying the contract
 * @param { HexString } bytecode
 * @param { String } rpcUrl
 * @returns { Number } estimatedGas
 */
const estimateDeployGas = async function (encodedBytecode, rpcUrl) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get the estimated gas */
  var estimatedGas = await web3.eth.estimateGas({
    data: encodedBytecode,
  });

  // Pad to the gas by 15%
  estimatedGas = parseInt(estimatedGas + (estimatedGas * 15) / 100);
  /* return the final gas */
  return estimatedGas;
};

/**
 * @name estimateInvokeGas
 * @description - to estimate the gas for invoking a contract function
 * @param { Address } senderAddress - address of the user who is invoking the contract function
 * @param { HexString } encodedBytecode - contract function embedded with parameter values are encoded into it
 * @param { Address } contractAddress - the address of the marketplace contract
 * @param { String } rpcUrl - rpc url of the blockchain node
 * @returns { Number } estimatedGas - the gas padded 15% for free flow of transaction
 */
const estimateInvokeGas = async function (
  senderAddress,
  encodedBytecode,
  contractAddress,
  rpcUrl
) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get the estimated gas to invoke the contract function */
  var estimatedGas = await web3.eth.estimateGas({
    from: senderAddress,
    data: encodedBytecode,
    to: contractAddress,
  });
  // Pad to the gas by 15%
  estimatedGas = parseInt(estimatedGas + (estimatedGas * 15) / 100);
  /* return the final gas */
  return estimatedGas;
};

/**
 * @name    getGasPrice
 * @dev     To get the gas price in the network
 * @param   { String } rpcUrl
 * @returns { Number } If getting gas price is success
 */
const getGasPrice = async function (rpcUrl) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get the gas price from the network */
  const gasPrice = await web3.eth.getGasPrice();
  /* return the gas price */
  return gasPrice;
};

/**
 * @name sendSignedTransaction
 * @description - to broadcast the signed bytes
 * @param { HexString } bytes
 * @param { String } rpcUrl
 * @returns { HexString } - transaction hash of the transaction
 */
const sendSignedTransaction = async function (bytes, rpcUrl) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get the transaction hash after broadcasting */
  const txHash = await new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(bytes, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  /* return the transaction hash */
  return txHash;
};

/**
 * @name queryContract
 * @description - to query the contract function
 * @param { Object } contractObj - web3 contract object instance taken by rpcUrl, contract address & abi
 * @param { String } functionName - name of the contract function
 * @param { Array } inputParams - function parameter values in an array
 * @returns { any } result - return values returned by particular function
 */
const queryContract = async function (contractObj, functionName, inputParams) {
  /* query the contract and store the result*/
  const result = await contractObj.methods[functionName](...inputParams).call();
  /* return the result */
  return result;
};

/**
 * @name getTransactionReceipt
 * @description - to get the receipt of transaction
 * @param { HexString } hash - hash of the transaction
 * @param { String } rpcUrl - rpc url of the blockchain network
 * @returns { Object } receipt
 */
const getTransactionReceipt = async function (hash, rpcUrl) {
  /* get the web3 instance */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* get the transaction receipt */
  var receipt = await web3.eth.getTransactionReceipt(hash);
  /* get the block number */
  const blockNumber = await web3.eth.getBlockNumber();
  /* re-structure the receipt */
  receipt = {
    blockHash: receipt.blockHash, // hash of the block transaction resided in
    blockNumber: receipt.blockNumber, // block number of the block transaction resided in
    senderAddress: receipt.from, // address of the user executed the transaction
    receiverAddress: receipt.to, // either contract address or receiver address of the transaction
    contractAddress: receipt.contractAddress, // address of the contract
    transactionHash: receipt.transactionHash, // hash of the transaction
    gasUsed: receipt.gasUsed, // gas used to execute the transaction
    confirmations: blockNumber - receipt.blockNumber, // no of confirmations received to the transaction
  };
  /* return the receipt */
  return receipt;
};

/* export the functions */
module.exports = {
  getTransactionCount,
  estimateDeployGas,
  getGasPrice,
  sendSignedTransaction,
  getTransactionReceipt,
  estimateInvokeGas,
  queryContract,
};
