import passport from "passport";
import jwt from "passport-jwt";
import { userRepository } from "../services/IndexRepository.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) =>
  req && req.cookies ? req.cookies["keyCookieJobsRoad"] : null;

const initializatePassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secretForJWT",
      },
      async (jwt_payload, done) => {
        try {
          done(null, jwt_payload);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userRepository.getUserById(id);
    done(null, user);
  });
};
export default initializatePassport;