import { chatModel } from '../dao/Mongoose/models/ChatSchema.js'

export const findChats = async () => {
  return await chatModel.find()
}
