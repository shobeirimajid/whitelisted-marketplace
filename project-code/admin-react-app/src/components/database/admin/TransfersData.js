import React from 'react';

class TransfersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transfers: [],
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
            collectionName: 'transfers',
          }),
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      let resJson = await res.json();
      console.log(resJson);
      this.setState({ transfers: resJson.data, loading: false });
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
    const { transfers, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (transfers != undefined) {
      return (
        <div>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: 'lightgrey' }}>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Token ID
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Sender
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Receiver
                </th>
                <th style={{ border: '1px solid black', padding: '8px' }}>
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer._id}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {transfer.tokenId}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {transfer.sender}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {transfer.receiver}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    {transfer.transactionId}
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

export default TransfersTable;
