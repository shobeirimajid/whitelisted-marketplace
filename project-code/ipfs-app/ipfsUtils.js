/**
 * @name ipfsUtils.js
 * @description - all the helper functions for adding and pinning nft media
 * @author Vijay Sugali
 * @version 1.0.0
 */

/* import the required modules */
import { create } from 'ipfs-http-client';

/**
 * @name getIpfsClient
 * @description - to get the ipfs client
 * @param { String } ipfsApiUrl - ipfs api url
 * @returns { Object } - ipfs client
 */
const getIpfsClient = function (ipfsApiUrl) {
  /* create ipfs client */
  const client = create(new URL(ipfsApiUrl));
  return client;
};

/**
 * @name insertMedia
 * @description - to insert any media into ipfs
 * @param { String } ipfsApiUrl - ipfs api url of ipfs network
 * @param { HexString } mediaBytes - to add media into ipfs, this function expects media as base64 bytes
 * @returns { String } cid - ipfs hash of the media
 */
const insertMedia = async function (ipfsApiUrl, mediaBytes) {
  /* get ipfs client */
  const client = getIpfsClient(ipfsApiUrl);
  /* insert media into ipfs network */
  const cid = await client.add(Buffer.from(mediaBytes, 'base64'));
  /* return the ipfs CID i.e., ipfs hash of media */
  return '' + cid.cid;
};

/**
 * @name insertMetadata
 * @description - to insert metadata of nft media into ipfs network
 * @param { String } ipfsApiUrl - ipfs api url of ipfs network
 * @param { Object } metadata - metadata with name, description, image, properties and other fields
 * @returns { String } cid - ipfs hash of the media
 */
const insertMetadata = async function (ipfsApiUrl, metadata) {
  /* get ipfs client */
  const client = getIpfsClient(ipfsApiUrl);
  /* insert metadata of nft media into ipfs network */
  const cid = await client.add(Buffer.from(JSON.stringify(metadata)));
  /* return the ipfs CID i.e., ipfs hash of metadata */
  return '' + cid.cid;
};

/**
 * @name pinIpfsCid
 * @description - to pin the cid of ipfs media or metadata
 * @param { String } ipfsApiUrl - ipfs api url of ipfs network
 * @param { String } cid - ipfs hash of the media
 * @returns { Boolean } isPinned - `True`   : if successfully pinned
 *                               - `False`  : if pinning is failed
 */
const pinIpfsCid = async function (ipfsApiUrl, cid) {
  /* get ipfs client */
  const client = getIpfsClient(ipfsApiUrl);
  /* pin cid into ipfs */
  const isPinned = await client.pin.add(cid);
  /* return the status */
  return isPinned;
};

/* export these functions */
export default {
  insertMedia,
  insertMetadata,
  pinIpfsCid,
};
