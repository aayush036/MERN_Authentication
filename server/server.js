import express from 'express';
const app = express();
const port = 4000;
app.use(express.json());
app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});