// import { createTicket } from '../../../services/ticketService.js'
import * as cartService from '../../../services/cartService.js'

export const purchaseCart = async id => {
  const cart = await cartService.findCartsById(id)
  return cart
}
