import express, { Router } from 'express'
import __dirname from '../utils.js'
import UserService from '../services/userService.js'
import { io } from '../index.js'

const recoveryRouter = Router()
const userService = new UserService()

recoveryRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:id', async (req, res, next) => {
    if (req.cookies.recoveryPassword) {
      const user = await userService.findByIdUser(req.params.id)
      res.status(200).render('recovery', {
        title: 'Recovery Password',
        noNav: true,
        noFooter: true,
        nameUser: `${user.firstName}`,
        sendEmail: false
      })
      io.on('connection', socket => {
        socket.on('recoveryPassword', async data => {
          if (
            await userService.comparePassword(data.passFirst, user.password)
          ) {
            console.log('aqui')
            io.sockets.emit('passwordRepeated')
          } else {
            const newPassword = await userService.encryptPassword(
              data.passFirst
            )
            await userService.recoveryPassword(user.id, newPassword)
            io.sockets.emit('recoverySuccess')
          }
        })
      })
    } else {
      return res.status(200).redirect('/api/session/?emailExpired=true')
    }
  })
  .post('/sendEmail', async (req, res) => {
    const emailUser = req.body.email
    const user = await userService.findOneUser(emailUser)
    res.cookie('recoveryPassword', user.id, {
      maxAge: 8.64e7,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    res.status(200).render('recovery', {
      title: 'Recovery Password',
      noNav: true,
      noFooter: true,
      sendEmail: true,
      emailUser
    })
  })

export default recoveryRouter
