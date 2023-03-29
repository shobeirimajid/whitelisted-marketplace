import React from 'react';
import classNames from 'classnames';
import { Container } from 'react-bootstrap';
import NavBar from './Navbar';
import { Outlet, Link, BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import WalletDetails from '../metamask/accountData';
import ErrorBoundary from '../errors/errorBoundary';
import Mint from '../primary/mint';
import Transfer from '../primary/transfer';
import ViewNFTs from '../primary/viewNfts';
import ViewTransfers from '../primary/viewTransfers';

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
          <Route exact path="/" element={<>hi</>}></Route>
          <Route
            exact
            path="/mint"
            element={
              <>
                <ErrorBoundary>
                  <Mint />
                </ErrorBoundary>
              </>
            }
          ></Route>
          <Route
            exact
            path="/connectWallet"
            element={
              <>
                <WalletDetails />
              </>
            }
          ></Route>
          <Route
            exact
            path="/transfer"
            element={
              <>
                <Transfer />
              </>
            }
          ></Route>
          <Route
            exact
            path="/viewNfts"
            element={
              <>
                <ViewNFTs />
              </>
            }
          ></Route>
          <Route
            exact
            path="/viewTransfers"
            element={
              <>
                <ViewTransfers />
              </>
            }
          ></Route>
        </Routes>
      </Container>
    );
  }
}

export default Content;
