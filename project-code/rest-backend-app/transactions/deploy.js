/**
 * @name deploy.js
 * @description - to deploy a contract
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import web3Utils to use web3 functions */
const web3utils = require('./web3Utils');
/* import utils to use required utility functions */
const utils = require('./utils');
/* import ethjsUtils to use signature oeprations */
const ethjsUtils = require('./ethjsUtils');
/* import rpc module to call functions which communicates blockchain node */
const client = require('./rpc');
/* import this module to update important marketplace data in json */
const marketplaceData = require('../marketplaceData');

/**
 * @name deployContract
 * @description - to deploy the contract
 * @param { Address } senderAddress - address of the deployer who is deploying the contract
 * @param { HexString } senderPrivateKey - private key of the sender
 * @param { String } valueInEth - value of ether in eth denomination
 * @param { String } rpcUrl - rpc url of the blockchain node
 * @param { Number } chainId - chain id of the blockchain network
 * @param { Object } contractAbi - abi of the contract we are deploying
 * @param { HexString } contractBytecode - bytecode of the contract we are deploying
 * @param { Array } inputParams - constructor input parameters are given in an array
 * @returns { Object } - transaction receipt of the deployment transaction
 */
const deployContract = async function (
  senderAddress,
  senderPrivateKey,
  valueInEth,
  rpcUrl,
  chainId,
  contractAbi,
  contractBytecode,
  inputParams
) {
  /* get the marketplace json */
  var mpJson = marketplaceData.getMarketplaceJson();
  var receipt;
  if (!mpJson.isUpdated) {
    /* convert value from eth to wei */
    const valueInWei = web3utils.toWei(valueInEth);

    /* create a transaction object to deploy the contract */
    var txnObject = await utils.createDeployTransactionObject(
      contractAbi,
      contractBytecode,
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
    receipt = await client.getTransactionReceipt(txHash, rpcUrl);

    /* update the contractAddress in marketplaceData.json */
    var isUpdated = marketplaceData.update(
      'contractAddress',
      receipt.contractAddress
    );
    /* update the commit status in marketplace json */
    if (isUpdated) {
      isUpdated = marketplaceData.update('isUpdated', true);
    }
    /* update the transaction hash in marketplace json */
    if (isUpdated) {
      isUpdated = marketplaceData.update('transactionHash', txHash);
    }
    /* push the updation status in receipt */
    receipt['isContractUpdatedLocally'] = isUpdated;
    /* return the transaction receipt after deployment */
    // return receipt;
  } else {
    /* get the transaction receipt of the transaction */
    receipt = await client.getTransactionReceipt(
      mpJson.transactionHash,
      rpcUrl
    );
  }
  /* get the updated marketplace json */
  mpJson = marketplaceData.getMarketplaceJson();
  /* build the response and return */
  const resObj = {
    receipt: receipt,
    marketplaceData: mpJson,
  };
  return resObj;
};

/* export the deployContract function */
module.exports = {
  deployContract,
};
