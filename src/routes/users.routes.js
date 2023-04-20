import { Router } from 'express'
import passport from 'passport'
import UserService from '../services/userService.js'

const usersRouter = Router()
const userService = new UserService()

usersRouter
  .get('/', async (req, res) => {
    const users = await userService.findAllUsers()
    return res.status(200).send(users)
  })
  .post('/register', passport.authenticate('register'), async (req, res) => {
    res.status(200).send({
      satus: 'success',
      message: 'User Created'
    })
  })
  .post('/login', passport.authenticate('login'), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({
          status: 'error',
          error: 'Invalidate User'
        })
      }
      req.session.login = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        email: req.user.email
      }
      return res.status(200).send({
        status: 'success',
        payload: req.user
      })
    } catch (error) {
      res.status(500).send(error)
    }
  })

export default usersRouter
