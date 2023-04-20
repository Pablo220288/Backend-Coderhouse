import local from 'passport-local'
import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import UserService from '../services/userService.js'
import * as roleService from '../services/roleService.js'

const LocarStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const userService = new UserService()

const initializePassword = () => {
  const cookieExtractor = req => {
    const token = req.cookies ? req.cookies.jwtCookie : {}
    return token
  }

  passport
    .use(
      'jwt',
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
          secretOrKey: process.env.JWT_PRIVATE_KEY
        },
        async (jwtPayload, done) => {
          try {
            return done(null, jwtPayload)
          } catch (error) {
            return done(error)
          }
        }
      )
    )
    .use(
      'register',
      new LocarStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
          try {
            const { firstName, lastName, age, passwordConfirm, roles } =
              req.body
            req.session.register = {
              firstName,
              lastName,
              age,
              emailRegister: username
            }
            const user = await userService.findOneUser(username)
            // Comprobamos si el email ya sta Registrado//
            if (user) {
              req.session.signup = true
              req.session.email = username
              req.session.messageErrorSignup = 'Registered User. Log in..'
              return done(null, false)
            }
            // Confirmamos que los Password Coincidan
            if (password !== passwordConfirm) {
              req.session.signup = true
              req.session.email = ''
              req.session.messageErrorSignup =
                'Password do not match, check again..'
              return done(null, false)
            }

            // Creando Nuevo Usuario
            const newUser = {
              firstName,
              lastName,
              age: parseInt(age),
              email: username,
              password: await userService.encryptPassword(password)
            }

            // Asignamos un rol al nuevo usuario: si no lo especifica sera "user"
            if (roles) {
              const foundRoles = await roleService.findRoles({
                name: { $in: roles }
              })
              newUser.roles = foundRoles.map(role => role._id)
            } else {
              const role = await roleService.findOneRole('user')
              newUser.roles = [role._id]
            }

            // Le Asignamos un Carrito
            const newCart = await userService.addCartToUser()
            newUser.cart = newCart

            // Lo guardamos en la DB
            await userService.createUser(newUser)

            // Lo enviamos a Login para que Ininie Session
            req.session.signup = false
            req.session.email = username
            req.session.messageNewUser = 'You are registered. Log in..'
            return done(null, false)
          } catch (error) {
            return done(error)
          }
        }
      )
    )

  passport.serializeUser(async (user, done) => {
    if (Array.isArray(user)) {
      done(null, user[0]._id)
    } else {
      done(null, user._id)
    }
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userService.findByIdUser(id)
    done(null, user)
  })

  passport
    .use(
      'login',
      new LocarStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
          try {
            const user = await userService.findOneUser(username)
            if (user == null) {
              req.session.signup = false
              req.session.messageErrorLogin = 'Invalid email'
              return done(null, false)
            }
            if (await userService.comparePassword(password, user.password)) {
              // const token = await userModel.createToken(user);
              // const accessToken = generateToken(user); Consultamos JWT pero no lo usamos por ahora
              return done(null, user)
            }
            req.session.signup = false
            req.session.email = username
            req.session.messageNewUser = ''
            req.session.messageErrorLogin = 'Incorrect password'
            return done(null, false)
          } catch (error) {
            return done(error)
          }
        }
      )
    )
    .use(
      'github',
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          scope: ['user:email'],
          calbackURL: process.env.GITHUB_CALBACK_URL,
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const userGithub = await userService.findOneUser({
              email: profile.emails[0].value
            })
            if (userGithub) {
              return done(null, userGithub)
            } else {
              const role = await roleService.findOneRole('user')
              const cart = await userService.addCartToUser()
              const newUser = await userService.createUser({
                firstName: profile._json.name,
                lastName: '', // Github no poseee lastName
                age: 18, // Github no define age
                email: profile.emails[0].value,
                password: '', // Github ya ofrece una contraseña
                roles: [role._id],
                cart
              })
              return done(null, newUser)
            }
          } catch (error) {
            return done(error)
          }
        }
      )
    )
}

export default initializePassword
