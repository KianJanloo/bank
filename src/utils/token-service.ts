import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_TOKEN_EXPIRY = 15 * 60;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

interface UserPayload {
  id: number;
  email: string;
  phoneNumber: string;
}

const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyRefreshToken = (token: string): Promise<UserPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(new Error('Refresh token is undefined'));
      else resolve(decoded as UserPayload);
    });
  });
};

const verifyAccessToken = (token: string): Promise<UserPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) reject(new Error('Access token is undefined'));
      else resolve(decoded as UserPayload);
    });
  });
};

export {
  verifyRefreshToken,
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
};
