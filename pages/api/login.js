import {authenticateUser} from '../../src/auth';
import client from '../../src/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {email, password} = req.body;

    try {
      await client.connect();
      const usersCollection = client.db('ivrStudio').collection('users');
      const token = await authenticateUser(email, password, usersCollection);
      res.status(200).json({token});
    } catch (error) {
      res.status(401).json({message: error.message});
    }
  } else {
    res.status(405).json({message: 'Method Not Allowed'});
  }
}
