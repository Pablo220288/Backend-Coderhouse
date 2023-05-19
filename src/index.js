import app from './app.js'
import { Server } from 'socket.io'
// import { dateShort } from '../utils/dateShort.js'
// import { chatModel } from './dao/Mongoose/models/ChatSchema.js'
import { logger } from '../utils/logger.js'

// Creando Loacal host 8080
export const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () =>
  logger.info(`Express por Local host ${server.address().port}`)
)
server.on('error', err => {
  logger.error(`Algo salio mal: ${err}`)
})
export const io = new Server(server)

/* // ChatSocket
const time = dateShort()
// Usuarios Conectados
export let usersChat = []
// Mensaje de Bienvenida
const greeting = {
  user: 'Administrador',
  messaje: 'Bienvenido al Chat 👋',
  time,
  idUser: '1234567890'
}
// Funcion para subir mensajes a MongoDB
const addChatMongoose = async messaje => {
  await chatModel.create(messaje)
}
io.on('connection', socket => {
  logger.log('info', `${socket.id}: Conectado`)
  socket.on('disconnect', () => {
    logger.log('info', `${socket.id}: Desconectado`)
    const user = usersChat.find(user => user.idUser === socket.id)
    if (user !== undefined) {
      // Subimos a MongoDB Mensaje de Desconeccion
      addChatMongoose({
        user: user.user,
        messaje: 'se ha desconecto',
        time: dateShort(),
        idUser: socket.id,
        idConnection: 'disConnection'
      })
      const userUpload = usersChat.filter(user => user.idUser !== socket.id)
      usersChat = [...userUpload]
      const findChatMongoose = async () => {
        // Si se Desconecto el ultimo Usuario vaciamos el chat
        if (usersChat.length === 0) await chatModel.deleteMany({})

        const allMessajeMongoose = await chatModel.find()
        io.sockets.emit('userChat', usersChat, allMessajeMongoose)
      }
      findChatMongoose()
    }
  })
  socket.on('userChat', data => {
    usersChat.push({
      user: data.user,
      idUser: data.id
    })
    // Mensaje de Coneccion
    const userConecction = {
      user: data.user,
      messaje: data.messaje,
      time: dateShort(),
      idUser: data.id,
      idConnection: 'Connection'
    }
    // Subimos el Mensaje a MongoDB
    const chat = async () => {
      const chats = await chatModel.find()
      if (chats.length === 0) {
        // Si el chat esta vacio, es decir que es la primer conneccion, lo envimos junto a un saludo
        await chatModel.create([greeting, userConecction])
      } else {
        await chatModel.create(userConecction)
      }
      const allMessajeMongoose = await chatModel.find()
      io.sockets.emit('userChat', usersChat, allMessajeMongoose)
    }
    chat()
  })

  socket.on('messajeChat', data => {
    // Subimos Mensaje a MongoDB
    addChatMongoose(data)
    const findChatMongoose = async () => {
      const allMessajeMongoose = await chatModel.find()
      io.sockets.emit('messajeLogs', allMessajeMongoose)
    }
    findChatMongoose()
  })
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data)
  })
}) */
