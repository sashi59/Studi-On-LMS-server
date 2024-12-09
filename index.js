import express from 'express';
import dotenv from "dotenv"
import mongoose from 'mongoose';

import userRoute from "./routes/user.route.js"

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("MongoDb Connected")})

app.use(express.json());

app.use('/api/user', userRoute);


app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`)
})