import dotenv from 'dotenv'
import mongoose from 'mongoose'

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
    .catch((err) => console.log(err))

  db.once('open', () => {
    console.log('Database in connected to MongoDB')
  })

  db.on('error', (err) => {
    console.log(err)
  })
}

export default connectionMongoose()
