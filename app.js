import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import taskRoute from './routes/task.js'
import cookieParser from "cookie-parser";
 
dotenv.config();

const app = express();
const PORT = process.env.PORT;



// ? routes

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{res.status(200).json({message:"conected"})})
app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/task",taskRoute)


// database

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://devendra:devendradhakad0101@cluster0.32w7em6.mongodb.net/mytodos?retryWrites=true&w=majority");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected!")
});
mongoose.connection.on("connected",()=>{ 
    console.log("mongoDB connected!")
});

app.listen(PORT, () => {
  connectToDB();
  console.log(`app listning on http://localhost:${PORT}`);
});
