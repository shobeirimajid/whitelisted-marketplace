import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ConnectWallet from '../metamask/walletConnect';

class NavBar extends React.Component {
  render() {
    const { ethereum } = window;

    function handelClick() {
      ethereum.request({
        method: 'eth_requestAccounts',
      });
    }
    return (
      <Navbar
        bg="light"
        className="navbar shadow-sm p-3 mb-5 bg-white rounded"
        expand
      >
        <Button variant="outline-info" onClick={this.props.toggle}>
          <FontAwesomeIcon icon={faAlignLeft} />
        </Button>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto" navbar>
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/mint">
              <Nav.Link>Mint NFT</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/transfer">
              <Nav.Link>Transfer NFT</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/viewNfts">
              <Nav.Link>My NFTs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/viewTransfers">
              <Nav.Link>My Transfers</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/connectWallet">
              <ConnectWallet />
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
