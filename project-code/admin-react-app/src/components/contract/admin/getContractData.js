import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

class MarketplaceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marketplaceData: null,
      loading: false,
      error: null,
      showTable: false,
      showButton: true, // Add new state variable to track button visibility
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchDataClick = this.handleFetchDataClick.bind(this);
  }

  async fetchData() {
    try {
      let res = await fetch(
        'http://localhost:8909/api/admin/marketplace/getMarketplaceData',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let resJson = await res.json();
      console.log(resJson);
      this.setState({
        marketplaceData: resJson,
        loading: false,
        showTable: true,
        showButton: false,
      }); // Update showButton state variable
    } catch (error) {
      console.error(error);
      this.setState({ error: error, loading: false, showTable: false });
    }
  }

  handleFetchDataClick() {
    this.setState({ loading: true });
    this.fetchData();
  }

  render() {
    const { marketplaceData, loading, error, showTable, showButton } =
      this.state;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem 0',
        }}
      >
        {showButton && ( // Render button only if showButton is true
          <Button
            variant="primary"
            onClick={this.handleFetchDataClick}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Fetch Marketplace Data
          </Button>
          // <button onClick={this.handleFetchDataClick} disabled={loading}>
          //   Fetch Marketplace Data
          // </button>
        )}
        {showTable && (
          <>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {marketplaceData && marketplaceData.isUpdated && (
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
                        Contract Address:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.contractAddress}
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
                        Admin Address:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.adminAddress}
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
                        {marketplaceData.rpcUrl}
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
                        {marketplaceData.chainId}
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
                        Collectible Name:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.erc721CollectibleName}
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
                        Collectible Symbol:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.erc721CollectibleSymbol}
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
                        IPFS Gateway URL:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.ipfsGatewayUrl}
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
                        Deploy transaction hash:
                      </td>
                      <td style={{ padding: '5px', border: '1px solid black' }}>
                        {marketplaceData.transactionHash}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {showTable &&
          !showButton &&
          !marketplaceData.isUpdated && ( // show message if neither table nor button is visible
            <p
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'red',
              }}
            >
              Contract is not deployed. Please deploy!
            </p>
          )}
      </div>
    );
  }
}

export default MarketplaceTable;
