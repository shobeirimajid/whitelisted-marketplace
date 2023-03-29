import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';

class NavBar extends React.Component {
  render() {
    // const { ethereum } = window;

    // function handelClick() {
    //   ethereum.request({
    //     method: 'eth_requestAccounts',
    //   });
    // }
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
            <LinkContainer to="/deployContract">
              <Nav.Link>Deploy Contract</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/updateRoot">
              <Nav.Link>Update Merkle Root</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/whitelistAddress">
              <Nav.Link>Whitelist Address</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/removeWhitelisted">
              <Nav.Link>Remove Whitelisted</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/fetchNfts">
              <Nav.Link>Fetch NFTs</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/fetchTransfers">
              <Nav.Link>Fetch Transfers</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
