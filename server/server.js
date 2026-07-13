import express from 'express';
import cors from "cors"
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import path from 'path';
const app = express();
const allowedOrigins = ['http://localhost:5173']
const port = 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(cors())

const __dirname = path.resolve();


// API endpoints

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter)

app.use(express.static(path.join(__dirname,'/client/dist')))
app.use((_,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});