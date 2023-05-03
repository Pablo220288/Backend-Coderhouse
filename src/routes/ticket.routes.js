import express, { Router } from 'express'
import __dirname from '../utils.js'
import { findTicket } from '../services/ticketService.js'

const ticketRouter = Router()

ticketRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/', async (req, res) => {
    // Buscamos los Datos del Ticket
    const ticket = await findTicket({ code: req.session.ticketCode })
    // Renderizamos el Ticket
    res.render('ticket', {
      title: 'Ticket | Backend',
      products: ticket[0].products,
      amount: ticket[0].amount,
      namePurchase: ticket[0].namePurchase,
      dni: ticket[0].dni,
      address: ticket[0].address,
      code: ticket[0].code
    })
  })

export default ticketRouter
