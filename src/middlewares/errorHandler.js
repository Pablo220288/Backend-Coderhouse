import ApiErrors from '../errors/apiErrors.js'

const errorsHandlers = (err, req, res, next) => {
  if (err instanceof ApiErrors) {
    res.status(err.code).json(err.message)
    return
  }
  res.status(500).json('Something went wrong')
}

export default errorsHandlers
