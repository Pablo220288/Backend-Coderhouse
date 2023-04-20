import userModel from '../dao/Mongoose/models/UserSchema.js'

class UserService {
  constructor () {
    this.model = userModel
  }

  findAllUsers = async () => {
    return await this.model.find({}).populate('roles').populate('cart', 'products')
  }

  findOneUser = async email => {
    return await this.model.findOne({ email }).populate('roles')
  }

  findByIdUser = async id => {
    return await userModel.findById(id).populate('roles')
  }

  createUser = async newUser => {
    return await userModel.create(newUser)
  }

  addCartToUser = async () => {
    return await userModel.addCartToUser()
  }

  encryptPassword = async password => {
    return this.model.encryptPassword(password)
  }

  comparePassword = async (password, receivedPassword) => {
    return this.model.comparePassword(password, receivedPassword)
  }

  createToken = async user => {
    return await userModel.createToken(user)
  }

  verifyToken = async token => {
    return await userModel.verifyToken(token)
  }
}

export default UserService
