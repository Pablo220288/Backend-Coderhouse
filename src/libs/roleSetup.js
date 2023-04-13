import { roleModel } from '../dao/Mongoose/models/RoleSchema.js'
export const createRoles = async () => {
  try {
    const count = await roleModel.estimatedDocumentCount()
    if (count > 0) return

    const values = await Promise.all([
      roleModel.create({ name: 'admin' }),
      roleModel.create({ name: 'moderator' }),
      roleModel.create({ name: 'user' })
    ])
    console.log(values)
  } catch (error) {
    console.log(error)
  }
}
