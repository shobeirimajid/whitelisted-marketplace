import React, { useState, useEffect } from 'react';

const Mint = () => {
  const [ipfsApiUrl, setIpfsApiUrl] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [account, setAccount] = useState(null);
  const [proof, setProof] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMarketplaceDataFetched, setMarketplaceDataFetched] = useState(false);
  const [isAccountFetched, setAccountFetched] = useState(false);
  const [isProofFetched, setProofFetched] = useState(false);

  useEffect(() => {
    fetchNFTData();
  }, []);

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
      const intervalId = setInterval(fetchMerkleProof, 10000);
      fetchMerkleProof();
      return () => clearInterval(intervalId);
    }
  }, [isAccountFetched]);  

  async function fetchNFTData() {
    setLoading(true);
    setError(null);
    try{
      const response = await fetch('http://localhost:8909/api/admin/database/retrieveAllData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dbIP: 'localhost',
          dbPort: 27017,
          dbName: 'marketplace_db',
          collectionName: 'nfts'
        })
      });
      const data = await response.json();
      setNftData(data.data);
    }catch(error){
      setError(error.message);
    }
    setLoading(false);
  }

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

  const fetchMerkleProof = async () => {
    setLoading(true);
    setError(null);
    console.log("account: ", account)
    try {
      const response = await fetch('http://localhost:8909/api/user/merkle/obtainProof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userAddress": account,
        }),
      });
      const resJson = await response.json();
      console.log("proof: ", resJson);
      setProof(proof);
      setProofFetched(true)
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
    <div style={{ display: 'flex' }}>
          {image && (
            <div style={{ width: '400px', height: '400px', marginRight: '20px' }}>
              <img src={image} alt="Uploaded Image" style={{ width: '100%', height: '100%' }} />
            </div>
          )}
          {metadata && (
            <div>
              <p>NFT Name: {metadata.name}</p>
              <p>NFT Symbol: {metadata.symbol}</p>
              <p>NFT Description: {metadata.description}</p>
              <p>NFT Properties:</p>
              <ul>
                {metadata.properties.map((property, index) => (
                  <li key={index}>
                    {property.key}: {property.value}
                  </li>
                ))}
              </ul>
              {isNftIPFSed && (
                <div>
                  <p>IPFS Hash: {mediaCID}</p>
                  <button onClick={() => window.location.href = mediaURI}>View on IPFS</button>
                </div>
              )}
              {isMetadataIPFSed && (
                <div>
                  <p>Metadata IPFS Hash: {metadataCID}</p>
                  <button onClick={() => window.location.href = metadataURI}>View on IPFS</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex' }}>
        {image && (
          <div style={{ width: '400px', height: '400px', marginRight: '20px' }}>
            <img src={image} alt="Uploaded Image" style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {metadata && (
          <div style={{ color: '#333', fontSize: '16px' }}>
            <p style={{ marginBottom: '5px' }}>NFT Name: <strong style={{ color: '#555' }}>{metadata.name}</strong></p>
            <p style={{ marginBottom: '5px' }}>NFT Symbol: <strong style={{ color: '#555' }}>{metadata.symbol}</strong></p>
            <p style={{ marginBottom: '5px' }}>NFT Description: <strong style={{ color: '#555' }}>{metadata.description}</strong></p>
            <p style={{ marginBottom: '5px' }}>NFT Properties:</p>
            <ul style={{ marginBottom: '10px', paddingLeft: '20px' }}>
              {metadata.properties.map((property, index) => (
                <li key={index}>
                  <strong style={{ color: '#555' }}>{property.key}:</strong> {property.value}
                </li>
              ))}
            </ul>
            {isNftIPFSed && (
              <div>
                <p style={{ marginBottom: '5px' }}>IPFS Hash: <strong style={{ color: '#555' }}>{mediaCID}</strong></p>
                <button style={{ padding: '5px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#eee', marginRight: '10px' }} onClick={() => window.location.href = mediaURI}>View NFT Image on IPFS</button>
              </div>
            )}
            {isMetadataIPFSed && (
              <div>
                <p style={{ marginBottom: '5px' }}>Metadata IPFS Hash: <strong style={{ color: '#555' }}>{metadataCID}</strong></p>
                <button style={{ padding: '5px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#eee' }} onClick={() => window.location.href = metadataURI}>View NFT Metadata on IPFS</button>
              </div>
            )}
          </div>
        )}
      </div>
      </>
  );
};

export default Mint;
