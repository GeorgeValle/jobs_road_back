import { createHash, isValidPassword } from "../utils/MethodesJWT.js";
import UserDTO from "../dto/UserDTO.js";
//errors
import CustomError from "../utils/CustomError.js"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import config from "../config/Envs.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.USER_MAIL,
    pass: config.PASS_MAIL,
  },
});

export default class SessionRepository {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async loginUser(user) {
    try {
      const userDB = await this.userDAO.getByFieldDAO(user.email);
      if (!userDB) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      if (userDB.status === "not verified") {
        CustomError.createError({
          name: "Error",
          message: "User not verified",
          code: EErrors.USER_NOT_VERIFIED,
        });
      }
      if (!isValidPassword(userDB, user.password)) {
        CustomError.createError({
          name: "Error",
          message: "Password not valid",
          code: EErrors.PASSWORD_NOT_VALID,
          info: generateUserErrorInfo(user),
        });
      }
      const date = new Date();
      userDB.lastLogin = date;
      await this.userDAO.updateByIdDAO(userDB, userDB._id);
      return userDB;
    } catch (e) {
      throw e;
    }
  }

  async registerUser(user) {
    if (await this.userDAO.getByFieldDAO(user.email))
      throw new Error("User already exist");
    const token = jwt.sign({ email: user.email }, "secret", {
      expiresIn: "72h",
    });
    const verificationLink = `${config.SESSION}/verify/${token}`;
    const mailOptions = {
      from: config.USER_MAIL,
      to: user.email,
      subject: "Verify your email",
      html: `Click on the following link to verify your email: ${verificationLink}`,
    };
    user.password = createHash(user.password);
    if (user.email === config.EMAIL_ADMIN) {
      user.role = "Admin";
    } else {
      user.role = "Normal";
    }

    if (!user.name)throw new Error("User name missing");

    if (!user.surname)throw new Error("User surname missing");

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw new Error(err);
    });
    return await this.userDAO.saveDataDAO(user);
  }

  async getUserCurrent(user) {
    return new UserDTO(user);
  }

  async verifyUser(decoded) {
    const user = await this.userDAO.getByFieldDAO(decoded.email);
    user.status = "verified";
    await this.userDAO.updateUser(user._id, user);
  }

  async resetPasswordForm(email, password, confirmPassword) {
    const user = await this.userDAO.getByFieldDAO(email);
    if (!user) {
      CustomError.createError({
        name: "Error",
        message: "User not found by create error",
        code: EErrors.USER_NOT_FOUND,
        info: generateUserErrorInfo(user),
      });
    }
    if (password !== confirmPassword) {
      return CustomError.createError({
        name: "Error",
        message: "Passwords do not match",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    if (isValidPassword(user, password)) {
      return CustomError.createError({
        name: "Error",
        message: "The password entered cannot be the same as the previous one",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    const newPassword = createHash(password);
    user.password = newPassword;
    await this.userDAO.updateUser(user._id, user);
    return user;
  }

  async validUserSentEmailPassword(email) {
    const user = await this.userDAO.getByFieldDAO(email);
    if (user) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      const mailOptions = {
        from: config.USER_MAIL,
        to: email,
        subject: "Restore Password",
        html: `Click on the following link to reset your password: ${config.SESSION}/resetPasswordForm/${token}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw new Error("Error to send email");
      });
    }
    return user;
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getByFieldDAO(email);
      if (!user) {
        CustomError.createError({
          name: "Error",
          message: "User not found by create error",
          code: EErrors.USER_NOT_FOUND,
          info: generateUserErrorInfo(user),
        });
      }
      return user;
    } catch (e) {
      throw e;
    }
  }
  async setDateController(user) {
    const userDB = await this.userDAO.getByFieldDAO(user.email);
    const date = new Date();
    userDB.lastLogin = date;
    await this.userDAO.updateByIdDAO(userDB, userDB._id);
    return userDB;
  }
}
