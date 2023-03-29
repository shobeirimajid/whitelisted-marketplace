import React from 'react';

class NFTTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nfts: [],
      loading: true,
      error: null,
    };
    this.timer = null;
    this.fetchData = this.fetchData.bind(this);
  }

  async fetchData() {
    try {
      let res = await fetch(
        'http://localhost:8909/api/admin/database/retrieveAllData',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            dbIP: 'localhost',
            dbPort: 27017,
            dbName: 'marketplace_db',
            collectionName: 'nfts',
          }),
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let resJson = await res.json();
      console.log(resJson);
      this.setState({ nfts: resJson.data, loading: false });
      clearInterval(this.timer);
    } catch (error) {
      console.error(error);
      this.setState({ error: error, loading: false });
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { nfts, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (nfts != undefined) {
      return (
        <div>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: 'lightgrey' }}>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Token ID
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Token URI
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Owner Address
                </th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft) => (
                <tr key={nft.tokenId}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.tokenId}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.tokenUri}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {nft.owner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div>
        <h1>Fetching database..</h1>
      </div>
    );
  }
}

export default NFTTable;
