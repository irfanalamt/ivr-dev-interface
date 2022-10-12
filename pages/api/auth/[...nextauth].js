import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email', placeholder: 'abc@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        if (email !== 'admin@gmail.com')
          throw new Error('Invalid Credentials!');

        return { id: '1234', name: 'Irfan', email: 'admin@gmail.com' };
      },
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/signin',
  },
};
export default NextAuth(authOptions);
