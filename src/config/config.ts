import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  salt: process.env.SALT,
  jwt: process.env.JWT_SECRET,
  mongoUrlDev: process.env.MONGO_URL,
  mongoUrlPro: process.env.MONGO_URL_PRO,
};
