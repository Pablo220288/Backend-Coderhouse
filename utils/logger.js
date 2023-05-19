import { createLogger, format, transports, addColors } from 'winston'
import __dirname from '../src/utils.js'
// import MongoDB from 'winston-mongodb'

const { timestamp, combine, printf, colorize, errors, json } = format

const myLogFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`
})

const myCustomLevels = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3
  },
  colors: {
    error: 'bold italic red',
    warning: 'bold italic yellow',
    info: 'bold italic green',
    debug: 'bold italic cyan'
  }
}

export const logger = createLogger({
  levels: myCustomLevels.levels,
  level: 'debug',
  transports: [
    new transports.File({
      level: 'error',
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-errors.log`,
      format: combine(timestamp(), errors({ stack: true }), myLogFormat, json())
    }),

    // Posibilidad de Guardar Logger en DB Mongo Atlas
    /*     new transports.MongoDB({
      db: process.env.MOONGOOSE_ATLAS_URL,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      cappedMax: 5
    }), */

    new transports.Console({
      format: combine(
        colorize(addColors(myCustomLevels.colors)),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        myLogFormat
      )
    })
  ]
})
