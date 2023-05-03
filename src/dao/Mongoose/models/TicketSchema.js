import { Schema, model } from 'mongoose'

const products = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String },
  price: { type: Number },
  totalPrice: { type: Number },
  quantity: { type: Number }
})

const TicketSchema = new Schema(
  {
    code: { type: String },
    amount: { type: Number },
    namePurchase: { type: String },
    dni: { type: String },
    address: { type: String },
    products: [products],
    purchaser: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const ticketModel = model('Ticket', TicketSchema)
