import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function UpdateRoot() {
  const [merkleRoot, setMerkleRoot] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [adminPrivateKey, setAdminPrivateKey] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [marketplaceDataFetched, setMarketplaceDataFetched] = useState(false);
  const [updateRootButtonEnabled, setUpdateRootButtonEnabled] = useState(false);
  const [updateRootResponse, setUpdateRootResponse] = useState(null);
  const [isMerkleRootFetched, setMerkleRootFetched] = useState(false);
  const [isRootUpdated, setRootUpdated] = useState(false);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState('');

  const fetchMerkleRoot = async () => {
    try {
      const response = await fetch(
        'http://localhost:8909/api/common/merkle/getMerkleRoot'
      );
      const data = await response.json();
      if (data && data.merkleRoot) {
        setMerkleRoot(data.merkleRoot);
        setMerkleRootFetched(true);
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setMessage('Unexpected response from the server.');
      console.error('Error fetching merkle root:', error);
    }
  };

  const fetchMarketplaceData = async () => {
    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/marketplace/getMarketplaceData'
      );
      const data = await response.json();
      if (data.Error == undefined) {
        setAdminAddress(data.adminAddress);
        setAdminPrivateKey(data.adminPrivateKey);
        setRpcUrl(data.rpcUrl);
        setChainId(data.chainId);
        setContractAddress(data.contractAddress);
        setMarketplaceDataFetched(true);
        setUpdateRootButtonEnabled(true);
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setMessage('Unexpected response from the server.');
      console.error('Error fetching marketplace data:', error);
    }
  };

  const updateRootOnBlockchain = async () => {
    const requestData = {
      senderAddress: adminAddress,
      senderPrivateKey: adminPrivateKey,
      rpcUrl,
      chainId,
      contractAddress,
      merkleTreeRootHash: merkleRoot,
      functionName: 'updateRoot',
    };

    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/contract/invokeContract',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      if (data.Error == undefined) {
        setUpdateRootResponse(data);
        setRootUpdated(true);
        setReceipt(data);
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setMessage('Unexpected response from the server.');
      console.error('Error updating root on blockchain:', error);
    }
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
      {!isMerkleRootFetched && (
        <Button variant="primary" onClick={fetchMerkleRoot}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Fetch Merkle Root
        </Button>
      )}
      {!marketplaceDataFetched && (
        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'green',
          }}
        >
          Merkle root: {merkleRoot}
        </p>
      )}
      <br />
      {message && (
        <p
          style={{
            marginTop: '10px',
            color: 'red',
            padding: '5px',
            border: '1px solid red',
            borderRadius: '5px',
            backgroundColor: '#ffe6e6',
          }}
        >
          {message}
        </p>
      )}
      {!marketplaceDataFetched && (
        <Button variant="primary" onClick={fetchMarketplaceData}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Fetch Marketplace Data
        </Button>
      )}
      {marketplaceDataFetched && (
        <div>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              border: '1px solid black',
            }}
          >
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
              Marketplace Data
            </caption>
            <tbody>
              <tr>
                <td
                  style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black',
                  }}
                >
                  Admin Address:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {adminAddress}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black',
                  }}
                >
                  Merkle Root:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {merkleRoot}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black',
                  }}
                >
                  RPC URL:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {rpcUrl}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black',
                  }}
                >
                  Chain ID:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {chainId}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    backgroundColor: '#F0F0F0',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    padding: '5px',
                    border: '1px solid black',
                  }}
                >
                  Contract Address:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {contractAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <br />
      {marketplaceDataFetched && !isRootUpdated && (
        <Button
          variant="primary"
          onClick={updateRootOnBlockchain}
          disabled={!updateRootButtonEnabled}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Update Merkle Root on Chain
        </Button>
      )}
      {receipt && (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem 0',
            }}
          >
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                border: '1px solid black',
              }}
            >
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
                Invoked Transaction Data - UpdateRoot
              </caption>
              <tbody>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Block Hash:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.blockHash}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Block Number:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.blockNumber}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Invoker Address:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.senderAddress}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Contract Address:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.receiverAddress}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Transaction Hash:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.transactionHash}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: '#F0F0F0',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      padding: '5px',
                      border: '1px solid black',
                    }}
                  >
                    Gas Used:
                  </td>
                  <td style={{ padding: '5px', border: '1px solid black' }}>
                    {receipt.gasUsed}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'green',
            }}
          >
            Merkle tree root is updated in contract successfully!
          </p>
        </>
      )}
    </div>
  );
}
export default UpdateRoot;
