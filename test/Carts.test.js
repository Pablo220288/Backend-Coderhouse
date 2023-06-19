import { describe, it, before } from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import supertest from 'supertest'
import connectionMongoose from '../src/connection/mongoose.js' // eslint-disable-line

chai.use(dirtyChai)
const expect = chai.expect
const request = supertest.agent('http://localhost:8080')

describe('testing apirest', () => {
  describe('test carts', () => {
    before('user login', function (done) {
      this.timeout(10000)
      request
        .post('/api/session/login')
        .send({ email: 'peh_tj@hotmail.com', password: '1234' })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
    before('user session', function (done) {
      this.timeout(10000)
      request
        .get('/products/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })

    // Consultamos todos los carritos
    it('return all carts', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.get('/mongoose/carts')
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(Array.isArray(body)).to.be.true()
    })

    let idCartTest = ''

    // Creamos un carrito test
    it('create new product', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.post('/mongoose/carts')
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      // Guardamos en ID del producto test
      idCartTest = body.payload._id
    })

    // Consultamos el carrito creado
    it('return products by ID', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.get(
        `/mongoose/carts/${idCartTest}`
      )
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      expect(body.payload._id).to.equal(idCartTest)
    })

    // Eliminamos el carts test
    it('delete products by ID', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.delete(
        `/mongoose/carts/${idCartTest}`
      )
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      expect(body.payload._id).to.equal(idCartTest)
    })
  })
})
