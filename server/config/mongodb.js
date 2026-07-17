import mongoose from "mongoose";



const connectDB = async()=>{
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
};

export default connectDB;