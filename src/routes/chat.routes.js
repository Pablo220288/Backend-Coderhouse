import { Router } from 'express'
import { dateShort } from '../utils/dateShort.js'
import { usersChat } from '../index.js'
import { findChats } from '../services/chatService.js'

const chatRouter = Router()

chatRouter
  .get('/', (req, res) => {
    const time = dateShort()
    res.render('chat', {
      title: 'Chat Websocket',
      messajes: {
        user: 'Administrador',
        messaje: 'Bienvenido al Chat 👋',
        time
      },
      users: usersChat,
      noNav: true,
      noFooter: true
    })
  })
  .get('/messaje', async (req, res) => {
    res.send(await findChats())
  })

export default chatRouter
