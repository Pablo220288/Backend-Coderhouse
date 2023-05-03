import { Router } from 'express'
import nodemailer from 'nodemailer'

const mailRouter = Router()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'devtestpeh@gmail.com',
    pass: 'wldagkgfksbsqosk'
  }
})

mailRouter.get('/', async (req, res) => {
  try {
    await transporter.sendMail({
      from: '"Tienda Node JS" <devtestpeh@gmail.com>',
      to: 'peh7sep@gmail.com',
      subject: 'Compra Realizada',
      html: `
        <div>   
          <h1>Hola, Buenas Noches</h1>
        </div>
        `,
      attachments: []
    })
    res.status(200).send('Mail enviado')
  } catch (error) {
    res.status(500).send(error)
  }
})

export default mailRouter
