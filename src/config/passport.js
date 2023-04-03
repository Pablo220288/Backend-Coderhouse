import local from "passport-local";
import passport from "passport";
import userModel from "../dao/Mongoose/models/UserSchema.js";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { generateToken } from "../../utils/jwt.js";

const LocarStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassword = () => {
  const cookieExtractor = (req) => {
    const token = req && req.cookies ? req.cookies("jwtCookies") : null;
    return token;
  };

  passport
    .use(
      "jwt",
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
          secretOrKey: process.env.JWT_PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
          try {
            return done(null, jwt_payload);
          } catch (error) {
            return done(error);
          }
        }
      )
    )

    .use(
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
            //let passHash = createHash(password);
            let newUser = await userModel.create({
              firstName: firstName,
              lastName: lastName,
              age: parseInt(age),
              email: username,
              password: await userModel.encryptPassword(password),
            });
            req.session.signup = false;
            req.session.email = username;
            req.session.messageNewUser = "You are registered. Log in..";
            //const accessToken = generateToken(newUser);
            return done(null, false);
          } catch (error) {
            return done(error);
          }
        }
      )
    );

  passport.serializeUser((user, done) => {
    if (Array.isArray(user)) {
      done(null, user[0]._id);
    }
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
          try {
            let user = await userModel.findOne({ email: username });
            if (user == null) {
              req.session.signup = false;
              req.session.messageErrorLogin = "Invalid email";
              return done(null, false);
            }
            if (await userModel.comparePassword(password, user.password)) {
              const accessToken = generateToken(user);
              //console.log(accessToken);
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
    );
};

export default initializePassword;
