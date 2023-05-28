export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {token, email} = req.query;

  if (token && email) {
    try {
      await client.connect();
      const usersCollection = client.db('ivrStudio').collection('users');

      // Check if user has one document with the same email and token, if so set the property 'isValidEmail' of the document to true.

      await usersCollection.updateOne(
        {email, emailToken: token},
        {$set: {isEmailVerified: true}}
      );

      res.status(200).json({message: 'Email confirmed successfully'});
    } catch (err) {
      res.status(401).json({message: err.message});
    } finally {
      await client.close();
    }
  } else {
    res.status(400).json({error: 'Invalid confirmation link'});
  }
}
