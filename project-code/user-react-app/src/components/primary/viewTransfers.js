import React, { useState, useEffect } from "react";
import Web3 from "web3";

const ViewTransfers = () => {
  const [sender, setSender] = useState("");
  const [isSenderReady, setSenderReady] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [isTransferDataReady, setTransferDataReady] = useState(false);
  const [filteredTransferData, setFilteredNFTData] = useState(null);
  const [isFilteredDataReady, setFilteredDataReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleFetchAccount();
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      if(!isTransferDataReady){
        fetchTransferData();
      }
    }, 2000);
  
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    if(isTransferDataReady && !isFilteredDataReady && isSenderReady){
      filterTransferData();
    }
  }, [isTransferDataReady]);

  async function fetchTransferData() {
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
          collectionName: 'transfers'
        })
      });
      const data = await response.json();
      console.log(data)
      setTransferData(data.data);
      setTransferDataReady(true);
    }catch(error){
      setError(error.message);
    }
    setLoading(false);
  }

  async function filterTransferData(){
    setLoading(true);
    setError(null);
    try{
      const filteredData = transferData.reduce((acc, item) => {
        if (item.sender === sender || item.receiver === sender) {
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
          <div>
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
                My transfers
              </caption>
              <thead style={{ backgroundColor: 'lightgrey' }}>
                <tr>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Token ID
                  </th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Sender
                  </th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Receiver
                  </th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Transaction ID
                  </th>
                  <th style={{ border: '1px solid black', padding: '8px' }}>
                    Transaction Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransferData.map((transfer) => (
                  <tr key={transfer._id}>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {transfer.tokenId}
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {transfer.sender}
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {transfer.receiver}
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {transfer.transactionId}
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {(sender==transfer.sender)? 'Sent':'Received'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default ViewTransfers;