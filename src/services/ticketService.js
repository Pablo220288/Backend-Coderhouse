import { ticketModel } from '../dao/Mongoose/models/TicketSchema.js'

export const createTicket = async data => {
  return await ticketModel.create(data)
}
export const findTicketById = async id => {
  return await ticketModel.findById(id)
}
export const findTicket = async data => {
  return await ticketModel
    .find(data)
    .populate('products._id')
    .populate('purchaser')
}
