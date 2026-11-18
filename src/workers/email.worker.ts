console.log('Email worker file loaded')

import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.ts" 
import {sendReferralCode} from "../services/mail.service.ts"
import {createReferralCode} from "../services/referral.service.ts"

import type { CreateReferralCodeInput } from "../services/referral.service.ts"

const EmailWorker  = new Worker ('email', async (job) => {
    const {name, email, idempotencyKey, code} =job.data

    switch(job.name){
        case 'send-referral-code':
            await sendReferralCode ({name, email, code})
            console.log('sendReferralCode job processed')
        case 'create-referral-code':
            await createReferralCode ({firstname:name, email, idempotencyKey} as CreateReferralCodeInput)
            console.log('createReferralCode job processed')
            break;
            default:
                throw new Error (`Unknown job type: ${job.name}`)
    }
}, {connection} as any)

EmailWorker.on("completed", (job  ) => {
  console.log(`job ${job.id} completed successfully`);
});

EmailWorker.on("failed", (job, err) => {
  console.log(`job ${job?.id} failed ${err.message}`);
});

export default EmailWorker