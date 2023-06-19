import { describe, it } from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import supertest from 'supertest'
import connectionMongoose from '../src/connection/mongoose.js' // eslint-disable-line

chai.use(dirtyChai)
const expect = chai.expect
const request = supertest.agent('http://localhost:8080')

describe('testing apirest', () => {
  describe('test carts', () => {
    // Iniciamos Sesion
    it('user login', function (done) {
      this.timeout(10000)
      const { statusCode } = request
        .post('/api/session/login')
        .send({ email: 'peh_tj@hotmail.com', password: '1234' })
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
        .send({ email: 'peh_tj@hotmail.com', password: '4321' })
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
