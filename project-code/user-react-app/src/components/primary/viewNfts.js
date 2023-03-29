import React, { useState, useEffect } from "react";
import Web3 from "web3";

const ViewNFTs = () => {
  const [sender, setSender] = useState("");
  const [isSenderReady, setSenderReady] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [isNFTDataReady, setNFTDataReady] = useState(false);
  const [filteredNFTData, setFilteredNFTData] = useState(null);
  const [isFilteredDataReady, setFilteredDataReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleFetchAccount();
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      if(!isNFTDataReady){
        fetchNFTData();
      }
    }, 2000);
  
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if(isNFTDataReady && !isFilteredDataReady && isSenderReady){
      filterNFTData();
    }
  }, [isNFTDataReady]);

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
      console.log(data)
      setNftData(data.data);
      setNFTDataReady(true);
    }catch(error){
      setError(error.message);
    }
    setLoading(false);
  }

  async function filterNFTData(){
    setLoading(true);
    setError(null);
    try{
      const filteredData = nftData.reduce((acc, item) => {
        if (item.owner === sender) {
          acc.push(item);
        }
        return acc;
      }, []);
      console.log(filteredData)
      setFilteredNFTData(filteredData);
      setFilteredDataReady(true);
    }catch(error){
      setError(error.message)
    }
    setLoading(false);
  }

  const handleFetchAccount = async () => {
    setLoading(true);
    setError(null);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setSender(accounts[0]);
        setSenderReady(true);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Metamask not detected');
    }
    setLoading(false);
  };

  return(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
      }}
    >
      {isFilteredDataReady && (
        <>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <caption
              style={{
                captionSide: 'top',
                textAlign: 'center',
                border: '2px solid black',
                backgroundColor: '#F0F0F0',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                padding: '10px',
                color: '#333',
              }}
            >
                My NFTs
            </caption>
            <thead style={{ backgroundColor: 'lightgrey' }}>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Token ID
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Token URI
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Owner Address
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNFTData.map((nft) => (
                <tr key={nft.tokenId}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.tokenId}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.tokenUri}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.owner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default ViewNFTs;