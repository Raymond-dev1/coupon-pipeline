import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config()
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:',error)
    }
}

module.exports={ connectDB}