/**
 * @name updateMarketplaceData.js
 * @description - to update the contents in marketplaceData.json
 *              - marketplaceData.json is a temporary storage
 *              - Note that for production we shouldn't store in marketplaceData.json
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required files and modules */
/* import fs module to read and write marketplaceData.json */
const fs = require('fs');

/**
 * @name getMarketplaceJson
 * @description - to get the marketplace json and parse it
 *              - marketplaceData.json consists of:
                    -> contractAddress
                    -> adminAddress
                    -> adminPrivateKey
                    -> rpcUrl
                    -> chainId
                    -> erc721CollectibleName
                    -> erc721CollectibleSymbol
                    -> ipfsGatewayUrl
 * @returns { Object } - returns the pased json of marketplaceData
 */
const getMarketplaceJson = function () {
  /* get the marketplaceData.json and parse it */
  const marketplaceData = JSON.parse(fs.readFileSync('marketplaceData.json'));
  /* return marketplaceData */
  return marketplaceData;
};

/**
 * @name setMarketplaceField
 * @description - to set one of the fields of marketplaceData.json
 *              - key and value is given so that updating marketplaceData.json becomes generic
 * @param { String } key - keys are fields of marketplaceData.json
 * @param { String } value - all values are stored in string form
 * @param { Object } obj - parsed json of marketplaceData.json
 */
const setMarketplaceField = function (key, value, obj) {
  /* update the value for a given key */
  obj[key] = value;
  /* stringify the json and update marketplaceData.json file */
  fs.writeFileSync('marketplaceData.json', JSON.stringify(obj));
};

/**
 * @name update
 * @description - to update value of any key in the marketplaceData.json
 * @param { String } key - keys are fields of marketplaceData.json
 * @param { String } value - all values are stored in string form
 * @returns { Boolean } `True` - if updation is success
 *                      `False`- if updation is failed
 */
const update = function (key, value) {
  const marketplaceData = getMarketplaceJson();
  const keys = Object.keys(marketplaceData);
  if (keys.includes(key)) {
    setMarketplaceField(key, value, marketplaceData);
    return true;
  }
  return false;
};

/**
 * @name setMarketplaceJson
 * @description - to set marketplace fields
 * @param { Array } keys - array of keys in marketplaceJson to be updated
 * @param { Array } values - array of values to be set for the respective keys
 * @returns { Boolean } - `True` if setting is success, else `False`
 */
const setMarketplaceJson = function (keys, values) {
  var isUpdated;
  for (let i = 0; i < keys.length; i++) {
    console.log('key is: ', keys[i]);
    console.log('value is: ', values[i]);
    isUpdated = update(keys[i], values[i]);
    if (!isUpdated) {
      return false;
    }
  }
  return true;
};

/* export the update function */
module.exports = {
  update,
  getMarketplaceJson,
  setMarketplaceJson,
};
