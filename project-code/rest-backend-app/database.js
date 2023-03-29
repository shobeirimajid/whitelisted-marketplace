/**
 * @name database.js
 * @description - all the database operations are developed here
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import the mongoose package to connect database */
const mongoose = require('mongoose');

/**
 * @name connectDb
 * @description - to connect to the mentioned database
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 */
const connectDb = async function (dbIP, dbPort, dbName) {
  /* construct db url */
  const dbUrl = 'mongodb://' + dbIP + ':' + dbPort + '/' + dbName;
  /* connect to the database */
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * @name closeDbConnection
 * @description - it is imp to close connection to avoid unnecessary memory consumption
 */
const closeDbConnection = function () {
  /* close the connection established to the db */
  mongoose.connection.close();
};

/**
 * @name getNFTSchema
 * @description - to get the NFT schema
 * @returns - returns mongoose schema for nfts collections
 */
const getNFTSchema = function () {
  /* store nft schema here */
  const nftSchema = new mongoose.Schema({
    tokenId: {
      type: String,
      required: true,
    },
    tokenUri: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
  });
  /* send the schema */
  return nftSchema;
};

/**
 * @name getTransferSchema
 * @description - to get the transfers schema
 * @returns - returns mongoose schema for transfers collections
 */
const getTransferSchema = function () {
  /* store transfer schema here */
  const transferSchema = new mongoose.Schema({
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  });
  /* send the schema */
  return transferSchema;
};

/**
 * @name getModel
 * @description - to get the models of nfts and transfers collections
 * @param { String } modelName - [ 'Nft', 'Transfer' ]
 * @param { Object } modelSchema - schema of above models
 * @returns { any } - mongoose model instance
 */
const getModel = function (modelName, modelSchema) {
  /* store the model */
  const model =
    mongoose.models[modelName] || mongoose.model(modelName, modelSchema);
  /* return the model */
  return model;
};

/**
 * @name getMongoDocument
 * @description - to get document instance of collection
 *              - this is used to save the rows(documents) in collections
 * @param { String } modelName - [ 'Nft', 'Transfer' ]
 * @param { Object } modelSchema - schema of above models
 * @param { Object } docRawData - Object with keys and values of a table row
 * @returns { any } doc - mongoose document instance of a collection
 */
const getMongoDocument = function (modelName, modelSchema, docRawData) {
  /* get the model */
  const model = getModel(modelName, modelSchema);
  /* get the collection document instance */
  const doc = new model(docRawData);
  /* send the document */
  return doc;
};

/**
 * @name insertEntry
 * @description - to save the table entries in the database
 * @param { String } modelName - [ 'Nft', 'Transfer' ]
 * @param { Object } modelSchema - schema of above models
 * @param { Object } docRawData - Object with keys and values of a table row
 */
const insertEntry = async function (modelName, modelSchema, docRawData) {
  /* get the mongoose document instance for given collection, schema and row */
  const doc = getMongoDocument(modelName, modelSchema, docRawData);
  /* save the entries in the database */
  await doc.save();
};

/**
 * @name insertNFTEntry
 * @description - to insert entries in the nft collections
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 * @param { Object } entry - Object with values of tokenId, tokenUri, owner
 */
const insertNFTEntry = async function (dbIP, dbPort, dbName, entry) {
  /* connect to the database */
  await connectDb(dbIP, dbPort, dbName);
  /* get nft schema */
  const nftSchema = getNFTSchema();
  /* insert the nft entry */
  await insertEntry('Nft', nftSchema, entry);
  /* close the connection */
  closeDbConnection();
};

/**
 * @name insertTransferEntry
 * @description - to insert the transfers entry
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 * @param { Object } entry - Object with values of sender, receiver, tokenId, transactionId
 */
const insertTransferEntry = async function (dbIP, dbPort, dbName, entry) {
  try {
    /* connect to the database */
    await connectDb(dbIP, dbPort, dbName);
    /* get transfers schema */
    const transferSchema = getTransferSchema();
    /* insert the transfers entry */
    await insertEntry('Transfer', transferSchema, entry);
    /* close the connection */
    closeDbConnection();
  } catch (error) {
    console.log(error);
  }
};

/**
 * @name retrieveEntryById
 * @description - to query the nfts/transfers data by token Id
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 * @param { String } owner - nft owner
 * @returns { Object } nftData - consists of tokenId, tokenUri and owner address
 *                     transfersData - consists of sender, receiver, tokenId, transactionId
 */
const retrieveEntryByAddress = async function (
  dbIP,
  dbPort,
  dbName,
  owner,
  collectionName
) {
  try {
    /* connect to the database */
    await connectDb(dbIP, dbPort, dbName);
    /* get the model */
    var modelName, modelSchema, data;
    if (collectionName == 'nfts') {
      modelName = 'Nft';
      modelSchema = getNFTSchema();
      model = getModel(modelName, modelSchema);
      console.log(modelName, owner)
      data = await model.find({owner: owner})
    } else if (collectionName == 'transfers') {
      var query = { $or: [{ sender: owner }, { receiver: owner }] };
      modelName = 'Transfer';
      modelSchema = getTransferSchema();
      model = getModel(modelName, modelSchema);
      data = await model.find({query})
    }
    /* query nfts by tokenId */
    console.log(data)
    /* close the connection */
    closeDbConnection();
    /* return nfts/transfers data */
    return data;
  } catch (error) {
    console.log(error);
  }
};
/**
 * @name retrieveAllEntries
 * @description - to query all entried of the nfts/transfers data
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 * @returns { Array } nftData - consists of tokenId, tokenUri and owner address
 *                     transfersData - consists of sender, receiver, tokenId, transactionId
 */
const retrieveAllEntries = async function (
  dbIP,
  dbPort,
  dbName,
  collectionName
) {
  /* connect to the database */
  await connectDb(dbIP, dbPort, dbName);
  /* get the model */
  var modelName, modelSchema;
  if (collectionName == 'nfts') {
    modelName = 'Nft';
    modelSchema = getNFTSchema();
  } else if (collectionName == 'transfers') {
    modelName = 'Transfer';
    modelSchema = getTransferSchema();
  }
  const model = getModel(modelName, modelSchema);
  /* query nfts by tokenId */
  const data = await model.find({});
  /* close the connection */
  closeDbConnection();
  /* return nfts/transfers data */
  return data;
};

/**
 * @name updateNFTOwner
 * @description - to update the owner of NFt
 * @param { String } dbIP - ip of the machine, default is localhost
 * @param { Number } dbPort - port of the mongodb database running
 * @param { String } dbName - name of the database created for marketplace
 * @param { Number } tokenId - token id of nft
 * @param { Address } newOwner - new owner for this nft
 * @returns 
 */
const updateNFTOwner = async function(
  dbIP,
  dbPort,
  dbName,
  tokenId,
  newOwner
){
  /* connect to the database */
  await connectDb(dbIP, dbPort, dbName);
  /* get the model */
  const modelName = 'Nft';
  const modelSchema = getNFTSchema();
  const model = getModel(modelName, modelSchema);
  /* find one and update */
  const data = await model.findOneAndUpdate({ tokenId }, { owner: newOwner }, { new: true });
  console.log(data)
  /* close the connection */
  closeDbConnection();
  /* return nfts/transfers data */
  return data;
}

/*
const test =async function(){
  const data = await retrieveEntryById(
    'localhost',
    27017,
    'marketplace_db',
    3,
    'nfts'
  )
  console.log(data)
}
test()
*/

/* export the modules */
module.exports = {
  insertNFTEntry,
  insertTransferEntry,
  retrieveEntryByAddress,
  retrieveAllEntries,
  updateNFTOwner
};
