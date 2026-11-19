import Router from 'express'
import { emailQueue } from '../lib/queue.ts'
const router = Router()

router.post('/referral/webhook', async (req:any, res:any) =>{
    res.status(200).json({message:"Webhook received successfully"})
    const {firstname, email, idempotencyKey} = req.body
    
    await emailQueue.add('create-referral-code', { name:firstname, email, idempotencyKey })
    console.log('Referral code job added to queue')
})