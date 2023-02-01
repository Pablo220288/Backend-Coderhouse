import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

//__filename && __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname

//Muter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, __filename.originalname);
  },
});

export const uploader = multer({ storage });
