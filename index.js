import express from 'express';
import dotenv from "dotenv"
import mongoose from 'mongoose';
import Razarpay from "razorpay"

import userRoute from "./routes/user.route.js"
import courseRoute from "./routes/course.route.js"
import adminRoute from "./routes/admin.route.js"

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("MongoDb Connected")})

export const instance = new Razarpay({
    key_id:process.env.RAZARPAY_KEY,
    key_secret: process.env.RAZARPAY_SECRET,
    currency: "INR"  
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use('/api/user', userRoute);
app.use('/api/course', courseRoute);
app.use('/api/admin', adminRoute);


app.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}`)
})