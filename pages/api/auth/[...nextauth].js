import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const bcrypt = require('bcryptjs');

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email', placeholder: 'abc@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // Connect to mongo
        const client = new MongoClient(process.env.DB_URL);
        await client.connect();
        const db = client.db();
        const collection = db.collection('users');

        //Find user with the email
        const result = await collection.findOne({
          email,
        });

        if (!result) {
          client.close();
          throw new Error('No user found with the email');
        }

        // check password from body with hash in DB
        const isPasswordValid = await bcrypt.compare(password, result.hash);

        if (isPasswordValid !== true) {
          client.close();
          throw new Error('Password doesnt match');
        }

        client.close();
        return { email: result.email };
      },
    }),
    // ...add more providers here
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXT_SECRET,
  database: process.env.DB_URL,
  pages: {
    signIn: '/signin',
  },
};
export default NextAuth(authOptions);
