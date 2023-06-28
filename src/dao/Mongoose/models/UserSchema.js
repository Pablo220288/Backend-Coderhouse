import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { cartsModel } from './CartsSchema.js'

const docs = new Schema(
  {
    name: { type: String },
    file: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    email: { type: String, unique: true, index: true },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        index: true
      }
    ],
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart'
    },
    password: { type: String },
    documents: [docs],
    lastConnection: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

UserSchema.static('encryptPassword', async password => {
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT))
  )
})

UserSchema.static('comparePassword', async (password, receivedPassword) => {
  return bcrypt.compareSync(password, receivedPassword)
})

UserSchema.static('createToken', async user => {
  const token = jwt.sign(
    { id: user._id, email: user.email, roles: user.roles[0].name },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: '12h'
    }
  )
  return token
})

UserSchema.static('verifyToken', async token => {
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY)
})

UserSchema.static('addCartToUser', async () => {
  const newCart = await cartsModel.create({ products: [] })
  return newCart._id
})

export default model('User', UserSchema)
