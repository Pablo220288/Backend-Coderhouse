import local from "passport-local";
import passport from "passport";
import { userModel } from "../dao/Mongoose/models/UserSchema.js";
import { createHash, validatePassword } from "../utils.js";

const LocarStrategy = local.Strategy;

const initializePassword = () => {
  passport.use(
    "register",
    new LocarStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, age, email } = req.body;
        try {
          let user = await userModel.findOne({ email: username });
          if (user) return done(null, false);
          let passHash = createHash(password);
          let newUser = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age),
            email: email,
            password: passHash,
          });
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocarStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let user = await userModel.findOne({ email: username });
          if (!user) return done(null, flase);
          if (validatePassword(password, user.password)) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassword;
