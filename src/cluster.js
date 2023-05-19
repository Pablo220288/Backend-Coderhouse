import cluster from 'cluster'
import { cpus } from 'os'
import { logger } from '../utils/logger'

const processNumber = cpus().length

if (cluster.isPrimary) {
  logger.info('Cluster Primario')
  for (let i = 0; i < processNumber; i++) {
    cluster.fork()
  }
} else {
  logger.info(`Fork ${process.pid}`)
}
