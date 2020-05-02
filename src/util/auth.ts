import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './secrets';

export function verifyJWTToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
}

export function createJWToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '10y',
    algorithm: 'HS256',
  });
}
