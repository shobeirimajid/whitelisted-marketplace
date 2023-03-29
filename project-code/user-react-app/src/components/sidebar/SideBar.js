import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Button } from 'react-bootstrap';
import classNames from 'classnames';

class SideBar extends React.Component {
  render() {
    return (
      <div className={classNames('sidebar', { 'is-open': this.props.isOpen })}>
        <div className="sidebar-header">
          <Button
            variant="link"
            onClick={this.props.toggle}
            style={{ color: '#fff' }}
            className="mt-4"
          >
            <FontAwesomeIcon icon={faTimes} pull="right" size="xs" />
          </Button>
          <h3>NFT Marketplace</h3>
        </div>

        <Nav className="flex-column pt-2">
          <p className="ml-3">Menu</p>

          <Nav.Item className="active">
            <LinkContainer to="/">
              <Nav.Link>
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Home
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/mint">
              <Nav.Link>
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                Mint NFT
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/transfer">
              <Nav.Link>
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                Transfer NFT
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/viewNfts">
              <Nav.Link>
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                My NFTs
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to="/viewTransfers">
              <Nav.Link>
                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                My Transfers
              </Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default SideBar;
