/**
 * @name index.js
 * @description - To expose Restful APIs for merkle and database operations
 * @author Vijay Sugali
 * @version 1.0.0
 */
/* imports required for this module */
/* express module to expose rest APIs */
const express = require('express');
var bodyParser = require('body-parser');
/* merkle module exclusively for all merkle operations */
const merkle = require('./merkle');
/* import the contractArtifacts.js to get marketplace contract abi and bytecode */
const contractArtifacts = require('./contractArtifacts');
/* import deploy modules to call deploy contract function */
const deploy = require('./transactions/deploy');
/* import invoke modules to call invoke contract function */
const invoke = require('./transactions/invoke');
/* import query module to call query contract function */
const query = require('./transactions/query');
/* import the rpc module to call get transaction receipt function */
const client = require('./transactions/rpc');
/* import the database module to store and retrieve data from offchain */
const database = require('./database');
/* import the marketplaceData package to get marketplace data */
const marketplaceData = require('./marketplaceData');

/* instance of express app */
var app = express();
/* parsing the JSON */
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

/**
 * @name startMerkleTree
 * @description - api called by admin to build merkle tree with existing whitelisted addreses
 */
app.get('/api/admin/merkle/startMerkleTree', function (req, res) {
  try {
    /* call the merkle module function */
    const isBuilt = merkle.startMerkleTree();
    if (typeof isBuilt == 'boolean' && isBuilt == false)
      throw {
        Error: 'StartMerkleTreeError',
        message:
          'Unable to start the merkle tree with existing whitelisted addresses',
      };
    console.log(
      'Successfully started merkle tree with existing whitelisted addresses!'
    );
    res.send(isBuilt).status(200);
  } catch (error) {
    console.log(
      'Received error while starting merkle tree with existing whitelisted addresses'
    );
    res
      .send({
        Error: 'StartMerkleTreeApiError',
        message: 'Unable to start merkle tree',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name getContractAbi
 * @description - to get the abi of marketplace contract
 */
app.get('/api/get/user/getContractAbi', function(req, res){
  try{
    const abi = contractArtifacts.marketplaceAbi;
    res.send({"contractAbi": abi}).status(200);
  }catch(error){
    console.log('Received error while fetching the marketplace contract abi');
    res
      .send({
        Error: 'GetContractAbiApiError',
        message: 'Unable to fetch contract abi',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name getWhitelistedAddresses
 * @description - to get all whitelisted addresses
 */
app.get('/api/get/common/getWhitelistedAddresses', function (req, res) {
  try {
    const addreses = merkle.getWhitelistedAddresses();
    console.log('Successfully received all whitelisted addresses');
    res
      .send({
        addresses: addreses,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while fetching all whitelisted addresses');
    res
      .send({
        Error: 'GetWhitelistedAddressesApiError',
        message: 'Unable to fetch all whitelisted addresses',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name getMerkleRoot
 * @description - api to get the root hash of the merkle tree
 */
app.get('/api/common/merkle/getMerkleRoot', function (req, res) {
  try {
    const merkleRoot = merkle.getMerkleTree();
    res
      .send({
        merkleRoot: merkleRoot,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while fetching merkle tree root');
    res.send({
      Error: 'GetMerkleRootApiError',
      message: 'Unable to get merkle tree root',
      hint: JSON.stringify(error, null, 4),
    });
  }
});

/**
 * @name obtainProof
 * @description - api to obtain value and proof to be verified as whitelisted user in contract
 */
app.post('/api/user/merkle/obtainProof', async function (req, res) {
  try {
    console.log(req.body)
    /* validate inputs */
    const userAddress = req.body.userAddress;
    if (userAddress == null || userAddress == undefined)
      throw {
        Error: 'InvalidInputError',
        message: 'Please provide correct inputs in request structure',
      };

      const startTime = performance.now();
    /* call the merkle module function */
    const isObtained = merkle.obtainProof(userAddress);
    const endTime = performance.now();
    const responseTime = endTime - startTime;
  console.log(`API response time: ${responseTime}ms`);
    if (typeof isObtained == 'boolean' && isObtained == false)
      throw {
        Error: 'ObtainProofError',
        message: 'Unable to obtain proof and value for whitelisted user',
      };

    /* send the response with status 200 */
    console.log('Successfully obtained value and proof of whitelisted user!');
    res.send(isObtained).status(200);
  } catch (error) {
    console.log(
      'Received error while obtaining the value and proof of whitelisted user'
    );
    res
      .send({
        Error: 'ObtainProofApiError',
        message: 'Unable to obtain value and proof of whitelisted user',

        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name whitelistAddress
 * @description - api to add a new user address into whitelisted addresses
 */
app.post('/api/admin/merkle/whitelistAddress', function (req, res) {
  try {
    /* validate inputs */
    const userAddress = req.body.userAddress;
    if (userAddress == null || userAddress == undefined)
      throw {
        Error: 'InvalidInputError',
        message: 'Please provide correct inputs in request structure',
      };

    /* call the merkle module to whitelist the address */
    const isWhitelisted = merkle.whitelistAddress(userAddress);
    if (typeof isWhitelisted == 'boolean' && isWhitelisted == false)
      throw {
        Error: 'WhitelistAddressError',
        message: 'Unable to whitelist the given address',
      };

    /* send the response with success status */
    console.log('Successfully whitelisted the address');
    res.send(isWhitelisted).status(200);
  } catch (error) {
    console.log('Received error while whitelisting a new user address');
    res
      .send({
        Error: 'WhitelistAddressApiError',
        message: 'Unable to whitelist the new user address',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name removeWhitelisted
 * @description - to remove a user from whitelisted addresses
 */
app.post('/api/admin/merkle/removeWhitelisted', function (req, res) {
  try {
    /* validate inputs */
    const userAddress = req.body.userAddress;
    if (userAddress == null || userAddress == undefined)
      throw {
        Error: 'InvalidInputError',
        message: 'Please provide correct inputs in request structure',
      };

    /* call the merkle module to remove the user from whitelisted addresses */
    const isRemoved = merkle.removeWhitelisted(userAddress);
    if (typeof isRemoved == 'boolean' && isRemoved == false)
      throw {
        Error: 'RemoveWhitelistedError',
        message: 'Unable to remove whitelisted address',
      };

    /* send the reponse with success status */
    console.log('Successfully removed user from whitelisted addresses!');
    res.send(isRemoved).status(200);
  } catch (error) {
    console.log(
      'Received error while removing user from whitelisted addresses'
    );
    res
      .send({
        Error: 'RemoveWhitelistedApiError',
        message: 'Unable to remove whitelisted user',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name verifyProofOffchain
 * @description - to verify a proof in merkle tree i.e., verifying if a user is whitelisted
 */
app.post('/api/common/merkle/verifyProofOffchain', function (req, res) {
  try {
    /* validate the inputs */
    const proof = req.body.proof;
    // TODO: validate proof according to the expected input
    const userAddress = req.body.userAddress;
    if (userAddress == null || userAddress == undefined)
      throw {
        Error: 'InvalidInputError',
        message: 'Please provide correct inputs in request structure',
      };

    /* call the merkle module to verify proof offchain */
    const isVerified = merkle.verifyProofOffchain(userAddress, proof);
    if (isVerified == false)
      throw {
        Error: 'VerifyProofOffchainError',
        message: 'Unable to verify the proof of user in merkle tree',
      };

    /* send the response with success status */
    console.log(
      'Successfully user is able to verify their proof in merkle tree!'
    );
    res
      .send({
        status: isVerified,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while verifying the proof of user offchain');
    res
      .send({
        Error: 'VerifyProofOffchainApiError',
        message:
          "Unable to verify user's proof in merkle tree by offchain method",
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name deployContract
 * @description - to deploy marketplace contract
 */
app.post('/api/admin/contract/deployContract', async function (req, res) {
  try {
    /* get the inputs */
    // TODO: write a code to validate all the inputs
    const senderAddress = req.body.senderAddress;
    const senderPrivateKey = req.body.senderPrivateKey;
    /* we don't pass any value to marketplace contract constructor */
    // NOTE: if you utilize this Api for other implementation, then take this value from request structure
    const valueInEth = '0';
    const rpcUrl = req.body.rpcUrl;
    const chainId = req.body.chainId;
    const contractAbi = contractArtifacts.marketplaceAbi;
    const contractBytecode = contractArtifacts.marketplaceBytecode;
    /* we constructed below values as array because it comes handy while encoding bytecode with constructor values*/
    const constructorValues = [
      req.body.merkleTreeRootHash,
      req.body.erc721CollectibleName,
      req.body.erc721CollectibleSymbol,
      req.body.ipfsGatewayUrl,
    ];

    /* call the deployContract function from deploy module */
    const deployData = await deploy.deployContract(
      senderAddress,
      senderPrivateKey,
      valueInEth,
      rpcUrl,
      chainId,
      contractAbi,
      contractBytecode,
      constructorValues
    );

    /* send transaction receipt as a repsonse */
    console.log('Successfully deployed the marketplace contract!');
    res.send(deployData).status(200);
  } catch (error) {
    console.log('Received error while deploying the marketplace contract');
    res
      .send({
        Error: 'DeployContractApiError',
        message: 'Unable to deploy the marketplace contract',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name getMarketplaceData
 * @description - to get the marketplace data
 */
app.get('/api/admin/marketplace/getMarketplaceData', function (req, res) {
  try {
    /* get the marketplace data */
    const mpJson = marketplaceData.getMarketplaceJson();
    /* send the result with status */
    res.send(mpJson).status(200);
  } catch (error) {
    console.log('Received error while getting marketplace data');
    res
      .send({
        Error: 'GetMarketplaceDataApiError',
        message: 'Unable to retrieve the marketplace data',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name setMarketplaceData
 * @description - to set required marketplace data before deployment
 */
app.post('/api/admin/marketplace/setMarketplaceData', function (req, res) {
  try {
    /* initialize the data to set */
    // TODO: validate the inputs
    const rpcUrl = req.body.rpcUrl;
    const chainId = req.body.chainId;
    const erc721Name = req.body.collectibleName;
    const erc721Symbol = req.body.collectibleSymbol;
    const ipfsGatewayUrl = req.body.ipfsGatewayUrl;

    /* set the values */
    const isSet = marketplaceData.setMarketplaceJson(
      [
        'rpcUrl',
        'chainId',
        'erc721CollectibleName',
        'erc721CollectibleSymbol',
        'ipfsGatewayUrl',
      ],
      [rpcUrl, chainId, erc721Name, erc721Symbol, ipfsGatewayUrl]
    );

    /* throw error if any data is not set */
    if (!isSet) {
      throw {
        Error: 'SetMarketplaceJsonError',
        message: 'One or all fields are not set in marketplace json',
      };
    }

    /* send the status as response */
    console.log('Successfully has set the marketplace data');
    res
      .send({
        status: true,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while setting marketplace data');
    res
      .send({
        Error: 'SetMarketplaceDataApiError',
        message: 'Unable to set the marketplace data',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name invokeContract
 * @description - to invoke the marketplace contract
 *                updateRoot function - it is invoked to update the merkle root in the contract
 *                                      only deployer/admin of the contract can invoke this contract
 *                whitelistAddress    - after admin calling this API, there is need to update merkle root in contract
 *                removeWhitelisted   - after admin calling this API, there is need to update merkle root in contract
 */
app.post('/api/admin/contract/invokeContract', async function (req, res) {
  try {
    /* initialize the inputs */
    // TODO: write a code to validate all the inputs
    const senderAddress = req.body.senderAddress;
    const senderPrivateKey = req.body.senderPrivateKey;
    /* we don't pass any value to any of marketplace contract functions */
    // NOTE: if you utilize this Api for other implementation, then take this value from request structure
    const valueInEth = '0';
    const rpcUrl = req.body.rpcUrl;
    const chainId = req.body.chainId;
    const contractAddress = req.body.contractAddress;
    const contractAbi = contractArtifacts.marketplaceAbi;
    const functionName = req.body.functionName;
    /* if invoking function is updateRoot, then expect a merkleTreeRootHash in request structure */
    const merkleTreeRootHash = req.body.merkleTreeRootHash;
    var parameterValues;
    if (functionName == 'updateRoot') {
      parameterValues = [req.body.merkleTreeRootHash];
    }
    /* call the invokeContract function of invoke module */
    const receipt = await invoke.invokeContract(
      senderAddress,
      senderPrivateKey,
      valueInEth,
      rpcUrl,
      chainId,
      contractAddress,
      contractAbi,
      functionName,
      parameterValues
    );
    /* send transaction receipt as a response */
    console.log('Sucessfully invoked a contract function!');
    res.send(receipt).status(200);
  } catch (error) {
    console.log('Received error while invoking the marketplace contract');
    res
      .send({
        Error: 'InvokeContractApiError',
        message: 'Unable to invoke the marketplace contract',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name queryContract
 * @description - to query the contract function and get the return values
 */
app.post('/api/common/contract/queryContract', async function (req, res) {
  try {
    /* initiate inputs */
    const contractAddress = req.body.contractAddress;
    const rpcUrl = req.body.rpcUrl;
    const functionName = req.body.functionName;
    const tokenId = req.body.tokenId;
    var parameterValues;
    if (functionName == 'tokenURI') {
      parameterValues = [tokenId];
    } else {
      parameterValues = req.body.parameterValues;
    }

    /* call the query contract */
    const result = await query.queryContract(
      contractAddress,
      rpcUrl,
      functionName,
      parameterValues
    );

    /* return the result */
    console.log('Successfully queried the contract function!');
    res.send(result).status(200);
  } catch (error) {
    console.log('Received error while querying the marketplace contract');
    res
      .send({
        Error: 'QueryContractApiError',
        message: 'Unable to query the marketplace contract',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name getTransactionReceipt
 * @description - to fetch the transaction receipt from blockchain node
 */
app.post(
  '/api/common/contract/getTransactionReceipt',
  async function (req, res) {
    try {
      /* initiate the values */
      const transactionHash = req.body.transactionHash;
      const rpcUrl = req.body.rpcUrl;

      /* call the get transaction receipt function from rpc module */
      const receipt = await client.getTransactionReceipt(
        transactionHash,
        rpcUrl
      );

      /* return the result and send status */
      console.log('Successfully fetched the transaction receipt!');
      res.send(receipt).status(200);
    } catch (error) {
      console.log('Received error while fetching the transaction receipt');
      res
        .send({
          Error: 'GetTransactionReceiptApiError',
          message: 'Unable to fetch the transaction receipt',
          hint: JSON.stringify(error, null, 4),
        })
        .status(500);
    }
  }
);

/**
 * @name insertData
 * @description - users can call this api to insert nfts and transfers data into database
 */
app.post('/api/user/database/insertData', async function (req, res) {
  try {
    /* initiate the inputs */
    // TODO: validate the inputs
    const dbIP = req.body.dbIP;
    const dbPort = req.body.dbPort;
    const dbName = req.body.dbName;
    const entry = req.body.entry;
    const collectionName = req.body.collectionName;

    /* call the insert entry functions to insert the data into database */
    if (collectionName == 'nfts') {
      await database.insertNFTEntry(dbIP, dbPort, dbName, entry);
    } else if (collectionName == 'transfers') {
      await database.insertTransferEntry(dbIP, dbPort, dbName, entry);
    }

    /* return the status as a response */
    console.log('Successfully inserted the data into database!');
    res
      .send({
        status: true,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while inserting the data into database');
    res
      .send({
        Error: 'InsertDataApiError',
        message: 'Unable to insert the data into database',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name updateNFTOwner
 * @description - to update the nft owner of token id
 */
app.post('/api/user/database/updateNFTOwner', async function(req, res){
  try{
    /* initiate the inputs */
    // TODO: validate the inputs
    const dbIP = req.body.dbIP;
    const dbPort = req.body.dbPort;
    const dbName = req.body.dbName;
    const newOwner = req.body.newOwner;
    const tokenId = req.body.tokenId;

    /* call the function in database module */
    const data = await database.updateNFTOwner(
      dbIP,
      dbPort,
      dbName,
      tokenId,
      newOwner
    );
    /* return the status as a response */
    console.log('Successfully updated new owner of nft in database!');
    res
      .send({
        data: data
      })
      .status(200);
  }catch(error){
    console.log('Received error while updating the nft owner in the database');
    res
      .send({
        Error: 'UpdateNFTOwnerApiError',
        message: 'Unable to update the nft owner in the database',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name retrieveDataByID
 * @description - to retrieve the data from database
 *              - collections are of nfts and transfers
 *              - data can be retrieved by tokenId
 */
app.post('/api/user/database/retrieveDataByAddress', async function (req, res) {
  try {
    /* initiate the inputs */
    // TODO: validate the inputs
    const dbIP = req.body.dbIP;
    const dbPort = req.body.dbPort;
    const dbName = req.body.dbName;
    const owner = req.body.owner;
    const collectionName = req.body.collectionName;
    /* call the retrieve entry functions to retrieve the data from database */
    const data = await database.retrieveEntryByAddress(
      dbIP,
      dbPort,
      dbName,
      owner,
      collectionName
    );
    /* return the status as a response */
    console.log('Successfully retrieved the data from database!');
    res
      .send({
        data: data,
        collectionName: collectionName,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while retrieving the data from database');
    res
      .send({
        Error: 'retrieveDataByAddressApiError',
        message: 'Unable to retrieve the data from database',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name retrieveAllData
 * @description - to retrieve all entries from a given collection
 */
app.post('/api/admin/database/retrieveAllData', async function (req, res) {
  try {
    /* initiate the inputs */
    // TODO: validate the inputs
    const dbIP = req.body.dbIP;
    const dbPort = req.body.dbPort;
    const dbName = req.body.dbName;
    const collectionName = req.body.collectionName;

    /* call the retrieve entry functions to retrieve the data from database */
    const data = await database.retrieveAllEntries(
      dbIP,
      dbPort,
      dbName,
      collectionName
    );

    /* return the status as a response */
    console.log('Successfully retrieved the data from database!');
    res
      .send({
        data: data,
        collectionName: collectionName,
      })
      .status(200);
  } catch (error) {
    console.log('Received error while retrieving the data from database');
    res
      .send({
        Error: 'retrieveAllDataApiError',
        message: 'Unable to retrieve the data from database',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/* Running the application on port 8909 */
app.listen(8909, 'localhost');
console.log('Running on http://localhost:8909');
