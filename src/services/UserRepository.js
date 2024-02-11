import UserDTO from "../dto/UserDTO.js";
import CustomError from "../utils/CustomError.js";
import { generateUserErrorInfo } from "../utils/info.js";
import nodemailer from "nodemailer";
import Envs from "../config/Envs.js";

export default class UserRepository {
  constructor(userDAO, cartDAO, ticketDAO) {
    this.userDAO = userDAO;
    this.cartDAO = cartDAO;
    this.ticketDAO = ticketDAO;
  }
  async createUser(data) {
    try {
      const user = await this.userDAO.saveDataDAO(data);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id) {
    try {
      const user = await this.userDAO.getByIdDAO(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async getUsers() {
    try {
      const users = await this.userDAO.getAllDAO();
      return users;
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await this.userDAO.getByFieldDAO(email);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmailCode(email, verificationCode) {
    try {
      const user = await this.userDAO.getUserByEmailCode(
        email,
        verificationCode
      );
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, data) {
    try {
      const user = await this.userDAO.updateUser(id, data);
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.userDAO.deleteUser(id);
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  }


  userPremium = async (id) => {
    try {
      const user = await this.userDAO.getUserById(id);
      if (user) {
        if (user.role === "admin") {
          CustomError.createError({
            message: "No authorized",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateCartErrorInfo({ pid }),
          });
        }
        if (user.rol === "user" && user.documents.length >= 4) {
          user.rol = "premium";
          const id = user._id;
          const userDB = await this.userDAO.updateUser(id, user);
          return userDB;
          
        } else if (user.rol === "premium") {
          user.rol = "user";
          await this.userDAO.updateUser(user._id, user);
          return user;
        } else {
          throw CustomError.createError({
            message: "You have not uploaded the complete documentation",
            code: EErrors.USER_NOT_AUTHORIZED,
            status: 401,
            info: generateUserErrorInfo({
              message: "You have not uploaded the complete documentation",
            }),
          });
        }
      } else {
        CustomError.createError({
          message: "User not found",
          code: EErrors.USER_NOT_EXISTS,
          status: 404,
          info: generateCartErrorInfo({ pid }),
        });
      }
    } catch (error) {
      throw CustomError.createError({
        message: "You have not uploaded the complete documentation",
        code: EErrors.USER_NOT_AUTHORIZED,
        status: 401,
        info: generateUserErrorInfo({
          message: "You have not uploaded the complete documentation",
        }),
      });
    }
  };

  

  inactiveUsersDrop = async () => {
    try {
      const inactiveUser = await this.userDAO.inactiveUser();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: Envs.USER,
          pass: Envs.PASS,
        },
      });

      if (inactiveUser.length > 0) {
        inactiveUser.forEach(async (user) => {
          const mailOptions = {
            to: user.email,
            subject: "Cuenta eliminada por inactividad",
            text: "Tu cuenta ha sido eliminada debido a inactividad. Puedes registrarte nuevamente si lo deseas.",
          };
          await transporter.sendMail(mailOptions);
          return { message: "success" };
        });
      } else {
        throw CustomError.createError({
          message: "there are no users to delete",
          code: EErrors.USER_NOT_AUTHORIZED,
          status: 401,
          info: generateUserErrorInfo({
            message: "there are no users to delete",
          }),
        });
      }
    } catch (e) {
      throw e;
    }
  };
  
}