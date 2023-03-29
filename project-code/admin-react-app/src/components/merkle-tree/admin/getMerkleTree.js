import { useState } from 'react';
import { Button } from 'react-bootstrap';
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

function MerkleTree() {
  const [merkleRoot, getMerkleRoot] = useState('');

  const fetchMerkleRoot = async () => {
    try {
      const response = await fetch(
        'http://localhost:8909/api/common/merkle/getMerkleRoot'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch merkle root');
      }
      const data = await response.json();
      console.log(data);
      getMerkleRoot(data.merkleRoot);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem 0',
      }}
    >
      {merkleRoot ? (
        <p
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'green',
          }}
        >
          Merkle root: {merkleRoot}
        </p>
      ) : (
        <Button variant="primary" onClick={fetchMerkleRoot}>
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Fetch Merkle Tree
        </Button>
      )}
    </div>
  );
}

export default MerkleTree;
