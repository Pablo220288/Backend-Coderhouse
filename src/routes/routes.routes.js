import { Router } from 'express'
import productRouter from './product.routes.js'
import cartRouter from './carts.routes.js'
import productSocketRouter from './productsSocket.routes.js'
import chatRouter from './chat.routes.js'
import productMongooseRouter from './productMongoose.routes.js'
import cartsMongooseRouter from './cartsMongoose.routes.js'
import cartSocketRouter from './cartsSocket.routes.js'
import homeRouter from './home.routes.js'
import sessionRouter from './session.routes.js'
import usersRouter from './users.routes.js'
import githubRouter from './github.routes.js'
import error404Router from './error404.routes.js'
import ticketRouter from './ticket.routes.js'
import purchaseRouter from './purchase.routes.js'
import mockingRouter from './mocking.routes.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import recoveryRouter from './recovery.routes.js'
import swaggerUiExpress from 'swagger-ui-express'
import { specs } from '../utils/swagger.js'
import userSocketRouter from './usersSocket.routes.js'

const router = Router()

router
  .use('/api/products', productRouter)
  .use('/api/carts', cartRouter)
  .use('/api/session', sessionRouter)
  .use('/realTimeProducts', productSocketRouter)
  .use('/chatSocket', isAuthenticated, chatRouter)
  .use('/mongoose/products', productMongooseRouter)
  .use('/mongoose/carts', cartsMongooseRouter)
  .use('/realTimeCarts', cartSocketRouter)
  .use('/products', homeRouter)
  .use('/users', usersRouter)
  .use('/realTimeUsers', userSocketRouter)
  .use('/session', githubRouter)
  .use('/products/purchase', isAuthenticated, purchaseRouter)
  .use('/ticket', isAuthenticated, ticketRouter)
  .use('/mockingProducts', mockingRouter)
  .use('/recovery', recoveryRouter)
  .use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
  .use('/', isAuthenticated, homeRouter)
  .use('*', error404Router)

export default router
