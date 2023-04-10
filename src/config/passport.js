import local from "passport-local";
import passport from "passport";
import userModel from "../dao/Mongoose/models/UserSchema.js";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { roleModel } from "../dao/Mongoose/models/RoleSchema.js";

const LocarStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassword = () => {
  const cookieExtractor = (req) => {
    const token = req.cookies ? req.cookies.jwtCookie : {};
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
            const { firstName, lastName, age, passwordConfirm, roles } =
              req.body;
            req.session.register = {
              firstName,
              lastName,
              age,
              emailRegister: username,
            };
            let user = await userModel.findOne({ email: username });
            //Comprobamos si el email ya sta Registrado
            if (user) {
              req.session.signup = true;
              req.session.email = username;
              req.session.messageErrorSignup = "Registered User. Log in..";
              return done(null, false);
            }
            //Confirmamos que los Password Coincidan
            if (password != passwordConfirm) {
              req.session.signup = true;
              req.session.email = "";
              req.session.messageErrorSignup =
                "Password do not match, check again..";
              return done(null, false);
            }

            //Creando Nuevo Usuario
            let newUser = {
              firstName: firstName,
              lastName: lastName,
              age: parseInt(age),
              email: username,
              password: await userModel.encryptPassword(password),
            };

            //Asignamos un rol al nuevo usuario: si no lo especifica sera "user"
            if (roles) {
              const foundRoles = await roleModel.find({
                name: { $in: roles },
              });
              newUser.roles = foundRoles.map((role) => role._id);
            } else {
              const role = await roleModel.findOne({ name: "user" });
              newUser.roles = [role._id];
            }

            //Le Asignamos un Carrito
            let newCart = await userModel.addCartToUser()
            newUser.cart = newCart

            //Lo guardamos en la DB
            await userModel.create(newUser);

            //Lo enviamos a Login para que Ininie Session
            req.session.signup = false;
            req.session.email = username;
            req.session.messageNewUser = "You are registered. Log in..";
            return done(null, false);
          } catch (error) {
            return done(error);
          }
        }
      )
    );

  passport.serializeUser(async (user, done) => {
    if (Array.isArray(user)) {
      done(null, user[0]._id);
    } else {
      done(null, user._id);
    }
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
            let user = await userModel
              .findOne({ email: username })
              .populate("roles");
            if (user == null) {
              req.session.signup = false;
              req.session.messageErrorLogin = "Invalid email";
              return done(null, false);
            }
            if (await userModel.comparePassword(password, user.password)) {
              //const token = await userModel.createToken(user);
              //const accessToken = generateToken(user); Consultamos JWT pero no lo usamos por ahora
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
              const role = await roleModel.findOne({ name: "user" });
              let newUser = await userModel.create({
                firstName: profile._json.name,
                lastName: "", //Github no poseee lastName
                age: 18, // Github no define age
                email: profile.emails[0].value,
                password: "", // Github ya ofrece una contraseña
                roles: [role._id],
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
