import User from '../models/users.models.js';
import { generateReferralCode } from '../utils/code.js';

export const findByEMail = (email: string) => User.findOne({ email });

type CreateReferralCodeInput = {
  firstname: string;
  email: string;
  idempotencyKey: number;
};

export const createReferralCode = async (
  { firstname, email, idempotencyKey }: CreateReferralCodeInput,
) => {
  try {
    const existingUser = await findByEMail(email);

    if (existingUser?.idempotent_key === idempotencyKey) {
      return { status: 409, success: false, message: 'Duplicate request' };
    };

    if (existingUser) {
      return {
        status: 409,
        success: false,
        referral_code: existingUser.referral_code,
        existingUser,
      };
    }

    const referral_code = await generateReferralCode(6);
    const newUser = await User.create({
      firstname,
      email,
      referral_code,
      idempotent_key: idempotencyKey,
    });

    return {
      status: 201,
      success: true,
      message: 'User registered Successfully',
      referral_code,
      newUser,
    };
  } catch (error) {
    console.error('Error in createReferralCode', error);
    return { status: 500, success: false, message: 'internal server error' };
  }
}

