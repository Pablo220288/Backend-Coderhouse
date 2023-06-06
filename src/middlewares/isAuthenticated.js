export const isAuthenticated = (req, res, next) => {
  req.isAuthenticated() ? next() : res.status(200).redirect('/api/session')
}
