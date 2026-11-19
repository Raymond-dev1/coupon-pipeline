import  {connection} from './redis.ts'
import {Queue} from 'bullmq'

export const emailQueue = new Queue('email', {
    connection: connection as any,
    defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: {age:3600, count:1000},
    removeOnFail: {age:86400}
  }
})