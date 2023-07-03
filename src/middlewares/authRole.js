import UserService from '../services/userService.js'
import { findOneRole } from '../services/roleService.js'

const users = new UserService()

export const isModerator = async (req, res, next) => {
  console.log(req.session)
  const user = await users.findByIdUser(req.session.passport.user)
  const roles = await findOneRole({ _id: { $in: user.roles } })

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'moderator') {
      next()
      return
    }
  }
  res.status(403).send({ error: 'Require Moderator role' })
}
export const isAdmin = async (req, res, next) => {
  if (req.session.role === 'admin') {
    return next()
  } else {
    /* res.status(403).send({ error: 'Require Admin role' }) */
    res.status(403).render('403', {
      title: '403 || Forbidden',
      noNav: true,
      noFooter: true,
      error: 'Require Admin role'
    })
  }
  /* const user = await users.findByIdUser(req.session.passport.user)
  const roles = await findOneRole({ _id: { $in: user.roles } })

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === 'admin') {
      next()
      return
    }
  } */
}
