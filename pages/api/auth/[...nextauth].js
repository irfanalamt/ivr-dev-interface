import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        // if (email !== 'admin@gmail.com')
        //   throw new Error('Invalid Credentials!');

        const client = await MongoClient.connect(process.env.DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        //Find user with the email
        const result = await client.db().collection('users').findOne({
          email,
        });
        if (!result) {
          client.close();
          throw new Error('No user found with the email');
        }

        if (password !== result.password) {
          client.close();
          throw new Error('Password doesnt match');
        }
        client.close();
        return { email: result.email };
      },
    }),
    // ...add more providers here
  ],
  database: process.env.DB_URL,
  pages: {
    signIn: '/signin',
  },
};
export default NextAuth(authOptions);
