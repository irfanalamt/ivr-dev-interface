import client from '../../src/db';

async function user(req, res) {
  if (req.method === 'POST') {
    const {name, email, password} = req.body;

    try {
      await client.connect();

      const usersCollection = client.db('ivrStudio').collection('users');
      const existingUser = await usersCollection.findOne({email});

      if (existingUser) {
        res.status(409).json({message: 'Email already registered'});
      } else {
        const result = await usersCollection.insertOne({name, email, password});
        res
          .status(201)
          .json({message: 'Details saved. Pending admin approval.'});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Internal Server Error'});
    } finally {
      await client.close();
    }
  }
}

export default user;
