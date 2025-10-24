import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

 export default async function DBConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connection established");
  } catch (error) {
    console.log("DB Connection error " + error);
  }
};
