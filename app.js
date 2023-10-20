import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import taskRoute from "./routes/task.js";
import cookieParser from "cookie-parser";

import cluster from "node:cluster";
import cpus from "node:os";
const numCpus = cpus.cpus.length;
import process from "node:process";

//* Cluster
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const PORT = process.env.PORT;

  // ? routes

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.status(200).json({ message: "conected" });
  });
  app.use("/api/auth", authRoute);
  app.use("/api/user", userRoute);
  app.use("/api/task", taskRoute);

  // database

  const connectToDB = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://devendra:devendradhakad0101@cluster0.32w7em6.mongodb.net/mytodos?retryWrites=true&w=majority"
      );
      console.log("MongoDB connected");
    } catch (error) {
      console.log(error);
    }
  };

  mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
  });
  mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!");
  });

  app.listen(PORT, () => {
    connectToDB();
    console.log(`app listning on http://localhost:${PORT}`);
  });
}
