import express from 'express';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
const app = express();
const port = 4000;
connectDB();
app.use(express.json());
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});