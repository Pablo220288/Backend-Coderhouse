import userModel from '../dao/Mongoose/models/UserSchema.js'
import { roleModel } from '../dao/Mongoose/models/RoleSchema.js'

export const isModerator = async (req, res, next) => {
  const user = await userModel.findById(req.session.passport.user)
  const roles = await roleModel.find({ _id: { $in: user.roles } })

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'moderator') {
      next()
      return
    }
  }
  res.status(403).send({ error: 'Require Moderator role' })
}
export const isAdmin = async (req, res, next) => {
  const user = await userModel.findById(req.session.passport.user)
  const roles = await roleModel.find({ _id: { $in: user.roles } })

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'admin') {
      next()
      return
    }
  }
  res.status(403).send({ error: 'Require Admin role' })
}
