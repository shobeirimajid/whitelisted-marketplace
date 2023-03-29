import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';
import NavBar from './Navbar';
import { Outlet, Link, BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import MerkleTree from '../merkle-tree/admin/getMerkleTree';
import NFTTable from '../database/admin/NFTData';
import ErrorBoundary from '../errors/errorBoundary';
import TransfersTable from '../database/admin/TransfersData';
import MarketplaceTable from '../contract/admin/getContractData';
import DeployContract from '../contract/admin/deployContract';
import WhitelistUser from '../merkle-tree/admin/whitelistUser';
import RemoveWhitelisted from '../merkle-tree/admin/removeWhitelisted';
import UpdateRoot from '../contract/admin/updateRoot';

class Content extends React.Component {
  render() {
    return (
      <Container
        fluid
        className={classNames('content', { 'is-open': this.props.isOpen })}
      >
        <NavBar toggle={this.props.toggle} />
        <Outlet></Outlet>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <h1
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '32px',
                    textAlign: 'center',
                    marginTop: '50px',
                  }}
                >
                  Welcome to the Admin Dashboard!
                </h1>
                <MerkleTree />
                <MarketplaceTable />
              </>
            }
          ></Route>
          <Route
            exact
            path="/deployContract"
            element={
              <>
                <ErrorBoundary>
                  <DeployContract />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/updateRoot"
            element={
              <>
                <ErrorBoundary>
                  <UpdateRoot />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/whitelistAddress"
            element={
              <>
                <ErrorBoundary>
                  <WhitelistUser />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/removewhitelisted"
            element={
              <>
                <ErrorBoundary>
                  <RemoveWhitelisted />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/fetchNfts"
            element={
              <>
                <ErrorBoundary>
                  <NFTTable />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/fetchTransfers"
            element={
              <>
                <ErrorBoundary>
                  <TransfersTable />
                </ErrorBoundary>
              </>
            }
          ></Route>
        </Routes>
      </Container>
    );
  }
}

export default Content;
