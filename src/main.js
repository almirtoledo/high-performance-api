import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import fastify from 'fastify';
import cluster from 'node:cluster';
import os from 'node:os';
import Piscina from 'piscina';

dotenv.config();

const numCPUs = os.cpus().length;
const PORT = 3000;

const queue = new Queue('heavy-tasks', {
  connection: {
    host: process.env.VALKEY_HOST,
    port: 6379,
  },
});

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} running on ${numCPUs} CPUs`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = fastify();
  const threadPool = new Piscina({
    filename: 'src/piscina-worker.js',
    maxThreads: 4,
  });

  app.get('/customers/heavy-sync', async () => {
    const result = await threadPool.run({ input: 200 });
    return { result };
  });

  app.get('/customers/heavy-async', async () => {
    await queue.add('task', { input: 200 });
    return { status: 'queued' };
  });

  app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Worker ${process.pid} ON: ${address}`);
  });
}
