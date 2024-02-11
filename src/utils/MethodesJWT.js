import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Envs from "../config/Envs.js"



export const generateToken = (user) =>
  jwt.sign({ user }, Envs.PRIVATE_KEY, {
    expiresIn: "24h",
  });

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);




