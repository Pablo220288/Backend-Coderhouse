import userModel from '../dao/Mongoose/models/UserSchema.js'

export const findOneUser = async email => {
  const user = await userModel.findOne({ email }).populate('roles')
  return user
}
