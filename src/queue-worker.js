import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import { heavyTask } from './heavyTask.js';

dotenv.config();

const connection = {
  host: process.env.VALKEY_HOST,
  port: 6379,
};

const worker = new Worker(
  'heavy-tasks',
  async (job) => {
    console.log(`Processing a job ID ${job.id}`);
    const total = heavyTask(job.data.input || 200);
    console.log(`Job ${job.id} already! total: ${total}`);
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} finish`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
