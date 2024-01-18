import { createHash, isValidPassword } from "../utils.js";
import UserDTO from "../DTO/user.dto.js";
//errors
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import config from "../config/Envs.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Envs.USER_MAIL,
    pass: Envs.PASS_MAIL,
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
      expiresIn: "24h",
    });
    const verificationLink = `${config.session}/verify/${token}`;
    const mailOptions = {
      from: config.USER,
      to: user.email,
      subject: "Verificación de tu correo electrónico",
      html: `Haz click en el siguiente link para verificar tu correo electrónico: ${verificationLink}`,
    };
    user.password = createHash(user.password);
    if (user.email === "jorgeguillermovalle@gmail.com") {
      user.rol = "admin";
    } else {
      user.rol = "normal";
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw new Error(err);
    });
    return await this.userDAO.saveDataDAO(user);
  }

  async getUserCurrent(user) {
    return new UserDTO(user);
  }

  async verificarUser(decoded) {
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
        message: "Las contraseñas no coinciden",
        code: EErrors.PASSWORD_NOT_VALID,
        info: generateUserErrorInfo(user),
      });
    }
    if (isValidPassword(user, password)) {
      return CustomError.createError({
        name: "Error",
        message: "La contraseña ingresada no puede ser igual a la anterior",
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
        from: config.USER,
        to: email,
        subject: "Restablecer tu contraseña",
        html: `Haz click en el siguiente link para restablecer tu contraseña: ${config.session}/resetPasswordForm/${token}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw new Error("Error al enviar el mail");
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
