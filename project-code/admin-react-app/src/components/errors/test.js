import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function WhitelistUser() {
  const [userAddress, setUserAddress] = useState('');
  const [merkleRoot, setMerkleRoot] = useState('');
  const [message, setMessage] = useState('');
  const [inputWidth, setInputWidth] = useState(480);
  const [isWhitelisted, setWhitelisted] = useState(false);

  const handleInputChange = (e) => {
    setUserAddress(e.target.value);
    setInputWidth((e.target.value.length + 1) * 12); // adjust the input width based on the length of userAddress
  };

  const handleWhitelistUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/merkle/whitelistAddress',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userAddress }),
        }
      );
      const data = await response.json();
      if (data && data.merkleRoot) {
        setMerkleRoot(data.merkleRoot);
        setWhitelisted(true);
        setMessage('Now, please update the merkle root hash in blockchain.');
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong. Please try again.');
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
      <table>
        <tbody>
          <tr>
            <td>Admin Address:</td>
            <td>{adminAddress}</td>
          </tr>
          <tr>
            <td>Merkle Tree Root Hash:</td>
            <td>{merkleRoot}</td>
          </tr>
          <tr>
            <td>RPC URL:</td>
            <td>{rpcUrl}</td>
          </tr>
          <tr>
            <td>Chain ID:</td>
            <td>{chainId}</td>
          </tr>
          <tr>
            <td>Contract Address:</td>
            <td>{contractAddress}</td>
          </tr>
        </tbody>
      </table>

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
                Merkle Tree Root Hash:
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
    </div>
  );
}

export default WhitelistUser;
