import { describe, it } from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import supertest from 'supertest'
import connectionMongoose from '../src/connection/mongoose.js' // eslint-disable-line

chai.use(dirtyChai)
const expect = chai.expect
const request = supertest.agent('http://localhost:8080')

describe('testing apirest', () => {
  describe('test session', () => {
    const userTest = {
      email: 'user@test.com',
      password: '1234',
      firstName: 'User',
      lastName: 'Test',
      age: 99,
      passwordConfirm: '1234'
    }
    // Registramos un nuevo usuario
    it('register user', function (done) {
      this.timeout(10000)
      const { statusCode } = request
        .post('/api/session/register')
        .send(userTest)
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
      // test chail
      expect(statusCode === 302).to.be.false()
    })
    // Iniciamos Sesion con datos erroneos
    it('user login fail', function (done) {
      this.timeout(10000)
      const { statusCode } = request
        .post('/api/session/login')
        .send({ email: userTest.email, password: '4321' })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
      // test chail
      expect(statusCode === undefined).to.be.true()
    })

    // Nos logeamos con el Usuario Test
    it('user login', function (done) {
      this.timeout(10000)
      const { statusCode } = request
        .post('/api/session/login')
        .send({ email: userTest.email, password: userTest.password })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
      // test chail
      expect(statusCode === 302).to.be.false()
    })
    it('user session', function (done) {
      this.timeout(10000)
      request
        .get('/products/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
    // Eliminamos al User Test
    it('delete user', function (done) {
      this.timeout(10000)
      const { statusCode } = request
        .post('/api/session/profile/deleteAccount')
        .send({ password: userTest.password })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
      // test chail
      expect(statusCode === undefined).to.be.true()
    })
  })
})
