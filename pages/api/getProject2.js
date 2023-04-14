import client from '../../src/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({message: 'Method not allowed'});
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

    const query = {email: validEmail, name};

    console.log('query: ' + JSON.stringify(query));

    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({message: 'Document not found'});
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  } finally {
    await client.close();
  }
}
