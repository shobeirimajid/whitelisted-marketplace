/**
 * @name    ethjsUtils.js
 * @description - export functions helpful for create, sign and broadcast transaction
 * @author  Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import common to construct transaction object for evm blockchains based on chain Id */
const Common = require('@ethereumjs/common').default;
/* import web3Utils modules to work on web3 functions */
const web3utils = require('./web3Utils');
/* import ethereumjs-tx module to construct transaction */
const ethjsTx = require('ethereumjs-tx');
const Transaction = require('@ethereumjs/tx').Transaction;

/**
 * @name getTransactionObject
 * @description - to get the transaction object of transaction types deploy/invoke
 * @param { String } transactionType - {"invoke", "deploy"}
 * @param { Address } contractAddress - address of the contract if transaction type is invoke
 * @param { Hexstring } gas - gas incurred to execute the transaction
 * @param { Hexstring } gasPrice - gas price in the network we are using
 * @param { Hexstirng } encodedData - invoke: encodedAbi of function and its inputs,
 *                                  - deploy: bytecode of contract
 * @param { Hexstring } nonce - nonce of the user who is executing the transaction
 * @param { Hexstring } value - amount of wei to be passed in transaction
 * @param { Number } chainID - chain id of the network that the transaction executes
 * @returns { Object } transactionObject & unsignedTransaction
 */
const getTransactionObject = function (
  transactionType,
  contractAddress,
  gas,
  gasPrice,
  encodedData,
  nonce,
  value,
  chainID
) {
  /* generate necessary primaries */
  const customCommon = Common.custom({ chainId: chainID });
  const chainId = web3utils.toHex(chainID);

  /* construct initial transaction object */
  var transactionObject;
  if (transactionType == 'deploy') {
    /* transaction object exclusively for deploy operation */
    transactionObject = new ethjsTx.Transaction(
      {
        gas: gas,
        data: encodedData,
        gasPrice: gasPrice,
        nonce: nonce,
        value: value,
        chainId: chainId,
      },
      {
        common: customCommon,
      }
    );
  } else if (transactionType == 'invoke') {
    transactionObject = new ethjsTx.Transaction(
      {
        to: contractAddress,
        gas: gas,
        data: encodedData,
        gasPrice: gasPrice,
        nonce: nonce,
        value: value,
        chainId: chainId,
      },
      {
        common: customCommon,
      }
    );
  }
  /* re-arrange transaction object */
  transactionObject = transactionObject.toJSON([
    'nonce',
    'gasPrice',
    'gasLimit',
    'to',
    'value',
    'data',
  ]);
  let { r, s, v, ...txnObject } = transactionObject;
  const txObj = Transaction.fromTxData(transactionObject, customCommon);

  /* convert transaction object to bytes array */
  var unsignedTx = txObj.getMessageToSign(true);
  /* convert transaction object from bytes array to hex string */
  unsignedTx = Buffer.from(unsignedTx).toString('hex');

  /* return the transaction object */
  return {
    transactionObject: txnObject,
    unsignedTransaction: unsignedTx,
  };
};

/**
 * @name getSignatureFields
 * @description - to sign a transaction with private key and retrieve signature fields
 *                NOTE: it is unsafe to use this function for production
 * @param { Object } txObj - transaction object without signed signature fields
 * @param { Number } chainID - chain id of the network that the transaction executes
 * @param { Hexstring } privateKey - private key of user who wants to sign the transaction
 * @returns { Object } signature & signedTransactionBytes
 */
const getSignatureFields = function (txObj, chainID, privateKey) {
  /* generate necessary primaries */
  const customCommon = Common.custom({ chainId: chainID });
  txObj = new ethjsTx.Transaction(txObj, { common: customCommon });
  /* get signed transaction */
  const signedTx = txObj.sign(Buffer.from(privateKey, 'hex'));
  /* build a signature object with r,s and v signatures in hexstring */
  var signature = {};
  signature.r = txObj.r.toString('hex');
  signature.s = txObj.s.toString('hex');
  signature.v = txObj.v.toString('hex');
  /* generate signed transaction which is used to broadcast */
  const signedTxBytes = '0x' + txObj.serialize().toString('hex');
  /* return the signature object and broadcastable transaction */
  return {
    signature: signature,
    signedTxBytes: signedTxBytes,
  };
};

/**
 * @name getSignaturedTransaction
 * @description - to get the transaction object by infiltrating signed signature fields r,s and v
 *              - note that this will be useful if signing is done through external methods
 * @param { Object } txObj - transaction object without signed signature fields
 * @param { Object } signature - object consisting signed signature fields like r,s and v
 * @param { Number } chainID - chain id of the network that the transaction executes
 * @returns { Object } - transaction object consisting the signed signature fields
 */
const getSignaturedTransaction = function (txObj, signature, chainID) {
  /* generate necessary primaries */
  const customCommon = Common.custom({ chainId: chainID });
  const txnObj = new ethjsTx.Transaction(txObj, { common: customCommon });

  /* infiltrate signature fields into transaction object */
  txnObj.r = Buffer.from(signature.r, 'hex');
  txnObj.s = Buffer.from(signature.s, 'hex');
  txnObj.v = Buffer.from(signature.v, 'hex');

  /* return the transaction object with signed signature fields */
  return txnObj;
};

/* export the functions */
module.exports = {
  getTransactionObject,
  getSignatureFields,
  getSignaturedTransaction,
};
