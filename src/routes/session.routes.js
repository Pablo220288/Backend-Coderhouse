import express, { Router } from 'express'
import __dirname from '../utils.js'
import SessionManager from '../dao/Mongoose/controllers/SessionManager.js'
import passport from 'passport'
import { passportCall } from '../utils/passportCall.js'
import { authorizationRole } from '../utils/role.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { upload } from '../utils/multer.js'

const sessionRouter = Router()
const session = new SessionManager()

sessionRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/', (req, res, next) => {
    session.getSession(req, res, next)
  })
  .post(
    '/login',
    passport.authenticate('login', {
      successRedirect: '/products/1',
      failureRedirect: '/api/session',
      passReqToCallback: true,
      failureFlash: true
    })
  )
  .post(
    '/register',
    passport.authenticate('register', {
      successRedirect: '/api/session',
      failureRedirect: '/api/session',
      passReqToCallback: true,
      failureFlash: true
    })
  )
  .get(
    '/githubsession',
    passport.authenticate('github', {
      successRedirect: '/products',
      failureRedirect: '/api/session',
      passReqToCallback: true,
      failureFlash: true
    })
  )
  .get(
    '/facebooksession',
    passport.authenticate('facebook', {
      successRedirect: '/products',
      failureRedirect: '/api/session',
      passReqToCallback: true,
      failureFlash: true
    })
  )
  .get('/logout', (req, res, next) => {
    session.destroySession(req, res, next)
  })
  .get(
    '/jwt',
    passport.authenticate('jwt', { session: false }, (req, res) => {
      res.status(200).send(req.user)
    })
  )
  .get(
    '/current',
    passportCall('jwt'),
    authorizationRole('User'),
    (req, res) => {
      res.send(req.user)
    }
  )
  .get('/profile', isAuthenticated, (req, res, next) => {
    session.profile(req, res, next)
  })
  .post('/profile/update', upload.single('avatar'), (req, res, next) => {
    session.profileUpdate(req, res, next)
  })
export default sessionRouter
