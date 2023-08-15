import client from '../../src/db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
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

    const documents = await collection
      .find(
        {email: validEmail},
        {projection: {name: 1, timestamp: 1, description: 1}}
      )
      .toArray();

    if (documents.length === 0) {
      res.status(404).json({error: 'No projects found'});
    } else {
      res.status(200).json(documents);
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'});
  } finally {
    await client.close();
  }
}
