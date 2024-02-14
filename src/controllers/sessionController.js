import { sessionRepository } from "../services/IndexRepository.js";
import { generateToken } from "../utils/MethodesJWT.js";
import jwt from "jsonwebtoken";
import {logInfo, errorLogger} from '../utils/Logger.js'
import ProfileDTO from "../dto/ProfileDTO.js";


export const loginUser = async (req, res) => {
  try {
    const user = await sessionRepository.loginUser(req.body);
    if (user == null) {
      errorLogger.error("Failed to login");
      return res.redirect("/login");
    }
    const access_token = generateToken(user);
    logInfo.info(`${user.username} logged in`);
    const data = new ProfileDTO(user);
    res
      .status(200)
      .cookie("keyCookieJobsRoad", (user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      // .render("profile", user);
      .send({"message":"Login  Successfully","user":data});
  } catch (error) {
    errorLogger.fatal("Failed to login");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).send({ message, URI });
  }
};

export const registerUser = async (req, res) => {
  try {
    const user = await sessionRepository.registerUser(req.body);
    logInfo.info("User Registered");
    const message = {
      message:
        "Instructions were sent to your email to activate your account. Otherwise you will not be able to login.",
    };
    const URI = {
      URI: "/api/session/register",
    };
    res.status(200).send({ message, URI });
  } catch (error) {
    errorLogger.fatal("Error to register user");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/register",
    };
    res.status(500).send({ message, URI });
  }
};

export const getUserCurrent = async (req, res) => {
  try {
    const user = await sessionRepository.getUserCurrent(req.user.user);
    logInfo.info("User obtained");
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.fatal("Error to obtain user");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        errorLogger.fatal("Invalid verification token");
        res.status(500).json({ message: "Invalid verification token" });
      }
      await sessionRepository.verifyUser(decoded);
      res.render("verificar", {});
    });
  } catch (error) {
    errorLogger.fatal("Error to verify user");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const resetPassword = async (req, res) => {
  try {
    res.render("resetearPassword", {});
  } catch (error) {
    errorLogger.fatal("Error to reset password");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const restart = async (req, res) => {
  const email = req.body.email;
  await sessionRepository.validUserSentEmailPassword(email);
  const message = {
    message: "Email sent with instructions to change your password",
  };
  const URI = {
    URI: "/api/session/login",
  };
  res.status(200).render("popUp", { message, URI });
};

export const resetPasswordForm = async (req, res) => {
  const token = req.params.token;
  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      errorLogger.fatal("errorLogger");
      const message = {
        message: err,
      };
      const URI = {
        URI: "/api/session/login",
      };
      res.status(500).render("popUp", { message, URI });
    }
    res.status(200).render("formReset");
  });
};

export const validPassword = async (req, res) => {
  try {
    const password = req.body.newPassword;
    const email = req.body.email;
    const confirmpassword = req.body.confirmPassword;
    await sessionRepository.resetPasswordForm(email, password, confirmpassword);
    const message = {
      message: "La contraseña ha sido cambiada con exito."
    }
    const URI = {
      URI: "/api/session/login",
    };
    res.status(200).render("popUp", { message, URI });
  } catch (error) {
    errorLogger.fatal("Error to validate password");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getProfile = async (req, res) => {
  const { user } = req.user;
  const userDB = await sessionRepository.getUserByEmail(user.email);
  res.status(200).render("profile", userDB);
};

export const logoutUser = async (req, res) => {
  const { user } = req.user;
  await sessionRepository.setDateController(user);
  res.clearCookie("keyCookieForJWT").redirect("/api/session/login");
};
