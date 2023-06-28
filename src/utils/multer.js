import multer from 'multer'
import __dirname from '../utils.js'
import { extname } from 'path'

const mimeType = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const mapFile = [
        { name: 'avatar', path: '/public/uploads/avatars' },
        { name: 'identification', path: '/public/uploads/identifications' },
        { name: 'address', path: '/public/uploads/addresses' },
        { name: 'account', path: '/public/uploads/accounts' }
      ]

      const destinationFile = mapFile.find(
        destination => destination.name === file.fieldname
      )
      if (destinationFile) {
        cb(null, __dirname + destinationFile.path)
      } else {
        cb(new Error('Wrong route'))
      }
    },
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname)
      cb(null, `${req.session.passport.user}_${file.fieldname}${fileExtension}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (mimeType.includes(file.mimetype)) cb(null, true)
    else cb(new Error(`Only ${mimeType.join('')} mimetypes are allowed`))
  },
  limits: {
    fieldSize: 10000000
  }
})
