import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'devtestpeh@gmail.com',
    pass: 'wldagkgfksbsqosk'
  }
})

const sendMail = async (email, dataEmail) => {
  await transporter.sendMail({
    from: '"Tienda Node JS" <devtestpeh@gmail.com>',
    to: `${email}`,
    subject: 'Compra Realizada',
    html: `
          <div>   
            <h1>Gracias por tu Compra</h1>
          </div>
          `,
    attachments: []
  })
}

export default sendMail
