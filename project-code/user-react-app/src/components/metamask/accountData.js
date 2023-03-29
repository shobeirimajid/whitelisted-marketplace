import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Table } from 'react-bootstrap';

function WalletDetails() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnected(true);
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        const web3 = new Web3(window.ethereum);
        const account = accounts[0];
        setAccount(account);
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, 'ether'));
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      {isConnected ? (
        account ? (
          <Table bordered style={{ maxWidth: '600px', margin: '0 auto' }}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Account Address</th>
                <th style={{ width: '35%' }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>{account}</td>
                <td style={{ fontWeight: 'bold' }}>{`${balance} ETH`}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>Connect to the wallet to fetch account details!</p>
        )
      ) : (
        <p>Please connect to MetaMask to use this feature.</p>
      )}
    </div>
  );
}

export default WalletDetails;
