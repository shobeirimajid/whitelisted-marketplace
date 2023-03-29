import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Mint = () => {
  const [ipfsApiUrl, setIpfsApiUrl] = useState(null);
  const [ipfsGatewayUrl, setIpfsGatewayUrl] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [account, setAccount] = useState(null);
  const [proof, setProof] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMarketplaceDataFetched, setMarketplaceDataFetched] = useState(false);
  const [isAccountFetched, setAccountFetched] = useState(false);
  const [isProofFetched, setProofFetched] = useState(false);
  const [isImageUploaded, setImageUploaded] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [nftName, setNftName] = useState('');
  const [nftSymbol, setNftSymbol] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftProperties, setNftProperties] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [nftMediaBytes, setMediaBytes] = useState(null);
  const [isNftIPFSed, setNftIPFSed] = useState(false);
  const [mediaCID, setMediaCID] = useState(null);
  const [mediaURI, setMediaURI] = useState(null);
  const [metadataCID, setMetadataCID]= useState(null);
  const [metadataURI, setMetadataURI] = useState(null);
  const [isMetadataIPFSed, setMetadataIPFSed] = useState(false);
  const [contractABI, setContractABI] = useState(null);
  const [isAbiFetched, setAbiFetched] = useState(false);
  const [tokenID, setTokenID] = useState(null);
  const [mintStatus, setMintStatus] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDatabaseSynced, setDatabaseSynced] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState(null);

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  useEffect(() => {
    if(isMarketplaceDataFetched){
      handleFetchAccount();
    }
  }, [isMarketplaceDataFetched]);  

  useEffect(() => {
    if (isAccountFetched) {
      fetchMerkleProof();
    }
  }, [isAccountFetched]); 

  useEffect(() => {
    if(isImageUploaded){
      storeMediaToIpfs();
    }
  }, [isImageUploaded]);

  useEffect(() => {
    if(isNftIPFSed){
      storeMetadataToIpfs();
    }
  }, [isNftIPFSed]);

  useEffect(()=>{
    if(isMetadataIPFSed){
      getMarketplaceABI();
    }
  },[isMetadataIPFSed]);

  useEffect(()=>{
    if(mintStatus){
      syncDatabase();
    }
  },[mintStatus]);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const mediaBytes = base64String.split(',')[1]; // remove prefix
        setImage(base64String);
        setMediaBytes(mediaBytes);
      };
      reader.readAsDataURL(file);
    }
  };  

  const handleNftNameChange = (event) => {
    setNftName(event.target.value);
  };

  const handleNftSymbolChange = (event) => {
    setNftSymbol(event.target.value);
  };

  const handleNftDescriptionChange = (event) => {
    setNftDescription(event.target.value);
  };

  const handleAddProperty = () => {
    setNftProperties([...nftProperties, { key: '', value: '' }]);
  };

  const handlePropertyKeyChange = (event, index) => {
    const newProperties = [...nftProperties];
    newProperties[index].key = event.target.value;
    setNftProperties(newProperties);
  };

  const handlePropertyValueChange = (event, index) => {
    const newProperties = [...nftProperties];
    newProperties[index].value = event.target.value;
    setNftProperties(newProperties);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const metadata = {
      name: nftName,
      symbol: nftSymbol,
      description: nftDescription,
      properties: nftProperties,
    };
    setMetadata(metadata);
    setImageUploaded(true);
  };

  const fetchMarketplaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        'http://localhost:8909/api/admin/marketplace/getMarketplaceData',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const resJson = await res.json();
      setIpfsApiUrl(resJson.ipfsApiUrl);
      setIpfsGatewayUrl(resJson.ipfsGatewayUrl);
      setContractAddress(resJson.contractAddress);
      setMarketplaceDataFetched(true)
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleFetchAccount = async () => {
    setLoading(true);
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setAccountFetched(true);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Metamask not detected');
    }
    setLoading(false);
  };

  const syncDatabase = async () => {
    setLoading(true);
    setError(null);
    const requestBody = {
      dbIP: 'localhost',
      dbPort: 27017,
      dbName: 'marketplace_db',
      entry: {
        tokenId: tokenID,
        tokenUri: metadataURI,
        owner: account,
      },
      collectionName: 'nfts',
    };
  
    axios.post('http://localhost:8909/api/user/database/insertData', requestBody)
      .then((response) => {
        if (response.data.status) {
          setDatabaseStatus('Database is synced successfully');
          setDatabaseSynced(true)

        } else {
          setDatabaseStatus('Error syncing database');
        }
      })
      .catch((error) => {
        setDatabaseStatus('Error syncing database');
        setError(error.message)
      });
    setLoading(false);
  }

  

const fetchMerkleProof = async () => {
  setLoading(true);
  setError(null);
  if(!isProofFetched){
    try {
      const response = await axios.post('http://localhost:8909/api/user/merkle/obtainProof', {
        userAddress: account,
      });

      const resJson = response.data;
      setProof(resJson.proof);
      setProofFetched(true);
    } catch (error) {
      setError(error.message);
    }
  }
  setLoading(false);
};

const storeMediaToIpfs = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('http://localhost:8908/api/common/ipfs/insertMedia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        "mediaBytes":nftMediaBytes,
        ipfsApiUrl,
        ipfsGatewayUrl
      })
    });
    if (!response.ok) {
      throw new Error('Failed to store media in IPFS');
    }
    const { mediaCID, mediaURI } = await response.json();
    setMediaCID(mediaCID);
    setNftIPFSed(true);
    setMediaURI(mediaURI);
  } catch (error) {
    setError(error.message);
  }
  setLoading(false);
};

const storeMetadataToIpfs = async function () {
  setLoading(true);
  setError(null);
  try {
    var metaData = metadata
    metaData["image"] = mediaURI;
    const response = await fetch('http://localhost:8908/api/common/ipfs/insertMetadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        metadata: metaData,
        ipfsApiUrl: ipfsApiUrl,
        ipfsGatewayUrl: ipfsGatewayUrl
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to store metadata in IPFS. Status code: ${response.status}`);
    }

    const result = await response.json();
    const metadataCid = result.metadataCid;
    const metadataUri = result.metadataUri;
    setMetadataCID(metadataCid);
    setMetadataURI(metadataUri);
    setMetadataIPFSed(true);
  } catch (error) {
    setError(error.message);
  }
  setLoading(false);
}

const getMarketplaceABI = async function(){
  setLoading(true);
  setError(null);
  try{
    const apiUrl = 'http://localhost:8909/api/get/user/getContractAbi';
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (response.ok) {
      setContractABI(data.contractAbi);
      setAbiFetched(true);
    } else {
      setError(data.Error);
    }
  }catch(error){
    setError(error.message);
  }
  setLoading(false);
}

const handleMintNFT = async function(){
  setLoading(true);
  setError(null);
  if (!window.ethereum) {
    setStatus('Error: Metamask not detected.');
    return;
  }
  try {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const abi = JSON.parse(contractABI);
    console.log(abi, contractAddress, proof, metadataCID)
    const marketplaceContract = new web3.eth.Contract(abi, contractAddress);

    // Invoke the Marketplace contract's mint function to create a new NFT
    const transaction = await marketplaceContract.methods.mintNFT(proof, metadataCID).send({from: accounts[0], gas: 166163});
    setStatus('Minting NFT...');

    // Wait for the transaction to be confirmed and get the receipt
    const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);
    const tokenId = receipt.logs[0].topics[3];
    setStatus(`NFT minted successfully! Transaction hash: ${receipt.transactionHash}`);
    setTokenID(web3.utils.hexToNumber(tokenId));
    setMintStatus(true);
  } catch (error) {
    setStatus(`Error minting NFT: ${error.message}`);
    setError(error.message);
  }
  setLoading(false);
}


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
      }}
    >
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!isImageUploaded && (
        <>
          <h3 style={{ color: '#3366cc', marginBottom: '20px', marginTop: '20px' }}>Mint NFT</h3>
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px'}}>
          <div style={{marginBottom: '10px', marginTop: '20px', display: 'flex', flexDirection: 'column'}}>
  <label htmlFor="nftName" style={{fontWeight: 'bold', fontSize: '16px'}}>NFT Name:</label>
  <input type="text" id="nftName" value={nftName} onChange={handleNftNameChange} style={{padding: '5px', borderRadius: '5px', border: '1px solid gray', marginLeft: '10px', width: '100%'}} />
</div>
<div style={{marginBottom: '10px', marginTop: '10px', display: 'flex', flexDirection: 'column'}}>
  <label htmlFor="nftSymbol" style={{fontWeight: 'bold', fontSize: '16px'}}>NFT Symbol:</label>
  <input type="text" id="nftSymbol" value={nftSymbol} onChange={handleNftSymbolChange} style={{padding: '5px', borderRadius: '5px', border: '1px solid gray', marginLeft: '10px', width: '100%'}} />
</div>

  <div style={{marginBottom: '10px', marginTop: '10px', display: 'flex', flexDirection: 'column'}}>
  <label htmlFor="nftDescription" style={{fontWeight: 'bold', fontSize: '16px'}}>NFT Description:</label>
  <textarea 
    id="nftDescription" 
    value={nftDescription} 
    onChange={handleNftDescriptionChange} 
    style={{
      padding: '10px',
      borderRadius: '5px', 
      border: '1px solid gray', 
      marginLeft: '10px',
      width: '100%',
      minHeight: '100px'
    }}
  />
</div>

<div style={{ marginBottom: '10px', marginTop: '10px' }}>
  <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Properties:</label>
  <Button
    type="button"
    onClick={handleAddProperty}
    style={{
      marginLeft: '10px',
      padding: '5px 10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    }}
  >
    Add NFT Features
  </Button>
  {nftProperties.map((property, index) => (
    <div key={index} style={{ display: 'flex', marginTop: '10px' }}>
      <div style={{ marginRight: '10px' }}>
        <input
          type="text"
          placeholder="Key"
          value={property.key}
          onChange={(event) => handlePropertyKeyChange(event, index)}
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid gray',
          }}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Value"
          value={property.value}
          onChange={(event) => handlePropertyValueChange(event, index)}
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid gray',
          }}
        />
      </div>
    </div>
  ))}
</div>

<div style={{ marginBottom: '10px', marginTop: '10px' }}>
  <label htmlFor="imageUpload" style={{ fontWeight: 'bold', fontSize: '16px' }}>Upload an image:</label>
  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
    <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
    <label htmlFor="imageUpload" style={{ cursor: 'pointer', padding: '5px', backgroundColor: '#f2f2f2', borderRadius: '5px', border: '1px solid gray', marginLeft: '10px' }}>
      Choose file
    </label>
    {image && <span style={{ marginLeft: '10px' }}>{selectedFile && <div>Selected: {selectedFile}</div>}</span>}
  </div>
</div>

  <Button
   type="submit" 
   style={{
     padding: '10px', 
     borderRadius: '5px', 
     border: 'none', 
     cursor: 'pointer', 
     fontSize: '18px', 
     marginTop: '20px'
  }}>
     <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
    Mint 
  </Button>
</form>

        </>        
      )}
      {isImageUploaded && (
        <div style={{ display: 'flex' }}>
          {image && (
            <div style={{ width: '400px', height: '400px', marginRight: '20px' }}>
              <img src={image} alt="Uploaded Image" style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          {metadata && (
            <table style={{
              borderCollapse: 'collapse',
              width: '100%',
              border: '1px solid black'
            }}>
              <caption style={{
                captionSide: 'top',
                textAlign: 'center',
                border: '2px solid black',
                backgroundColor: '#F0F0F0',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                padding: '10px',
                color: '#333',
              }}>NFT Metadata</caption>
              <tbody>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Name:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <strong>{metadata.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Symbol:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <strong>{metadata.symbol}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Description:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <strong>{metadata.description}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>Token ID:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}><strong>{tokenID? tokenID: 'yet to be minted'}</strong></td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Media IPFS Hash:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <strong>{mediaCID}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Metadata IPFS Hash:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <strong>{metadataCID}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>NFT Properties:</td>
                  <td style={{
                    paddingLeft: '20px',
                    border: '1px solid black'
                  }}>
                    <table style={{
                      borderCollapse: 'collapse',
                      width: '100%'
                    }}>
                      <tbody>
                        <ul style={{ marginBottom: '10px', paddingLeft: '20px' }}>
                          {metadata.properties.map((property, index) => (
                            <li key={index}>
                              <strong>{property.key}:</strong> {property.value}
                            </li>
                          ))}
                        </ul>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>View NFT Media in IPFS:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <Button 
                      style={{ 
                        padding: '5px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        cursor: 'pointer',  
                        marginRight: '10px' 
                      }} 
                      onClick={() => window.location.href = mediaURI}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      View on IPFS
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black'
                  }}>View NFT Metadata in IPFS:</td>
                  <td style={{
                    padding: '5px',
                    border: '1px solid black'
                  }}>
                    <Button 
                      style={{ 
                        padding: '5px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        cursor: 'pointer',  
                        marginRight: '10px' 
                      }} 
                      onClick={() => window.location.href = metadataURI}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                      View on IPFS
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
            )}
        </div>
      
      
      )}
      <br />
      {isAbiFetched && (
        <>
          <Button 
            variant="primary"
            onClick={handleMintNFT}
          >
            Mint NFT
          </Button>
          <p>{status}</p>
        </>
      )}
      {mintStatus && (
        <>
          <p>Token ID: {tokenID}</p>
          <p>{databaseStatus}</p>
        </>
      )}
    </div>
  );
};

export default Mint;
