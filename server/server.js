import express from 'express';
import cors from "cors"
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
const app = express();
const allowedOrigins = ['http://localhost:5173']
const port = 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});