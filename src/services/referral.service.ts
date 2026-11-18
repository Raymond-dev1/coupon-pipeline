import User from '../models/users.models.js';
import { generateReferralCode } from '../utils/code.js';
import { emailQueue } from '../lib/queue.ts';

export const findByEmail = (email: string) => User.findOne({ email });

export type CreateReferralCodeInput = {
  firstname: string;
  email: string;
  idempotencyKey: number;
};

export const createReferralCode = async (
  { firstname, email, idempotencyKey }: CreateReferralCodeInput,
) => {
  try {
    const existingUser = await findByEmail(email);

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

    const referral_code = generateReferralCode(6);
    const newUser = await User.create({
      firstname,
      email,
      referral_code,
      idempotent_key: idempotencyKey,
    })
    // job to worker
    await emailQueue.add('send-referral-code', { name: firstname, email, code: referral_code });
    console.log('Referral code job added to queue');

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

