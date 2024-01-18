import { Router } from "express";
import {
  loginUser,
  registerUser,
  getUserCurrent,
  verificarUser,
  resetearPassword,
  resetPasswordForm,
  restart,
  validPassword,
  getProfile,
  logoutUser
} from "../controllers/sessionController.js";
import passport from "passport";
const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/login", (req, res) => {
  if (Object.keys(req.cookies).length != 0) return res.redirect("/profile");
  res.render("login", {});
});

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),logoutUser
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

router.get("/verify/:token", verificarUser);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  getUserCurrent
);

router.get("/resetPassword", resetearPassword);

router.post("/restart", restart);

router.get("/resetPasswordForm/:token", resetPasswordForm);

router.post("/validPassword", validPassword);

export default router;
