import { create } from 'ipfs-http-client';
const run = async function(){
  const client = create(new URL("http://localhost:5001"));
  const mediaBytes = "SGVsbG8hIFZpamF5"
  const cid = await client.add(Buffer.from(mediaBytes, 'base64'));
  console.log(cid)
}

run()