import { roleModel } from '../dao/Mongoose/models/RoleSchema.js'

export const findRoles = async roles => {
  return await roleModel.find(roles)
}
export const findOneRole = async rolName => {
  return await roleModel.findOne({ name: rolName })
}
