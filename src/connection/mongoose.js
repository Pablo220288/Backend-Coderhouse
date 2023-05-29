import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { logger } from '../utils/logger.js'

// Archivo ENV
dotenv.config()

const db = mongoose.connection
const connectionMongoose = () => {
  mongoose
    .set('strictQuery', true)
    .connect(process.env.MOONGOOSE_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .catch(err => logger.error(err))

  db.once('open', () => {
    logger.info('Database in connected to MongoDB')
  })

  db.on('error', err => {
    logger.error(err)
  })
}

export default connectionMongoose()
