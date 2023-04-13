import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({message: 'No authorization token found'});
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded);
  } catch (error) {
    console.error(error);
    res.status(401).json({message: 'Invalid authorization token'});
  }
}
