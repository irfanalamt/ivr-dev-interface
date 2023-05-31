import client from '../../src/db';
import {generateOTP} from '../../src/myFunctions';
import sendEmail from '../../src/sendEmail';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({error: 'Method Not Allowed'});
  }

  const {email} = req.query;

  if (!email) {
    return res.status(400).json({error: 'Invalid password reset request'});
  }

  try {
    await client.connect();
    const usersCollection = client.db('ivrStudio').collection('users');

    const existingUser = await usersCollection.findOne({
      email,
      isEmailVerified: true,
    });

    if (existingUser) {
      const OTP = generateOTP();

      const filter = {email};
      const update = {
        $set: {
          otp: OTP,
        },
      };
      const options = {upsert: true};

      const result = await usersCollection.updateOne(filter, update, options);

      const success = await sendEmail(
        email,
        'Password Reset OTP',
        `Your OTP is: ${OTP}`
      );

      if (success) {
        return res.status(200).json({message: 'OTP successfully sent.'});
      } else {
        return res.status(500).json({message: 'Error, OTP could not be sent.'});
      }
    } else {
      return res.status(404).json({message: 'User not found.'});
    }
  } catch (err) {
    return res.status(401).json({message: err.message});
  } finally {
    await client.close();
  }
}
