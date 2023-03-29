import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function RemoveWhitelisted() {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [isRemoved, setRemoved] = useState(false);
  const [inputWidth, setInputWidth] = useState(480);
  const [message, setMessage] = useState('');

  const removeAddressFromWhitelist = (addressToRemove) => {
    const newWhitelist = whitelistedAddresses.filter(
      (address) => address !== addressToRemove
    );
    setWhitelistedAddresses(newWhitelist);
  };

  const handleCellClick = (value) => {
    setSelectedAddress(value);
  };

  const handleInputChange = (e) => {
    setSelectedAddress(e.target.value);
    setInputWidth((e.target.value.length + 1) * 12); // adjust the input width based on the length of userAddress
  };

  const handleRemoveWhitelisted = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userAddress: selectedAddress }),
    };
    try {
      const response = await fetch(
        'http://localhost:8909/api/admin/merkle/removeWhitelisted',
        requestOptions
      );
      const data = await response.json();
      if (data && data.merkleRoot) {
        setMerkleRoot(data.merkleRoot);
        setRemoved(true);
        removeAddressFromWhitelist(selectedAddress);
        setMessage('Now, please update the merkle root hash in blockchain.');
      } else {
        setMessage('Unexpected response from the server.');
      }
    } catch (error) {
      setMessage('Unexpected response from the server.');
      console.error('Error removing whitelisted address: ', error);
    }
  };

  useEffect(() => {
    const fetchWhitelistedAddresses = async () => {
      try {
        const response = await fetch(
          'http://localhost:8909/api/get/common/getWhitelistedAddresses'
        );
        const data = await response.json();
        setWhitelistedAddresses(data.addresses);
      } catch (error) {
        console.error('Error fetching whitelisted addresses: ', error);
      }
    };
    fetchWhitelistedAddresses();
  }, []);

  const rows = [];
  let currentRow = [];
  whitelistedAddresses.forEach((address) => {
    currentRow.push(
      <td
        onClick={() => handleCellClick(address)}
        key={address}
        style={{
          width: '33.33%',
          textAlign: 'left',
          cursor: 'pointer', // add cursor property
        }}
      >
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
      {!isRemoved && (
        <form
          onSubmit={handleRemoveWhitelisted}
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
            Remove Whitelisted User
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
              value={selectedAddress}
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
            onClick={handleRemoveWhitelisted}
            disabled={!selectedAddress}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Remove
          </Button>
          <br />
          <span>{message}</span>
        </form>
      )}
      {isRemoved && (
        <Table striped bordered hover>
          <thead style={{ backgroundColor: '#333', color: '#fff' }}>
            <tr>
              <th>User Address</th>
              <th>Updated Merkle Root Hash</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#ddd' }}>
              <td>{selectedAddress}</td>
              <td>{merkleRoot}</td>
            </tr>
          </tbody>
        </Table>
      )}
      <br />
      {isRemoved && message && (
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
      <br />
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

export default RemoveWhitelisted;
