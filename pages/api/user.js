import client from '../../src/db';
import {generateOTP} from '../../src/myFunctions';
import sendEmail from '../../src/sendEmail';

async function user(req, res) {
  if (req.method === 'POST') {
    const {name, email} = req.body;

    try {
      await client.connect();

      const usersCollection = client.db('ivrStudio').collection('users');
      const existingUser = await usersCollection.findOne({
        email,
        isEmailVerified: true,
      });

      if (existingUser) {
        return res.status(409).json({message: 'Email already registered.'});
      }

      const OTP = generateOTP();

      const filter = {email};
      const update = {
        $set: {
          name,
          email,
          timestamp: Date.now(),
          otp: OTP,
          isEmailVerified: false,
        },
      };
      const options = {upsert: true};

      const result = await usersCollection.updateOne(filter, update, options);

      const success = await sendEmail(
        email,
        'Email Verification OTP',
        `Your OTP is: ${OTP}`
      );

      if (success) {
        return res.status(200).json({message: 'OTP successfully sent.'});
      } else {
        return res.status(500).json({message: 'Error, OTP could not be sent.'});
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal Server Error.'});
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({message: 'Method not allowed.'});
  }
}

export default user;
