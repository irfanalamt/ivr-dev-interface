import { MongoClient } from 'mongodb';
async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    //basic validation
    // if (!email || !email.includes('@') || !password) {
    //   res.status(422).json({ message: 'Invalid Data' });
    //   return;
    // }

    const client = await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();

    const checkExisting = await db.collection('users').findOne({ email });
    if (checkExisting) {
      res.status(422).json({ message: 'User already exists' });
      client.close();
      return;
    }

    const status = await db.collection('users').insertOne({
      email,
      password,
    });
    //Send success response
    res.status(201).json({ message: 'User created', ...status });
    //Close DB connection
    client.close();
  } else {
    //Response for other than POST method
    res.status(500).json({ message: 'Route not valid' });
  }
}

export default handler;
