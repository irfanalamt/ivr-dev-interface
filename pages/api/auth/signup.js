import { MongoClient } from 'mongodb';
const bcrypt = require('bcryptjs');

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(500).json({ message: 'Route not valid' });
    return;
  }

  const { email, password } = req.body;
  console.log('🚀 ~ handler ~ { email, password }', { email, password });

  //Connect to mongo
  const client = new MongoClient(process.env.DB_URL);
  await client.connect();
  const db = client.db();
  const collection = db.collection('users');

  const checkExisting = await collection.findOne({ email });
  if (checkExisting) {
    res.status(422).json({ message: 'User already exists' });
    client.close();
    return;
  }
  //Auto-gen salt, hash;
  const hash = bcrypt.hashSync(password, 8);

  // store hashed password
  const status = await collection.insertOne({
    email,
    hash,
  });

  //Send success response
  res.status(201).json({ message: 'User created', ...status });
  //Close DB connection
  client.close();
}

export default handler;
