/**
 * @name query.js
 * @description - to query the contract by calling contract's view/pure functions
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import the contract artifacts module to use marketplace abi */
const contractArtifacts = require('../contractArtifacts');
/* import the utils to use get contract object function */
const utils = require('./utils');
/* import the rpc module to call query contract function */
const rpc = require('./rpc');

/**
 * @name queryContract
 * @description - to query the contract functions and get the return values
 * @param { Address } contractAddress - address of the contract
 * @param { String } rpcUrl - rpc url of the blockchain node
 * @param { String } functionName - name of the function
 * @param { Array } parameterValues - parameter values of function, in an array
 * @returns { any } result - return values returned by function
 */
const queryContract = async function (
  contractAddress,
  rpcUrl,
  functionName,
  parameterValues
) {
  /* get the contract abi */
  const abi = contractArtifacts.abi;

  /* get the contract object */
  const contractObj = utils.getContractObjByRpcUrl(
    abi,
    contractAddress,
    rpcUrl
  );

  /* get the contract function return values */
  const result = await rpc.queryContract(
    contractObj,
    functionName,
    parameterValues
  );
  /* return the result */
  return result;
};

/* export the query contract function */
module.exports = {
  queryContract,
};
