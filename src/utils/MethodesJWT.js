import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();


export const generateToken = (user) =>
  jwt.sign({ user }, process.env.PRIVATE_KEY, {
    expiresIn: "24h",
  });

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);




