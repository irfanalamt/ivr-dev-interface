import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(500).json({ message: 'Route not valid' });
    return;
  }

  const { email, projectName, shapes } = req.body;

  console.log('log from server:', { email, projectName, shapes });

  const client = new MongoClient(process.env.DB_URL);
  await client.connect();
  const db = client.db();
  const collection = db.collection('projects');

  //Close DB connection
  client.close();
}

export default handler;
