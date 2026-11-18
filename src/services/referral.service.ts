import User from './users.models'
import { generateReferralCode } from '../utils/code'

export const findByEMail = (email: string) => User.findOne({ email });

export const createReferralCode = async({firstname, email}:User, idempotency_key:number)=>{
    try{
        const existingUser= await findByEMail(email)
        if(existingUser){
            return{status:409, success:false, referral_code:existingUser.referral_code, existingUser}
        }
        if (idempotency_key === existingUser?.idempotent_key){
            return{status:409, success:false, message:"Duplicate request"}
        }

        const referral_code = await generateReferralCode(6)
        const newUser= await User.create({firstname, email, referral_code})
        
        return{status:201, success:true, message:"User registered Successfully", referral_code:existingUser.referral_code, newUser}
    }catch(error){
        console.error('Error in createReferralCode', error)
        return{status:500, success:false, message:"internal server error"}
    }
}

