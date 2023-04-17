import client from '../../src/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.status(405).json({error: 'Method not allowed.'});
    return;
  }

  const {name} = req.query;
  const token = req.headers.authorization;

  try {
    await client.connect();
    const db = client.db('ivrStudio');
    const collection = db.collection('projects');

    let validEmail = '';
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      validEmail = decoded.email;
    } else {
      validEmail = 'guest';
    }

    const result = await collection.deleteOne({name, email: validEmail});

    console.log('name', name, validEmail);
    console.log('result: ' + JSON.stringify(result));

    res.status(200).json({message: `Deleted ${name}.`});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error deleting document'});
  } finally {
    await client.close();
  }
}
