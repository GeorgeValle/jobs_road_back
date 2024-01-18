import UserDTO from "../DTO/user.dto.js";

import { generateUserErrorInfo } from "../errors/info.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

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
    } catch (e) {
      throw e;
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

  addCartToUser = async (userId, cartId) => {
    try {
      const user = await this.userDAO.getUserById(userId);
      user.cart.push(cartId);
      user.save();
      return user;
    } catch (e) {
      throw e;
    }
  };

  userPremium = async (id) => {
    try {
      const user = await this.userDAO.getUserById(id);
      if (user) {
        if (user.rol === "admin") {
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

  uploadDocuments = async(id,files)=>{
    try{
      const userDB = await this.userDAO.getUserById(id);
      if (!userDB) {
        return res.status(404).json({ error: "User not found" });
      }
      const uploadedDocuments = [];
  
      if (files["profileImage"]) {
        const profileImage = files["profileImage"][0];
        uploadedDocuments.push({
          name: profileImage.originalname,
          reference: profileImage.path,
        });
      }
  
      if (files["productImage"]) {
        const productImage = files["productImage"][0];
        uploadedDocuments.push({
          name: productImage.originalname,
          reference: productImage.path,
        });
      }
  
      if (files["documentDNI"]) {
        const documentDNI = files["documentDNI"][0];
        uploadedDocuments.push({
          name: documentDNI.originalname,
          reference: documentDNI.path,
        });
      }
  
      if (files["comprobanteDomicilio"]) {
        const comprobanteDomicilio = files["comprobanteDomicilio"][0];
        uploadedDocuments.push({
          name: comprobanteDomicilio.originalname,
          reference: comprobanteDomicilio.path,
        });
      }
  
      if (files["comprobanteEstadoCuenta"]) {
        const comprobanteEstadoCuenta = files["comprobanteEstadoCuenta"][0];
        uploadedDocuments.push({
          name: comprobanteEstadoCuenta.originalname,
          reference: comprobanteEstadoCuenta.path,
        });
      }
  
      userDB.documents.push(...uploadedDocuments);
  
      await this.userDAO.updateUser(userDB._id, userDB);
      return userDB;
    }catch(e){
      throw e;
    }
  }

  inactiveUsersDrop = async () => {
    try {
      const inactiveUser = await this.userDAO.inactiveUser();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.USER,
          pass: config.PASS,
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
  getTicketUserById = async (userID) => {
    try {
      const user = await this.userDAO.getUserById(userID);
      let tickets = [];
      for (const ticketId of user.ticketId) {
        const ticket = await this.ticketDAO.getTicketById(ticketId._id);
        if (ticket.status === "confirmate") {
          tickets.push(ticket);
        }
      }
      if (tickets.length > 0) return tickets;
      throw e;
    } catch (e) {
      throw e;
    }
  };
}