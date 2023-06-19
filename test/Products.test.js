import { describe, it, before } from 'mocha'
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import supertest from 'supertest'
import connectionMongoose from '../src/connection/mongoose.js' // eslint-disable-line

chai.use(dirtyChai)
const expect = chai.expect
const request = supertest.agent('http://localhost:8080')

describe('testing apirest', () => {
  describe('test products', () => {
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

    // Consultamos todos los productos
    it('return all products', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.get('/mongoose/products')
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(Array.isArray(body)).to.be.true()
    })

    // ID producto test
    let idProductTest = ''

    // Creamos un producto test
    it('create new product', async function () {
      this.timeout(10000)
      const newProduct = {
        title: 'Product Test',
        author: 'Author Test',
        description: 'Description Test',
        price: 9999,
        status: true,
        category: 'Category Test',
        thumbnail:
          'https://global-uploads.webflow.com/6034d7d1f3e0f52c50b2adee/62ac6f2dfcc47a33f8701adf_6034d7d1f3e0f5c12ab2b2e0_978841743064120PersuasiC3B3n20J.20Austen_1.jpeg',
        code: 'Code Test',
        stock: 999
      }
      const { statusCode, body } = await request
        .post('/mongoose/products')
        .send(newProduct)
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      // Guardamos en ID del producto test
      idProductTest = body.payload._id
    })

    // Consultamos el producto creado
    it('return products by ID', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.get(
        `/mongoose/products/${idProductTest}`
      )
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      expect(body._id).to.equal(idProductTest)
    })

    // Modificamos los valores del Producto test
    it('update products by ID', async function () {
      this.timeout(10000)
      const newProductUpdate = {
        title: 'Test Product',
        author: 'Test Author',
        description: 'Test Description',
        price: 1111,
        status: true,
        category: 'Test Category',
        thumbnail:
          'https://global-uploads.webflow.com/6034d7d1f3e0f52c50b2adee/62ac6f2dfcc47a33f8701adf_6034d7d1f3e0f5c12ab2b2e0_978841743064120PersuasiC3B3n20J.20Austen_1.jpeg',
        code: 'Test Code',
        stock: 111
      }
      const { statusCode, body } = await request
        .put(`/mongoose/products/${idProductTest}`)
        .send(newProductUpdate)
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      expect(body.payload._id).to.equal(idProductTest)
    })

    // Eliminamos el producto test
    it('delete products by ID', async function () {
      this.timeout(10000)
      const { statusCode, body } = await request.delete(
        `/mongoose/products/${idProductTest}`
      )
      // test chail
      expect(statusCode === 200).to.be.true()
      expect(body).to.be.an('object')
      expect(body.payload._id).to.equal(idProductTest)
    })
  })
})
