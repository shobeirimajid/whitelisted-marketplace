import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const TransferNFT = () => {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [contractABI, setContractABI] = useState(null);
  const [isAbiFetched, setAbiFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [isContractFetched, setContractFetched] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [isTransferred, setTransferred] = useState(false);
  const [isDbSynced, setDbSynced] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [isNFTDataReady, setNFTDataReady] = useState(false);
  const [filteredNFTData, setFilteredNFTData] = useState(null);
  const [isFilteredDataReady, setFilteredDataReady] = useState(false);
  const [isSenderReady, setSenderReady] = useState(false);

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
    fetchMarketplaceData();
  }, []);

  useEffect(() => {
    handleFetchAccount();
  }, [])

  useEffect(() => {
    if(isNFTDataReady && !isFilteredDataReady && isSenderReady){
      filterNFTData();
    }
  }, [isNFTDataReady]);

  useEffect(() => {
    if(isContractFetched){
      getMarketplaceABI();
    }
  }, [isContractFetched]);

  useEffect(() => {
    if(isTransferred){
      syncDatabase();
    }
  }, [isTransferred]);

  useEffect(() => {
    if(isDbSynced){
      const timerId = setTimeout(() => {
        window.location.reload();
      }, 1000);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [isDbSynced]);

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
      console.log("data before filetered: ", nftData)
      console.log(sender)
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

  const getMarketplaceABI = async function(){
    setLoading(true);
    setError(null);
    try{
      const apiUrl = 'http://localhost:8909/api/get/user/getContractAbi';
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        setContractABI(JSON.parse(data.contractAbi));
        setAbiFetched(true);
      } else {
        setError(data.Error);
      }
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
      setContractAddress(resJson.contractAddress);
      setContractFetched(true)
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const syncDatabase = async () => {
    setLoading(true);
    setError(null);
    // Sync the transfer data into database
    try{
      const dbEntry = {
        sender: sender,
        receiver: receiver,
        tokenId: tokenId,
        transactionId: txHash,
      };
      const response = await fetch(
        "http://localhost:8909/api/user/database/insertData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dbIP: "localhost",
            dbPort: 27017,
            dbName: "marketplace_db",
            entry: dbEntry,
            collectionName: "transfers",
          }),
        }
      );
      const responseData = await response.json();
      if(responseData.status){
        setTransferMessage("Transfers data is synced into database successfully");
      }else{
        throw new Error("Transfers database sync failed!")
      }
      /* now update the nft owner in database */
      setLoading(true);
      setError(null);
      try{
        const requestData = {
          dbIP: "localhost",
          dbPort: 27017,
          dbName: "marketplace_db",
          tokenId: tokenId,
          newOwner: receiver,
        };
        const response = await fetch(
          "http://localhost:8909/api/user/database/updateNFTOwner",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );
        const data = await response.json();
        setTransferMessage("new nft owner is updated in db. Database is successfully in sync");
        setDbSynced(true);
      }catch(error){
        setError(error.message);
      }
      setLoading(false);
    }catch(error){
      setError("Unable to sync database. Error got: ",error.message)
    }
    setLoading(false);
  }

  const handleFormSubmit = async (event) => {
    setLoading(true);
    setError(null);
    event.preventDefault();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    const sender = accounts[0];
    setSender(sender);
    setSenderReady(true)
    if(isContractFetched && isAbiFetched){
      const contract = new web3.eth.Contract(
        contractABI,
        contractAddress,
        { from: sender }
      );
      try {
        const transaction = await contract.methods.transferFrom(sender, receiver, tokenId).send();
        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);
        setTxHash(receipt.transactionHash);
        setTransferMessage("NFT transferred successfully")
        setTransferred(true);
      } catch (error) {
        setError("Error transferring NFT: " + error.mesage);
      }
    }else{
      setError('Contract fetching failed!')
    }
    setLoading(false);
  };

  const onRowClick = (tokenId) => {
    setTokenId(tokenId);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
      }}
    >
      <form onSubmit={handleFormSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
      }}>
        <h3 style={{ marginBottom: '10px' }}>Transfer Token</h3>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '10px',
        }}>
          <span style={{ marginBottom: '5px' }}>Receiver Address:</span>
          <input
            type="text"
            value={receiver}
            onChange={(event) => setReceiver(event.target.value)}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid gray',
              width: '500px'
            }}
          />
        </label>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '10px',
        }}>
          <span style={{ marginBottom: '5px' }}>Token ID:</span>
          <input
            type="text"
            value={tokenId}
            onChange={(event) => setTokenId(event.target.value)}
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid gray',
              width: '500px'
            }}
          />
        </label>
        <br />
        <Button variant="primary" type="submit" style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Transfer
        </Button>
      </form>
      <br />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {transferMessage && <p>{transferMessage}</p>}
      {isFilteredDataReady && (
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
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredNFTData.map((data) => (
              <tr
                key={data.tokenId}
                onClick={() => onRowClick(data.tokenId)}
                style={{
                  background: tokenId === data.tokenId ? 'yellow' : 'white',
                  cursor: 'pointer',
                }}
              >
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {data.tokenId}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {data.tokenUri}
                </td>
                <td style={{ border: '1px solid black', padding: '8px' }}>
                  {data.owner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      )}
      
    </div>
  );
};

export default TransferNFT;
