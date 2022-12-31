import { MongoClient } from 'mongodb';
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(500).json({ message: 'Route not valid' });
    return;
  }

  const { email } = req.query;
  console.log('email from server:', email);

  //Connect to mongo
  const client = new MongoClient(process.env.DB_URL);
  await client.connect();
  const db = client.db();
  const collection = db.collection('projects');

  const doc = await collection.findOne(
    { email },
    {
      projection: { _id: 0, email: 0 },
    }
  );
  if (!doc) {
    res.status(201).json({ message: null, projects: [] });
    client.close();
    return;
  }

  console.log('doc', doc);

  res.status(201).json({ message: 'FOUND', projects: doc });
  client.close();
}
