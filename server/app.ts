import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute";
import addressRoutes from "./routes/addressRoute";
import cors from 'cors'

dotenv.config({ path: "./.env" });
const application = express();
application.use(cors({
  origin: true,
  credentials: true // Allow cookies to be sent
}));

application.use(express.json());
const databaseURI = process.env.MONGO_URI || "";
mongoose.connect(databaseURI, {}).then((connection: any) => {
  console.log("Database connection successful");
});

if (process.env.NODE_ENV === "development") {
  application.use(morgan("dev"));
}

application.use(express.static(path.join(__dirname, "public")));

application.use("/api/v1/users", userRouter);
application.use("/api/v1/address", addressRoutes);

export default application;
