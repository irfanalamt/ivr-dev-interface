import client from '../../src/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {token, email} = req.query;

  if (!token || !email) {
    return res.status(400).json({error: 'Invalid verification request'});
  }

  try {
    await client.connect();
    const usersCollection = client.db('ivrStudio').collection('users');

    const query = {otp: parseInt(token), email};
    const update = {$set: {isEmailVerified: true}};
    const result = await usersCollection.updateOne(query, update);

    if (result.matchedCount === 1 && result.modifiedCount === 1) {
      return res.status(200).json({message: 'Email verified successfully.'});
    } else if (result.matchedCount === 0) {
      return res.status(404).json({message: 'Invalid OTP. Please try again.'});
    } else {
      return res
        .status(500)
        .json({message: 'Failed to update email verification.'});
    }
  } catch (err) {
    return res.status(401).json({message: err.message});
  } finally {
    await client.close();
  }
}
