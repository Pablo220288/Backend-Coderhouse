import { Router } from 'express'
import productRouter from './product.routes.js'
import cartRouter from './carts.routes.js'
import socketRouter from './socket.routes.js'
import chatRouter from './chat.routes.js'
import productMongooseRouter from './productMongoose.routes.js'
import cartsMongooseRouter from './cartsMongoose.routes.js'
import cartSocketRouter from './cartsSocket.routes.js'
import productsRouter from './products.routes.js'
import sessionRouter from './session.routes.js'
import usersRouter from './users.routes.js'
import githubRouter from './github.routes.js'
import error404Router from './error404.routes.js'

const router = Router()

router
  .use('/api/products', productRouter)
  .use('/api/carts', cartRouter)
  .use('/api/session', sessionRouter)
  .use('/realTimeProducts', socketRouter)
  .use('/chatSocket', chatRouter)
  .use('/mongoose/products', productMongooseRouter)
  .use('/mongoose/carts', cartsMongooseRouter)
  .use('/realTimeCarts', cartSocketRouter)
  .use('/products', productsRouter)
  .use('/users', usersRouter)
  .use('/session', githubRouter)
  .use('*', error404Router)

export default router
