import * as dotenv from "dotenv";
dotenv.config();


console.log(process.env.DATABASE_URL);


export const Data = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  DATABASE_NAME: process.env.DATABASE_NAME,
  PORT: process.env.PORT,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
};