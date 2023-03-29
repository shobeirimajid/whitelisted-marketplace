import React, { useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import Web3 from 'web3';

function ConnectWallet() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [chainId, setChainId] = useState('');

  const { ethereum } = window;

  async function connectWallet() {
    if (!ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      setAccount(account);

      const web3 = new Web3(ethereum);
      const balance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(balance, 'ether'));

      const chainId = await web3.eth.getChainId();
      setChainId(chainId);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {account ? (
        <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            {`${account}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >{`Balance: ${balance} ETH`}</Dropdown.Item>
            <Dropdown.Item
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >{`ChainId: ${chainId}`}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button variant="outline-info" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default ConnectWallet;
