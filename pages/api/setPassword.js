import client from '../../src/db';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({error: 'Method Not Allowed'});
    }

    const {email, password} = req.body;

    await client.connect();
    const usersCollection = client.db('ivrStudio').collection('users');

    const existingUser = await usersCollection.findOne({
      email,
      isEmailVerified: true,
    });

    if (existingUser) {
      existingUser.password = password;
      await usersCollection.updateOne(
        {_id: existingUser._id},
        {$set: {password}}
      );
      return res.status(200).json({message: 'Password updated successfully.'});
    } else {
      return res
        .status(404)
        .json({message: 'User not found or email not verified.'});
    }
  } catch (err) {
    return res.status(401).json({message: err.message});
  } finally {
    await client.close();
  }
}
