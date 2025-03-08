import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
  //console.log("req.body = ", req.body);
  //console.log("req.query = ", req.query);
  //console.log("req.headers = ", req.headers);
  
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    console.log('No token found');
    return { user: null };  // Ensure context.user is set, even if null
  }

  try {
    const decodedUser: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    return { user: decodedUser }; // Return an object with user
  } catch (error) {
    console.log('Invalid Token:', error);
    return { user: null }; // Return null user on failure
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '2h' });
};


export class AuthenticationError extends GraphQLError {
  constructor(message: string){
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}