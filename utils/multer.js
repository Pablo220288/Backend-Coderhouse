import multer from 'multer'
import __dirname from '../utils/__dirname.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/img')
  },
  filename: (req, file, cb) => {
    cb(null, __filename.originalname)
  }
})

export const uploader = multer({ storage })
