import mongoose, { Document, Schema } from 'mongoose';

export interface Code extends Document {
    firstName:string 
    discount_code: string
    count: number
}

const DiscountSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    discount_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    count: {
      type: Number,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model<Code>('discount_code', DiscountSchema); 