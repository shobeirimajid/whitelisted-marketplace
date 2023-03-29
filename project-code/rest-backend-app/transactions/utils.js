/**
 * @name utils.js
 * @description - to accumulate all utils required in the project
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import web3Utils to use web3 functions */
const web3utils = require('./web3Utils');
/* import the rpc module to communicate with blockchain node */
const client = require('./rpc');
/* import ethjsUtils to get transaction object and signatures */
const ethjsUtils = require('./ethjsUtils');

/**
 * @name getContractObjByAbi
 * @description - to get contract object with abi
 * @param { Object } abi
 * @returns {Object }
 */
const getContractObjByAbi = function (abi) {
  /* get web3 object */
  const web3 = web3utils.getWeb3('');
  /* parse abi */
  abi = JSON.parse(abi);
  /* get contract instance */
  contractObject = new web3.eth.Contract(abi);
  /* return the contract object */
  return contractObject;
};

/**
 * @name getContractObjByAddr
 * @description - to get contract object by passing abi and contract address
 * @param { Object } abi - abi of the contract
 * @param { Address } address - address of the marketplace contract
 * @returns {Object } contractObj - the web3 contract object of marketplace
 */
const getContractObjByAddr = function (abi, address) {
  /* get web3 object */
  const web3 = web3utils.getWeb3('');
  /* parse abi and get the contract object by passing contract address */
  abi = JSON.parse(abi);
  contractObj = new web3.eth.Contract(abi, address);
  /* return the contract object */
  return contractObj;
};

/**
 * @name getContractObjByRpcUrl
 * @description - to get contract object by rpcUrl, abi & contract address
 * @param { Object } abi - abi of the marketplace contract
 * @param { Address } contractAddress - address of the marketplace contract
 * @param { String } rpcUrl - rpc url of the blockchain node
 * @returns { Object } contractObj - web3 contract object
 */
const getContractObjByRpcUrl = function (abi, contractAddress, rpcUrl) {
  /* get web3 object */
  const web3 = web3utils.getWeb3(rpcUrl);
  /* parse abi and get the contract object by passing contract address */
  abi = JSON.parse(abi);
  contractObj = new web3.eth.Contract(abi, contractAddress);
  /* return the contract object */
  return contractObj;
};

/**
 * @name createDeployTransactionObject
 * @description - to create transaction object for deploying the contract
 * @param { Object } abi - abi of the contract
 * @param { Hexstring } bytecode - bytecode of the contract
 * @param { Address } senderAddress - address of the contract deployer/admin
 * @param { String } valueInWei - value of ether in wei denomination
 * @param { Array } inputParams - input parameters of a contract if constructor
 * @param { String } rpcUrl - rpc url of the blockchain network
 * @param { Number } chainId - chain id of the blockchain network
 * @returns { Object } transactionObject
 */
const createDeployTransactionObject = async function (
  abi,
  bytecode,
  senderAddress,
  valueInWei,
  inputParams,
  rpcUrl,
  chainId
) {
  /* get the contract object with abi */
  const contractObject = getContractObjByAbi(abi);

  /* get the encoded bytecode with contract bin and input params */
  const encodedBytecode = await contractObject
    .deploy({
      data: bytecode,
      arguments: inputParams,
    })
    .encodeABI();

  /* get the nonce of the account deploying contract */
  var nonce = await client.getTransactionCount(senderAddress, rpcUrl);
  /* convert nonce to hexadecimal value */
  nonce = web3utils.toHex(nonce);

  /* estiate the gas to deploy contract */
  var gas = await client.estimateDeployGas(encodedBytecode, rpcUrl);
  /* convert gas to hexadecimal value */
  gas = web3utils.toHex(gas);

  /* get the gas price */
  var gasPrice = await client.getGasPrice(rpcUrl);
  /* convert gasPrice to hexadecimal value */
  gasPrice = web3utils.toHex(gasPrice);

  /* convert the value in wei to hexadecimal value */
  valueInWei = web3utils.toHex(valueInWei);

  /* get the transaction object */
  const transactionObject = ethjsUtils.getTransactionObject(
    'deploy',
    '0x',
    gas,
    gasPrice,
    encodedBytecode,
    nonce,
    valueInWei,
    chainId
  );

  /* return the transaction object */
  return transactionObject;
};

const createInvokeTransactionObject = async function (
  contractAddress,
  abi,
  functionName,
  senderAddress,
  valueInWei,
  inputParams,
  rpcUrl,
  chainId
) {
  /* get the contract object by passing abi and contract address */
  const contractObject = getContractObjByAddr(abi, contractAddress);
  /* get the encoded bytecode of contract function embedded with function parameter values */
  const encodedBytecode = contractObject.methods[functionName](
    ...inputParams
  ).encodeABI();

  /* get the nonce of the account deploying contract */
  var nonce = await client.getTransactionCount(senderAddress, rpcUrl);
  /* convert nonce to hexadecimal value */
  nonce = web3utils.toHex(nonce);

  /* gas required to invoke the contract function */
  var gas = client.estimateInvokeGas(
    senderAddress,
    encodedBytecode,
    contractAddress,
    rpcUrl
  );
  /* convert gas to hexadecimal value */
  gas = web3utils.toHex(gas);
  /* get the gas price */
  var gasPrice = await client.getGasPrice(rpcUrl);
  /* convert gasPrice to hexadecimal value */
  gasPrice = web3utils.toHex(gasPrice);

  /* convert the value in wei to hexadecimal value */
  valueInWei = web3utils.toHex(valueInWei);

  /* get the transaction object */
  const transactionObject = ethjsUtils.getTransactionObject(
    'invoke',
    contractAddress,
    gas,
    gasPrice,
    encodedBytecode,
    nonce,
    valueInWei,
    chainId
  );

  /* return the transaction object */
  return transactionObject;
};

/* export the functions */
module.exports = {
  createDeployTransactionObject,
  createInvokeTransactionObject,
  getContractObjByRpcUrl,
};
