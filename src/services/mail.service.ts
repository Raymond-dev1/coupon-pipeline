import  {sendMail } from "../lib/mailer.ts"

interface EmailInput {
    email:string,
    name:string,
    code:string
}


export const sendReferralCode = async ({name, email, code}: EmailInput) =>{
    try{
        await sendMail (
            email,
             'Verify your Vouch account',
            `<h1>Hi ${name}</h1> <p>Your referral code is <strong>${code}</strong></p>`
        )
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
