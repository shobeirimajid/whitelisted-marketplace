/**
 * @name invoke.js
 * @description - to invoke the functions of the marketplace contract
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import web3Utils to use web3 functions */
const web3utils = require('./web3Utils');
/* import the utils module to call create transaction object function */
const utils = require('./utils');
/* import ethjsUtils to use signature oeprations */
const ethjsUtils = require('./ethjsUtils');
/* import rpc module to call functions which communicates blockchain node */
const client = require('./rpc');

/**
 * @name invokeContract
 * @description - to invoke the contract function
 * @param { Address } senderAddress - address of the deployer who is deploying the contract
 * @param { HexString } senderPrivateKey - private key of the sender
 * @param { String } valueInEth - value of ether in eth denomination
 * @param { String } rpcUrl - rpc url of the blockchain node
 * @param { Number } chainId - chain id of the blockchain network
 * @param { Address } contractAddress - address of the contract
 * @param { Object } contractAbi - abi of the contract we are deploying
 * @param { String } functionName - the name of the function to be executed
 * @param { Array } inputParams - constructor input parameters are given in an array
 * @returns { Object } - transaction receipt of the deployment transaction
 */
const invokeContract = async function (
  senderAddress,
  senderPrivateKey,
  valueInEth,
  rpcUrl,
  chainId,
  contractAddress,
  contractAbi,
  functionName,
  inputParams
) {
  /* convert value from eth to wei */
  const valueInWei = web3utils.toWei(valueInEth);

  /* get the transaction object */
  var txnObject = await utils.createInvokeTransactionObject(
    contractAddress,
    contractAbi,
    functionName,
    senderAddress,
    valueInWei,
    inputParams,
    rpcUrl,
    chainId
  );

  /* sign the transaction object and get the signed bytes */
  const signedObject = ethjsUtils.getSignatureFields(
    txnObject.transactionObject,
    chainId,
    senderPrivateKey
  );

  /* get transaction object with signatures embedded */
  const signaturedObject = ethjsUtils.getSignaturedTransaction(
    txnObject.transactionObject,
    signedObject.signature,
    chainId
  );

  /* serialize the signatured object */
  const signedBytes = '0x' + signaturedObject.serialize().toString('hex');

  /* broadcast the transaction */
  const txHash = await client.sendSignedTransaction(signedBytes, rpcUrl);

  /* get the transaction receipt of the transaction */
  const receipt = await client.getTransactionReceipt(txHash, rpcUrl);
  /* return the receipt */
  return receipt;
};

/* export the function */
module.exports = {
  invokeContract,
};
