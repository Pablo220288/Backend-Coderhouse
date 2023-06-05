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

export const sendMailPurchase = async (email, dataEmail) => {
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

const messageHTMLRecovery = (email, id, nameUser) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;1,300;1,500&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/the-scientist" rel="stylesheet">
        <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }
            body {
              font-family: 'Poppins', sans-serif;
            }
            hr {
              width: 100%;
              color: #88c043;
            }
            p {
              font-weight: 300;
              font-size: 0.9rem;
            }
            .contA{
                margin: 0px 10px 0 10px;
            }
            .afooter{
                color: #ffffff !important; 
                text-decoration: none;
                font-size: 13px !important;
            }
        </style>
    </head>
    <body>
      <div style="width: 100%;">
        <div style="padding: 20px 10px 20px 10px;">
          <div style="padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
            <img src="cid:logo" alt="" style="width: 200px; height: 60px;">
            <h1 style="font-weight: 300; font-size: 30px;">Tienda Node JS</h1>
          </div>
          <hr/>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: left;">
            <h1 style="font-weight: 300; font-size: 20px;">¿Olvidaste tu contraseña?</h1>
            <p>Hola ${nameUser},</p>
            <p>
              Recibimos una solicitud para restablecer la contraseña de la cuenta
              asociada con <strong style="color: #88c043;">${email}</strong>. Aún no se han
              realizado cambios en su cuenta.
            </p>
            <p>
              Puede restablecer su contraseña haciendo clic en el siguiente enlace:
            </p>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <div style="background-color: #88c043; padding: 20px 0px 5px 0px; width: 50%; height: 50px;">
              <a style="font-size: 19px; color: #000000; text-decoration: none; padding: 20px 0px 20px 0px;" href="http://localhost:8080/recovery/${id}"><span>Restablecer Contraseña</span></a>
            </div>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: left;">
            <p>
              Para que lo sepas: tienes <strong>24 horas</strong> para elegir tu
              contraseña. Después de eso, tendrás que pedir uno nuevo.
            </p>
            <p>
              ¿No pediste una nueva contraseña? Puede ignorar este correo
              electrónico.
            </p>
          </div>
          <hr/>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <h3 style="font-weight: 300; font-size: 20px">¿Preguntas?</h1>
            <p>Te esperamos en nuestras Redes</p>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <a style="padding: 0px 20px 0px 20px;" href="https://github.com/Pablo220288" target="_blank" class="contA"><img src="cid:github" alt="GitHub"></a>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <a style="padding: 0px 20px 0px 20px;" href="https://www.linkedin.com/in/pablo-hern%C3%A1ndez-19234b238/" target="_blank" class="contA"><img src="cid:linkedin" alt="Linkedin"></a>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <a style="padding: 0px 20px 0px 20px;" href="mailto:peh_tj@hotmail.com?Subject=Consulta%20Tienda%20Node%20JS" target="_blank" class="contA"><img src="cid:gmail" alt="Gmail"></a>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <h3 style="font-size: 10px;">Está recibiendo este correo electrónico porque 
            ha visitado nuestro sitio web. Asegúrese de que nuestros mensajes lleguen a su 
            Bandeja de entrada (y no a sus carpetas masivas o basura).</h3>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <a style="font-size: 12px;" href="#"> Política de privacidad</a>
            <span> | </span>
            <a style="font-size: 12px;" href="#"> Darse de baja</a>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <p>&nbsp;</p>
          </div>
          <div style="padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
            <span style="font-size: 0.7rem; font-weight: 300;">&copy;2023 - Tienda Node JS</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <a href="https://pablo220288.github.io/Portafolio_2022/" target="_blank" style="all: unset; font-family: 'The Scientist', sans-serif; cursor: pointer;">Pablo Hernandez</a>
          </div>
        </div>
      </div>
    </body>
  </html>
  `
}
export const sendMailRecovery = async (email, id, nameUser) => {
  await transporter.sendMail({
    from: '"Tienda Node JS" <devtestpeh@gmail.com>',
    to: `${email}`,
    subject: 'Recovery Password',
    html: messageHTMLRecovery(email, id, nameUser),
    attachments: [
      {
        filename: 'logo.png',
        path: './src/public/img/nodejs_xs.png',
        cid: 'logo'
      },
      {
        filename: 'linkedin.png',
        path: './src/public/img/linkedin_mail.png',
        cid: 'linkedin'
      },
      {
        filename: 'gmail.png',
        path: './src/public/img/gmail_mail.png',
        cid: 'gmail'
      },
      {
        filename: 'github.png',
        path: './src/public/img/github_mail.png',
        cid: 'github'
      }
    ]
  })
}
