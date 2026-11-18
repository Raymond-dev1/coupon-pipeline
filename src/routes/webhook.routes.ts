import {generateReferralCode} from '../utils/code'
import { findByEMail } from '../services/referral.service'

router.post('referral/webhook', async (req:any, res:any) =>{
    return res.status(200).json({message:"Webhook received successfully"})
    const payload = req.body
})