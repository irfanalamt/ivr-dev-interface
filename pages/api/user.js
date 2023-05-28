import client from '../../src/db';
import {
  generateConfirmationLink,
  generateEmailToken,
} from '../../src/myFunctions';
import sendEmail from '../../src/sendEmail';

async function user(req, res) {
  if (req.method === 'POST') {
    const {name, email, password} = req.body;

    try {
      await client.connect();

      const usersCollection = client.db('ivrStudio').collection('users');
      const existingUser = await usersCollection.findOne({email});

      if (existingUser) {
        return res.status(409).json({message: 'Email already registered'});
      }

      const emailToken = generateEmailToken();
      const confirmationLink = generateConfirmationLink(email, emailToken);

      const result = await usersCollection.insertOne({
        name,
        email,
        password,
        timestamp: Date.now(),
        emailToken,
        isEmailVerified: false,
      });

      const success = await sendEmail(
        'irfanalamt@gmail.com',
        'Test Email',
        `This is a test email from IVR STUDIO. ${confirmationLink}`
      );

      if (success) {
        console.log('Email sent successfully!');
      } else {
        console.log('Failed to send email.');
      }

      return res
        .status(201)
        .json({message: 'Details saved. Pending admin approval.'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal Server Error'});
    } finally {
      await client.close();
    }
  }
}

export default user;
