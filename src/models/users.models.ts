import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  firstname: string;
  email: string;
  referral_code?: string;
  idempotent_key: number;
}

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    referral_code: {
      type: String,
      unique: true,
      trim: true,
    },
    count:{
      type:Number,
    },
    idempotent_key:{
      type:Number,
      required:true,
      trim:true
    }
  },
  { timestamps: true }
);


export default mongoose.model<User>('user', UserSchema); 