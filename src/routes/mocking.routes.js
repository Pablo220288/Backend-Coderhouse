import { Router } from 'express'
import { faker } from '@faker-js/faker'

const mockingRouter = Router()

mockingRouter.use('/', (req, res, next) => {
  const products = []

  const createRandomUser = () => {
    return {
      _id: faker.datatype.uuid(),
      title: faker.commerce.productName(),
      author: faker.name.fullName(),
      description: faker.commerce.productDescription(),
      status: faker.datatype.boolean(0.9),
      category: faker.commerce.department(),
      thumbnail: faker.image.fashion(),
      price: faker.commerce.price(),
      code: faker.datatype.string(7),
      stock: faker.datatype.number({ min: 1, max: 10 })
    }
  }
  for (let i = 0; i < 100; i++) {
    products.push(createRandomUser())
  }

  res.status(200).send(products)
})

export default mockingRouter
