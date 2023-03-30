import dotenv from "dotenv";
import local from "passport-local";
import passport from "passport";
import { userModel } from "../dao/Mongoose/models/UserSchema.js";
import { createHash, validatePassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import FacebookStrategy from "passport-facebook";

dotenv.config();
const LocarStrategy = local.Strategy;

const initializePassword = () => {
  passport.use(
    "register",
    new LocarStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, age, passwordConfirm } = req.body;
          req.session.register = {
            firstName,
            lastName,
            age,
            emailRegister: username,
          };
          let user = await userModel.findOne({ email: username });
          if (user) {
            req.session.signup = true;
            req.session.email = username;
            req.session.messageErrorSignup = "Registered User. Log in..";
            return done(null, false);
          }
          if (password != passwordConfirm) {
            req.session.signup = true;
            req.session.email = "";
            req.session.messageErrorSignup =
              "Password do not match, check again..";
            return done(null, false);
          }
          let passHash = createHash(password);
          let newUser = await userModel.create({
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age),
            email: username,
            password: passHash,
          });
          req.session.signup = false;
          req.session.email = username;
          req.session.messageNewUser = "You are registered. Log in..";
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  passport
    .use(
      "login",
      new LocarStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
          console.log(req.session);
          try {
            let user = await userModel.findOne({ email: username });
            if (user == null) {
              req.session.signup = false;
              req.session.messageErrorLogin = "Invalid email";
              return done(null, false);
            }
            if (validatePassword(password, user.password)) {
              return done(null, user);
            }
            req.session.signup = false;
            req.session.email = username;
            req.session.messageNewUser = "";
            req.session.messageErrorLogin = "Incorrect password";
            return done(null, false);
          } catch (error) {
            return done(error);
          }
        }
      )
    )
    .use(
      "github",
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ["user:email"],
          calbackURL: process.env.GITHUB_CALBACK_URL,
          passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            let userGithub = await userModel.findOne({
              email: profile.emails[0].value,
            });
            if (userGithub) {
              return done(null, userGithub);
            } else {
              let newUser = await userModel.create({
                firstName: profile._json.name,
                lastName: "", //Github no poseee lastName
                age: 18, // Github no define age
                email: profile.emails[0].value,
                password: "", // Github ya ofrece una contraseña
              });
              return done(null, newUser);
            }
          } catch (error) {
            return done(error);
          }
        }
      )
    )
};

export default initializePassword;
