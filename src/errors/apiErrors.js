class ApiErrors {
  constructor (code, message) {
    this.code = code
    this.message = message
  }

  badRequest (msg) {
    return new ApiErrors(400, msg)
  }

  internal (msg) {
    return new ApiErrors(500, msg)
  }
}

export default ApiErrors
