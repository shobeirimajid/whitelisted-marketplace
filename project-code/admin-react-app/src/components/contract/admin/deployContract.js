import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function DeployContract() {
  const [merkleRoot, setMerkleRoot] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [adminPrivateKey, setAdminPrivateKey] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [chainId, setChainId] = useState('');
  const [collectibleName, setCollectibleName] = useState('');
  const [collectibleSymbol, setCollectibleSymbol] = useState('');
  const [ipfsGatewayUrl, setIpfsGatewayUrl] = useState('');
  const [isInitialDataFetched, setInitialDataFetched] = useState(false);
  const [isSecondaryDataFetched, setSecondaryDataFetched] = useState(false);
  const [isContractdeployed, setContractDeployed] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [error, setError] = useState('');

  const handleGetMarketplaceData = async () => {
    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/marketplace/getMarketplaceData'
      );
      const data = await response.json();
      setMerkleRoot(data.merkleRoot);
      setAdminAddress(data.adminAddress);
      setAdminPrivateKey(data.adminPrivateKey);
      setInitialDataFetched(true);
      if (data.isUpdated) {
        setContractDeployed(true);
        setMarketplaceData(data);
      }
    } catch (error) {
      setError('Error fetching marketplace data.');
    }
  };

  const handleSetMarketplaceData = async (event) => {
    event.preventDefault();
    try {
      console.log(
        'handling set marketplace data: ',
        collectibleName,
        collectibleSymbol
      );
      const response = await fetch(
        'http://localhost:8909/api/admin/marketplace/setMarketplaceData',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rpcUrl,
            chainId,
            collectibleName,
            collectibleSymbol,
            ipfsGatewayUrl,
          }),
        }
      );
      const data = await response.json();
      if (data.status) {
        setMarketplaceData({
          ...data,
          rpcUrl,
          chainId,
          collectibleName,
          collectibleSymbol,
          ipfsGatewayUrl,
        });
        setSecondaryDataFetched(true);
      } else {
        setError('Error setting marketplace data.');
      }
    } catch (error) {
      setError('Error setting marketplace data.');
    }
  };

  const handleDeployContract = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/contract/deployContract',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderAddress: adminAddress,
            senderPrivateKey: adminPrivateKey,
            rpcUrl,
            chainId,
            merkleTreeRootHash: merkleRoot,
            erc721CollectibleName: collectibleName,
            erc721CollectibleSymbol: collectibleSymbol,
            ipfsGatewayUrl,
          }),
        }
      );
      const data = await response.json();
      if (data.receipt && data.marketplaceData) {
        setReceipt(data.receipt);
        console.log('the data in deploy: ', data);
        setMarketplaceData(data.marketplaceData);
        setContractDeployed(true);
      } else {
        setError('Error deploying contract.');
      }
    } catch (error) {
      setError('Error deploying contract.');
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
      {!isInitialDataFetched && (
        <Button variant="primary" onClick={handleGetMarketplaceData}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Fetch Initial Marketplace Data
        </Button>
      )}
      {!isContractdeployed && merkleRoot && adminAddress && adminPrivateKey && (
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
              Fetched Initial Data of Marketplace
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
                  Admin Address:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {adminAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {!isContractdeployed && <br />}
      {!isContractdeployed && marketplaceData && (
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
              Fetched Secondary Data
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
                  RPC URL:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.rpcUrl}
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
                  {marketplaceData.chainId}
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
                  ERC721 Collectible Name:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.collectibleName}
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
                  ERC721 Collectible Symbol:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.collectibleSymbol}
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
                  IPFS Gateway URL:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.ipfsGatewayUrl}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {!isContractdeployed && <br />}
      {!isContractdeployed && !isSecondaryDataFetched && (
        <form
          onSubmit={handleSetMarketplaceData}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>
            Set Secondary Marketplace Data
          </h3>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>RPC URL:</span>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
              }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>Chain ID:</span>
            <input
              type="text"
              value={chainId}
              onChange={(e) => setChainId(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
              }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>
              ERC721 Collectible Name:
            </span>
            <input
              type="text"
              value={collectibleName}
              onChange={(e) => setCollectibleName(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
              }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>
              ERC721 Collectible Symbol:
            </span>
            <input
              type="text"
              value={collectibleSymbol}
              onChange={(e) => setCollectibleSymbol(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
              }}
            />
          </label>
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>IPFS Gateway URL:</span>
            <input
              type="text"
              value={ipfsGatewayUrl}
              onChange={(e) => setIpfsGatewayUrl(e.target.value)}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
              }}
            />
          </label>
          <br />
          <Button variant="primary" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Submit
          </Button>
        </form>
      )}
      {!isContractdeployed && <br />}
      {!isContractdeployed &&
        merkleRoot &&
        adminAddress &&
        adminPrivateKey &&
        marketplaceData && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem 0',
            }}
          >
            <h3>All data collected, please deploy!</h3>
            <br />
            <Button variant="primary" onClick={handleDeployContract}>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Deploy
            </Button>
          </div>
        )}
      {isContractdeployed && marketplaceData && (
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
                  Contract Address:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.contractAddress}
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
                  Admin Address:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.adminAddress}
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
                  {marketplaceData.rpcUrl}
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
                  {marketplaceData.chainId}
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
                  ERC721 Collectible Name:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.erc721CollectibleName}
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
                  ERC721 Collectible Symbol:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.erc721CollectibleSymbol}
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
                  IPFS Gateway URL:
                </td>
                <td style={{ padding: '5px', border: '1px solid black' }}>
                  {marketplaceData.ipfsGatewayUrl}
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
                  {marketplaceData.merkleRoot}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {receipt && (
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
              Deployed Contract Transaction Data
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
                  Deployer Address:
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
                  {receipt.contractAddress}
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
      )}
      {isContractdeployed && !isSecondaryDataFetched && (
        <>
          <p
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'green',
            }}
          >
            Contract is already deployed!
          </p>
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default DeployContract;
