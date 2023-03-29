/**
 * @name index.js
 * @description - to expose restful Apis mainly to insert media and its metadata into ipfs network
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
/* import the express package to develop Apis */
import express from 'express';
/* import this module to access main functions */
import ipfsUtils from './ipfsUtils.js';

/* initiate the express app */
const app = express();
/* to capture json from request body */
app.use(express.json({ limit: '50gb' }));
/* send error if unable to access request */
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res.send({ Error: JSON.stringify(err, null, 4) }).status(500);
  } else {
    next();
  }
});
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
 * @name insertMedia
 * @description - to insert nft media into ipfs network
 */
app.post('/api/common/ipfs/insertMedia', async function (req, res) {
  try {
    /* initiate inputs */
    // TODO: validations for inputs has to be coded
    const mediaBytes = req.body.mediaBytes;
    const ipfsApiUrl = req.body.ipfsApiUrl;
    const ipfsGatewayUrl = req.body.ipfsGatewayUrl;
    // console.log(req.body)
    /* call the insert media function of ipfs utils module */
    const mediaCid = await ipfsUtils.insertMedia(ipfsApiUrl, mediaBytes);

    /* generate response and return it */
    const resObj = {
      mediaCID: mediaCid,
      mediaURI: ipfsGatewayUrl + mediaCid,
    };
    console.log('Successfully inserted nft media into ipfs network!');
    res.send(resObj).status(200);
  } catch (error) {
    console.log(error)
    console.log('Received error while inserting nft media into ipfs network!');
    res.send({
      Error: 'insertMediaApiError',
      message: 'Unable to insert nft media into ipfs network',
      hint: JSON.stringify(error, null, 4),
    });
  }
});

/**
 * @name insertMetadata
 * @description - to insert metadata of nft media into ipfs network
 */
app.post('/api/common/ipfs/insertMetadata', async function (req, res) {
  try {
    /* initiate inputs */
    // TODO: validations for inputs has to be coded
    const metadata = req.body.metadata;
    const ipfsApiUrl = req.body.ipfsApiUrl;
    const ipfsGatewayUrl = req.body.ipfsGatewayUrl;

    /* call the insert metadata function of ipfs utils module */
    const metadataCid = await ipfsUtils.insertMetadata(ipfsApiUrl, metadata);

    /* generate response and return it */
    const resObj = {
      metadataCid: metadataCid,
      metadataUri: ipfsGatewayUrl + metadataCid,
    };
    console.log(
      'Successfully inserted metadata of nft media into ipfs network!'
    );
    res.send(resObj).status(200);
  } catch (error) {
    console.log(
      'Received error while inserting metadata of nft media into ipfs network!'
    );
    res
      .send({
        Error: 'insertMetadataApiError',
        message: 'Unable to insert metadata of nft media into ipfs network',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/**
 * @name pinCid
 * @description - to pin cid of ipfs media/metadata
 */
app.post('/api/common/ipfs/pinCid', async function (req, res) {
  try {
    /* initiate the inputs */
    // TODO: validations for inputs has to be coded
    const cid = req.body.cid;
    const ipfsApiUrl = req.body.ipfsApiUrl;

    /* call the function in ipfs utils module to pin cid */
    const isPinned = await ipfsUtils.pinIpfsCid(ipfsApiUrl, cid);

    /* build the res and send */
    if (isPinned) {
      console.log('Successfully pinned ipfs hash into ipfs network!');
    } else {
      throw {
        Error: 'pinCidError',
        message: 'Unable to pin ipfs hash',
      };
    }
    res.send({ status: isPinned }).status(200);
  } catch (error) {
    console.log('Received error while pinning the ipfs cid');
    res
      .send({
        Error: 'pinCidApiError',
        message: 'Unable to insert cid into ipfs network',
        hint: JSON.stringify(error, null, 4),
      })
      .status(500);
  }
});

/* Running the application on port 8908 */
app.listen(8908, 'localhost');
console.log('Running on http://localhost:8908');
