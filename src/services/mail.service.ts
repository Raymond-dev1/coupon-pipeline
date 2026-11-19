import  {sendMail } from "../lib/mailer.ts"
import User from "../models/users.models.ts"

interface EmailInput {
    email:string,
    name:string,
    code:string
}


export const sendReferralCode = async ({name, email, code}: EmailInput) =>{
    try{
        await sendMail (
            email,
             'Your Referral Code :)',
            `<h1>Hi ${name}</h1> <p>Your referral code is <strong>${code}</strong></p>`
        )
        // await User.findOneAndUpdate({email}, {referral_email_sent:true})
        const claimed = await User.findOneAndUpdate(
           { email, referral_email_sent: { $ne: true } },
  { $set: { referral_email_sent: true } },
  { new: true },
        )
        if (!claimed) return { success: true, message: 'already sent' }

        return{
            status: 200,
            success:true,
            message: 'Referral code sent successfully' 
        }
    }catch(error){
        console.error('error in sendReferralCode : ', error)
        return {success:false, message: 'internal server error', error}
    }
}
