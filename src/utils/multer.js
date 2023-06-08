import multer from 'multer'
import __dirname from '../utils.js'

export const upload = multer({ dest: __dirname + '/public/uploads/' })
