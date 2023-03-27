import { userModel } from "../models/UserSchema.js";
import { createHash } from "../../../utils.js";
import { validatePassword } from "../../../utils.js";
class SessionManager {
  getSession = (req, res, next) => {
    console.log(req.session);
    try {
      if (req.session.login) {
        return res.status(200).redirect("/products");
      } else {
        let register = req.session.register;
        if (register === undefined)
          register = {
            firstName: "",
            lastName: "",
            age: "",
            emailRegister: "",
          };
        return res.status(200).render("login", {
          title: "Login | Signup",
          noNav: true,
          email: req.session.email,
          messageLogin: req.session.messageErrorLogin,
          signup: req.session.signup,
          messageSignup: req.session.messageErrorSignup,
          firstName: register.firstName,
          lastName: register.lastName,
          age: register.age,
          emailRegister: register.emailRegister,
          messageNewUser: req.session.messageNewUser,
        });
      }
    } catch (err) {
      res.status(500).send("Error al ingresar", err);
    }
  };
  testLogin = async (req, res, next) => {
    try {
      let user = await userModel.findOne({ email: req.body.email });
      req.session.messageNewUser = "";
      if (user == null) {
        req.session.messageErrorLogin = "Invalid email";
        req.session.email = "";
        return res.status(200).redirect("/api/session");
      } else if (!validatePassword(req.body.password, user.password)) {
        req.session.messageErrorLogin = "Incorrect password";
        req.session.email = user.email;
        return res.status(200).redirect("/api/session");
      } else {
        req.session.messageErrorLogin = "";
        req.session.email = user.email;
        req.session.login = true;
        return res.status(200).redirect("/products");
      }
    } catch (err) {
      res.status(500).send("Error al crear", err);
    }
  };
  createUser = async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        age,
        emailRegister,
        password,
        passwordConfirm,
      } = req.body;
      req.session.messageErrorLogin = "";
      req.session.messageNewUser = "";
      req.session.register = {
        firstName,
        lastName,
        age,
        emailRegister,
        password,
        passwordConfirm,
      };
      let user = await userModel.findOne({ email: emailRegister });

      if (
        !firstName ||
        !lastName ||
        !age ||
        !emailRegister ||
        !password ||
        !passwordConfirm
      ) {
        req.session.signup = true;
        req.session.messageErrorSignup = "All fields are requerid";
        return res.status(200).redirect("/api/session");
      } else if (user != null) {
        req.session.messageErrorSignup = "Registered User. Log in..";
        req.session.signup = true;
        req.session.email = emailRegister;
        return res.status(200).redirect("/api/session");
      } else if (password != passwordConfirm) {
        req.session.messageErrorSignup = "Password do not match, check again..";
        req.session.signup = true;
        req.session.email = emailRegister;
        return res.status(200).redirect("/api/session");
      } else {
        let passEncripted = createHash(password);
        let newUser = {
          firstName: firstName,
          lastName: lastName,
          age: parseInt(age),
          email: emailRegister,
          password: passEncripted,
        };
        await userModel.create(newUser);
        req.session.messageErrorSignup = "";
        req.session.signup = false;
        req.session.email = emailRegister;
        req.session.messageNewUser = "You are registered. Log in..";
        return res.status(200).redirect("/api/session");
      }
    } catch (err) {
      res.status(500).send("Error al cerrar sesion", err);
    }
  };
  destroySession = (req, res, next) => {
    try {
      req.session.destroy();
      return res.status(200).redirect("/api/session");
    } catch (err) {
      res.status(500).send("Error al cerrar sesion", err);
    }
  };
}

export default SessionManager;
