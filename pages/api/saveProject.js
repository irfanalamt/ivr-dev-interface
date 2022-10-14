import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(500).json({ message: 'Route not valid' });
    return;
  }

  const client = new MongoClient(process.env.DB_URL);
  await client.connect();
  const db = client.db();
  const collection = db.collection('projects');

  //Close DB connection
  client.close();
}

export default handler;
