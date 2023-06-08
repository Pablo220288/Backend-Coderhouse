import swaggerJSDoc from 'swagger-jsdoc'
import __dirname from '../utils.js'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation Api Rest',
      description: 'Proyect Description'
    }
  },
  servers: [
    {
      url: 'http://localhost:8080'
    }
  ],
  apis: [`${__dirname}/docs/*.yaml`]
}
export const specs = swaggerJSDoc(swaggerOptions)
