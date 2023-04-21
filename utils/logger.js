import { createLogger, format, transports } from 'winston'
// import MongoDB from 'winston-mongodb'
import __dirname from '../src/utils.js'

export const logger = createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-api.log`
    }),
    /*     new transports.MongoDB({
      db: process.env.MOONGOOSE_ATLAS_URL,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      cappedMax: 5
    }), */
    new transports.Console()
  ]
})
