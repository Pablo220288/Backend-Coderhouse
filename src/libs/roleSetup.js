import { roleModel } from '../dao/Mongoose/models/RoleSchema.js'
import { logger } from '../utils/logger.js'
export const createRoles = async () => {
  try {
    const count = await roleModel.estimatedDocumentCount()
    if (count > 0) return

    const values = await Promise.all([
      roleModel.create({ name: 'admin' }),
      roleModel.create({ name: 'moderator' }),
      roleModel.create({ name: 'user' })
    ])
    logger.info(values)
  } catch (error) {
    logger.error(error)
  }
}
