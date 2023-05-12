export const isAuthenticated = (req, res, next) => {
  req.isAuthenticated() ? res.status(200).redirect('/products/1') : res.status(200).redirect('/api/session')
}
