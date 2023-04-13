export const authorizationRole = (rol) => {
  return async (req, res, next) => {
    if (!req.user) { return res.status(401).send({ message: 'User no authorization' }) }
    if (req.user.user[0].roles !== rol) { return res.status(401).send({ message: 'User no permissions' }) }
    next()
  }
}
