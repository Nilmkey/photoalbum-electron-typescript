import express, { type Express } from "express";
import router from "./routes/auth.routes.ts";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookie from "cookie-parser";

dotenv.config();

const connectDB = async () => {
  try {
    // if (!process.env["URL_DB"]) throw new Error("no url db");
    await mongoose.connect(process.env["URL_BD"]!);
    console.log("DB has been connected");
  } catch (e) {
    console.log("DB ERR:" + e);
  }
};

const app: Express = express();
async function startServer() {
  app.use(
    cors({
      origin: "http://localhost:3051",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use(cookie());
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use("/api", router);

  await connectDB();

  app.listen(process.env["PORT"], (err) => {
    if (!err) {
      console.log("start");
    } else {
      console.log(err);
    }
  });
}

export default startServer;
