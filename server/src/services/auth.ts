import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is sent in the authorization header, extract the token from the header
  if(req.headers.authorization){
    token = token.split(' ').pop().trim();
  }

  if(!token){
    return req;
  }

  try{
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '2hr' });
    req.user = data;
  }catch (error){
    console.log('invalid token');
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