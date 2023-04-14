import client from '../../src/db';
import jwt from 'jsonwebtoken';

async function saveProject2(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }
  try {
    const {email, name, shapes, tabs, shapeCount, userVariables, token} =
      req.body;

    let validEmail = '';

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      validEmail = decoded.email;
    } else {
      validEmail = 'guest';
    }

    await client.connect();
    const db = client.db('ivrStudio');

    const filter = {email: validEmail, name};

    const update = {
      $set: {email: validEmail, name, shapes, tabs, shapeCount, userVariables},
    };
    const options = {upsert: true};

    const result = await db
      .collection('projects')
      .updateOne(filter, update, options);

    res.status(200).json({message: 'Project saved successfully', result});
  } catch (err) {
    console.log('Failed to insert document', err);
    res.status(500).json({message: 'Failed to save project'});
  } finally {
    await client.close();
  }
}

export default saveProject2;
