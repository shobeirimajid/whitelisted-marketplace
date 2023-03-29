import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function WhitelistUser() {
  const [userAddress, setUserAddress] = useState('');
  const [merkleRoot, setMerkleRoot] = useState('');
  const [message, setMessage] = useState('');
  const [inputWidth, setInputWidth] = useState(480);
  const [isWhitelisted, setWhitelisted] = useState(false);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

  useEffect(() => {
    const getWhitelistedAddresses = async () => {
      try {
        const response = await fetch(
          'http://localhost:8909/api/get/common/getWhitelistedAddresses'
        );
        const data = await response.json();
        if (data && data.addresses) {
          setWhitelistedAddresses(data.addresses);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getWhitelistedAddresses();
  }, []);

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
        setWhitelistedAddresses([...whitelistedAddresses, userAddress]);
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  const rows = [];
  let currentRow = [];
  whitelistedAddresses.forEach((address) => {
    currentRow.push(
      <td key={address} style={{ width: '33.33%', textAlign: 'left' }}>
        {address}
      </td>
    );
    if (currentRow.length === 3) {
      rows.push(<tr key={currentRow}>{currentRow}</tr>);
      currentRow = [];
    }
  });
  if (currentRow.length > 0) {
    // add the remaining addresses as a new row
    rows.push(<tr key={currentRow}>{currentRow}</tr>);
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
      {!isWhitelisted && (
        <form
          onSubmit={handleWhitelistUser}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px',
          }}
        >
          <h3
            style={{
              marginBottom: '10px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: '#007bff',
            }}
          >
            Whitelist User
          </h3>
          <br />
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}
          >
            <span style={{ marginBottom: '5px' }}>User Address:</span>
            <input
              type="text"
              value={userAddress}
              onChange={handleInputChange}
              style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid gray',
                width: `${inputWidth}px`,
              }}
            />
          </label>
          <br />
          <Button
            variant="primary"
            onClick={handleWhitelistUser}
            disabled={!userAddress}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Whitelist
          </Button>
          <br />
          <span>{message}</span>
        </form>
      )}
      {isWhitelisted && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '20px',
          }}
        >
          <h3
            style={{
              marginBottom: '10px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: '#007bff',
            }}
          >
            User Whitelisted
          </h3>
          <br />
          <Table striped bordered hover>
            <thead style={{ backgroundColor: '#333', color: '#fff' }}>
              <tr>
                <th>User Address</th>
                <th>Updated Merkle Root Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#ddd' }}>
                <td>{userAddress}</td>
                <td>{merkleRoot}</td>
              </tr>
            </tbody>
          </Table>

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
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '20px',
        }}
      >
        <h3
          style={{
            marginBottom: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            color: '#007bff',
          }}
        >
          Whitelisted Users
        </h3>
        <br />
        <Table
          style={{ width: '100%', tableLayout: 'fixed' }}
          striped
          bordered
          hover
        >
          <thead style={{ backgroundColor: '#343a40', color: '#fff' }}>
            <tr>
              <th style={{ width: '33.33%', textAlign: 'left' }}>
                User Address
              </th>
              <th style={{ width: '33.33%', textAlign: 'left' }}>
                User Address
              </th>
              <th style={{ width: '33.33%', textAlign: 'left' }}>
                User Address
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
}

export default WhitelistUser;
