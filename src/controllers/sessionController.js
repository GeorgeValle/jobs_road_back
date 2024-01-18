import { sessionRepository } from "../services/index.js";
import { generateToken } from "../utils/MethodesJWT.js";
import jwt from "jsonwebtoken";


export const loginUser = async (req, res) => {
  try {
    const user = await sessionRepository.loginUser(req.body);
    if (user == null) {
      req.logger.error("Error al loguear el usuario");
      return res.redirect("/login");
    }
    const access_token = generateToken(user);
    res
      .cookie("keyCookieForJWT", (user.token = access_token), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .render("profile", user);
  } catch (error) {
    req.logger.fatal("Error al loguear el usuario");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const registerUser = async (req, res) => {
  try {
    const user = await sessionRepository.registerUser(req.body);
    req.logger.info("Usuario registrado");
    const message = {
      message:
        "Se enviaron las instrucciones al mail para poder activar tu cuenta.De lo contrario no podras iniciar session",
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  } catch (error) {
    req.logger.fatal("Error al registrar el usuario");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const getUserCurrent = async (req, res) => {
  try {
    const user = await sessionRepository.getUserCurrent(req.user.user);
    req.logger.info("Usuario obtenido");
    return res.send({ status: "success", payload: user });
  } catch (error) {
    req.logger.fatal("Error al obtener el usuario");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const verificarUser = async (req, res) => {
  try {
    const token = req.params.token;
    jwt.verify(token, "secret", async (err, decoded) => {
      if (err) {
        req.logger.fatal("Token de verificacion no válido");
        res.status(500).json({ message: "Token de verificacion no válido" });
      }
      await sessionRepository.verificarUser(decoded);
      res.render("verificar", {});
    });
  } catch (error) {
    req.logger.fatal("Error al verificar el usuario");
    const message = {
      message: error,
    };
    const URI = {
      URI: "/api/session/login",
    };
    res.status(500).render("popUp", { message, URI });
  }
};

export const resetearPassword = async (req, res) => {
  try {
    res.render("resetearPassword", {});
  } catch (error) {
    req.logger.fatal("Error al resetear la contraseña");
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
    message: "Email enviado con las instrucciones para cambiar la contraseña",
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
      req.logger.fatal("Token de verificacion no válido");
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
    req.logger.fatal("Error al validar la contraseña");
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
