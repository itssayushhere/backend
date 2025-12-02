import jwt from 'jsonwebtoken';
export const generateToken = (data : object) => {
  return jwt.sign({ ...data }, process.env.JWT_SECRET, { expiresIn: '30d' });
};