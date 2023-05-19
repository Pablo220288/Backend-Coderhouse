import { createLogger, format, transports } from 'winston'
// import MongoDB from 'winston-mongodb'
import __dirname from '../src/utils.js'

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    debug: 'green'
  }
}

export const logger = createLogger({
  levels: customLevels.levels,
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
