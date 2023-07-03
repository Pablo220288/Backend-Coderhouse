import userModel from '../dao/Mongoose/models/UserSchema.js'

class UserService {
  constructor () {
    this.model = userModel
  }

  exist = async id => {
    const users = await this.model.find().populate('roles')
    return users.find(user => user.id === id)
  }

  findAllUsers = async () => {
    return await this.model
      .find({})
      .populate('roles')
      .populate('cart', 'products')
  }

  findOneUser = async email => {
    return await this.model.findOne({ email })
  }

  findByIdUser = async id => {
    const user = await this.exist(id)
    if (!user) return { status: 'error', message: 'Usuario Inexistente' }
    return user
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

  recoveryPassword = async (id, newPassword) => {
    const userUpdatePassword = await userModel.findByIdAndUpdate(
      id,
      {
        password: newPassword
      },
      { new: true }
    )
    return userUpdatePassword
  }

  updateUser = async (id, data) => {
    return await userModel.findByIdAndUpdate(id, data, {
      new: true
    })
  }

  deleteUser = async id => {
    const user = await this.exist(id)
    if (!user) return { status: 'error', message: 'Usuario Inexistente' }
    return await userModel.findByIdAndDelete(id)
  }
}

export default UserService
