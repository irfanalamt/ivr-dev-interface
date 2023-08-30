import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

async function createToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
}

async function verifyToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function comparePasswords(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

async function authenticateUser(email, password, users) {
  const user = await users.findOne({email});

  if (!user) {
    throw new Error('User not found.');
  }

  const match = await comparePasswords(password, user.password);
  if (!match) {
    throw new Error('Incorrect password.');
  }

  const token = await createToken({name: user.name, email: user.email});
  return token;
}

export {authenticateUser, verifyToken};
