import cluster from 'cluster'
import { cpus } from 'os'

const processNumber = cpus().length

if (cluster.isPrimary) {
  console.log('Cluster Primario')
  for (let i = 0; i < processNumber; i++) {
    cluster.fork()
  }
} else {
  console.log(`Fork ${process.pid}`)
}
